'use server';

import { db } from '@/db';
import { workOrders, operators, workOrderSeq } from '@/db/schema';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SessionPayload, signSession, verifySessionToken, verifyPin } from '@/lib/auth';

export async function getOperators() {
  try {
    const list = await db
      .select({
        id: operators.id,
        name: operators.name,
        system_name: operators.system_name,
        role: operators.role,
        active: operators.active,
      })
      .from(operators)
      .where(eq(operators.active, true))
      .orderBy(operators.name);
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

    const base = conditions.length > 0 ? and(...conditions) : undefined;

    const list = await db
      .select()
      .from(workOrders)
      .where(base)
      .orderBy(desc(workOrders.created_at));

    // Compute Metrics in SQL (single aggregation query, honors filters)
    const [agg] = await db
      .select({
        totalOrders: sql<number>`count(*)::int`,
        completedOrders: sql<number>`count(*) filter (where ${workOrders.status} = 'Confirmed' or ${workOrders.status} = 'Completed')::int`,
        amountCollected: sql<number>`coalesce(sum(${workOrders.amount_paid}), 0)::int`,
        amountPending: sql<number>`coalesce(sum(${workOrders.amount_due}), 0)::int`,
      })
      .from(workOrders)
      .where(base);

    return {
      success: true,
      data: list,
      metrics: {
        totalOrders: agg?.totalOrders ?? 0,
        completedOrders: agg?.completedOrders ?? 0,
        amountCollected: agg?.amountCollected ?? 0,
        amountPending: agg?.amountPending ?? 0,
      },
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

    // Generate unique WO-XXXX number atomically.
    // A dedicated sequence row (work_order_seq) is incremented in a single
    // INSERT ... ON CONFLICT ... RETURNING statement, so concurrent operators
    // can never receive the same number. Falls back to the old count-based
    // method only if the sequence table has not been provisioned yet (dev).
    let nextSeq: number;
    try {
      const seqRes = await db
        .insert(workOrderSeq)
        .values({ id: 1, seq: 2046 })
        .onConflictDoUpdate({
          target: workOrderSeq.id,
          set: { seq: sql`${workOrderSeq.seq} + 1` },
        })
        .returning({ seq: workOrderSeq.seq });
      nextSeq = seqRes[0]?.seq ?? 2047;
    } catch {
      const countRes = await db.select({ count: sql<number>`count(*)` }).from(workOrders);
      nextSeq = (Number(countRes[0]?.count) || 0) + 2047;
    }
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

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function loginOperator(formData: {
  operatorId: string;
  system: string;
  pin: string;
}) {
  try {
    if (!formData.operatorId || !formData.system || !formData.pin) {
      return { error: 'Select an operator, workstation and enter your PIN' };
    }

    const [op] = await db
      .select({
        id: operators.id,
        name: operators.name,
        role: operators.role,
        pin_hash: operators.pin_hash,
        active: operators.active,
      })
      .from(operators)
      .where(eq(operators.id, formData.operatorId))
      .limit(1);

    if (!op) return { error: 'Operator not found' };
    if (!op.active) return { error: 'This operator account is deactivated' };
    if (!op.pin_hash) {
      return { error: 'PIN not configured for this operator. Run `npm run seed` to set PINs.' };
    }
    if (!verifyPin(formData.pin, op.pin_hash)) {
      return { error: 'Incorrect PIN. Please try again.' };
    }

    const { token, exp } = signSession({
      id: op.id,
      name: op.name,
      role: op.role || 'Operator',
      system: formData.system,
    });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(exp),
    });

    return {
      success: true,
      data: { id: op.id, name: op.name, role: op.role || 'Operator', system: formData.system },
    };
  } catch (err: any) {
    console.error('loginOperator error:', err);
    return { error: err.message || 'Failed to sign in' };
  }
}

export async function logoutOperator() {
  try {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to sign out' };
  }
}

export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    const session = verifySessionToken(token) as SessionPayload | null;
    if (!session) return { authenticated: false };
    return {
      authenticated: true,
      data: { id: session.id, name: session.name, role: session.role, system: session.system },
    };
  } catch (err: any) {
    console.error('getSession error:', err);
    return { authenticated: false };
  }
}