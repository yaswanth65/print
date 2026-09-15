'use server';

import { db } from '@/db';
import { workOrders, operators } from '@/db/schema';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getOperators() {
  try {
    const list = await db.select().from(operators).where(eq(operators.active, true)).orderBy(operators.name);
    return { success: true, data: list };
  } catch (err: any) {
    console.error('getOperators error:', err);
    return { error: err.message || 'Failed to fetch operators' };
  }
}

export async function getWorkOrders(filters?: {
  search?: string;
  status?: string;
}) {
  try {
    const conditions = [];

    if (filters?.status && filters.status !== 'All Status' && filters.status !== 'ALL') {
      conditions.push(eq(workOrders.status, filters.status));
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          sql`LOWER(${workOrders.customer_name}) LIKE LOWER(${q})`,
          sql`LOWER(${workOrders.customer_contact}) LIKE LOWER(${q})`,
          sql`LOWER(${workOrders.wo_number}) LIKE LOWER(${q})`,
          sql`LOWER(${workOrders.document_type}) LIKE LOWER(${q})`
        )
      );
    }

    const query = conditions.length > 0
      ? db.select().from(workOrders).where(and(...conditions)).orderBy(desc(workOrders.created_at))
      : db.select().from(workOrders).orderBy(desc(workOrders.created_at));

    const list = await query;

    // Compute Metrics
    const all = await db.select().from(workOrders);
    const totalCount = all.length;
    const completedCount = all.filter(w => w.status === 'Confirmed' || w.status === 'Completed').length;
    const totalCollected = all.reduce((sum, w) => sum + (w.amount_paid || 0), 0);
    const totalPending = all.reduce((sum, w) => sum + (w.amount_due || 0), 0);

    return {
      success: true,
      data: list,
      metrics: {
        totalOrders: totalCount,
        completedOrders: completedCount,
        amountCollected: totalCollected,
        amountPending: totalPending,
      }
    };
  } catch (err: any) {
    console.error('getWorkOrders error:', err);
    return { error: err.message || 'Failed to fetch work orders' };
  }
}

export async function createWorkOrder(formData: {
  customer_name: string;
  customer_contact: string;
  document_type: string;
  wo_amount: number;
  amount_paid: number;
  due_date?: string;
  status?: string;
  internal_notes?: string;
  created_by?: string;
  system_name?: string;
}) {
  try {
    if (!formData.customer_name || !formData.customer_contact || !formData.document_type) {
      return { error: 'Please fill all required fields' };
    }

    // Generate unique WO-XXXX number
    const countRes = await db.select({ count: sql<number>`count(*)` }).from(workOrders);
    const nextSeq = (Number(countRes[0]?.count) || 0) + 2047;
    const wo_number = `WO-${nextSeq}`;

    const amountPaid = Number(formData.amount_paid) || 0;
    const woAmount = Number(formData.wo_amount) || 0;
    const amountDue = Math.max(0, woAmount - amountPaid);

    const [created] = await db.insert(workOrders).values({
      wo_number,
      customer_name: formData.customer_name,
      customer_contact: formData.customer_contact,
      document_type: formData.document_type,
      wo_amount: woAmount,
      amount_paid: amountPaid,
      amount_due: amountDue,
      due_date: formData.due_date || new Date().toISOString().split('T')[0],
      status: formData.status || 'Pending',
      internal_notes: formData.internal_notes || '',
      created_by: formData.created_by || 'Operator',
      system_name: formData.system_name || 'System 1',
    }).returning();

    revalidatePath('/');
    revalidatePath('/operator');
    return { success: true, data: created };
  } catch (err: any) {
    console.error('createWorkOrder error:', err);
    return { error: err.message || 'Failed to create work order' };
  }
}

export async function updateWorkOrderStatus(id: string, status: string) {
  try {
    await db.update(workOrders).set({ status }).where(eq(workOrders.id, id));
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to update status' };
  }
}
