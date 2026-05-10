'use server';

import { db } from '@/db';
import { users, attendance } from '@/db/schema';
import { eq, and, desc, sql, count, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Attendance ───────────────────────────────────────────────

export async function getAttendance(dateStr?: string) {
  const date = dateStr || getTodayIST();
  const allUsers = await db.select().from(users).where(eq(users.active, 'true')).orderBy(users.name);
  const records = await db.select().from(attendance).where(eq(attendance.date, date));

  const recordMap = new Map(records.map(r => [r.user_id, r.status]));
  return allUsers.map(u => ({
    id: u.id,
    name: u.name,
    role: u.role,
    status: recordMap.get(u.id) || null,
  }));
}

export async function saveAttendance(records: { userId: string; status: string; date: string }[]) {
  try {
    const date = records[0]?.date || getTodayIST();
    await db.delete(attendance).where(eq(attendance.date, date));
    if (records.length > 0) {
      await db.insert(attendance).values(
        records.map(r => ({ user_id: r.userId, date: r.date, status: r.status as any }))
      );
    }
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error saving attendance:', error);
    return { error: 'Failed to save attendance' };
  }
}

// ─── Users ────────────────────────────────────────────────────

export async function getUsers(search?: string, roleFilter?: string) {
  const conditions = [eq(users.active, 'true')];
  if (search) conditions.push(sql`LOWER(${users.name}) LIKE LOWER(${'%' + search + '%'})`);
  if (roleFilter && roleFilter !== 'ALL') conditions.push(eq(users.role, roleFilter as any));

  const allUsers = await db.select().from(users).where(and(...conditions)).orderBy(users.name);

  const summaries = await db.select({
    userId: attendance.user_id,
    presentDays: count(),
    lastActive: max(attendance.date),
  }).from(attendance)
    .where(eq(attendance.status, 'PRESENT'))
    .groupBy(attendance.user_id);

  const summaryMap = new Map(summaries.map(s => [s.userId, { presentDays: s.presentDays, lastActive: s.lastActive }]));

  return allUsers.map(u => ({
    id: u.id,
    name: u.name,
    phone: u.phone,
    role: u.role,
    presentDays: summaryMap.get(u.id)?.presentDays || 0,
    lastActive: summaryMap.get(u.id)?.lastActive || null,
  }));
}

export async function addUser(data: { name: string; phone?: string; role: 'ADMIN' | 'MANAGER' | 'OPERATOR' }) {
  try {
    await db.insert(users).values({ name: data.name, phone: data.phone || null, role: data.role });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    return { error: 'Failed to add user' };
  }
}

export async function updateUser(id: string, data: { name?: string; phone?: string; role?: 'ADMIN' | 'MANAGER' | 'OPERATOR' }) {
  try {
    await db.update(users).set(data).where(eq(users.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'Failed to update user' };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.update(users).set({ active: 'false' }).where(eq(users.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
}

export async function getUserAttendanceHistory(userId: string, fromDate?: string, toDate?: string) {
  const conditions = [eq(attendance.user_id, userId)];
  if (fromDate) conditions.push(sql`${attendance.date} >= ${fromDate}`);
  if (toDate) conditions.push(sql`${attendance.date} <= ${toDate}`);

  const records = await db.select()
    .from(attendance)
    .where(and(...conditions))
    .orderBy(desc(attendance.date))
    .limit(90);

  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;
  const halfDay = records.filter(r => r.status === 'HALF_DAY').length;

  return { records, stats: { present, absent, halfDay, total: records.length } };
}
