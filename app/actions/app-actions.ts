'use server';

import { db } from '@/db';
import { documents, transactions, counter_cash_entries } from '@/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Operator Actions (Removed)

// Manager Actions
export async function createIndependentPayment(billAmount: number, receivedAmount: number, paymentMethod: 'CASH' | 'UPI') {
  if (receivedAmount < 0 || billAmount < 0) return { error: 'Invalid amount' };

  try {
    const amountCollected = billAmount;
    const changeAmount = paymentMethod === 'CASH' ? Math.max(0, receivedAmount - billAmount) : 0;
    const finalReceived = paymentMethod === 'CASH' ? receivedAmount : billAmount;

    await db.insert(transactions).values({
      entry_type: 'DOCUMENT_PAYMENT',
      payment_method: paymentMethod,
      bill_amount: billAmount,
      received_amount: finalReceived,
      change_amount: changeAmount,
      amount_collected: amountCollected,
      document_title: 'Direct Payment'
    });

    revalidatePath('/manager');
    revalidatePath('/admin');
    return { success: true, changeAmount };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { error: 'Failed to process payment' };
  }
}

export async function addManualCash(amount: number, notes: string) {
  if (amount <= 0) return { error: 'Invalid amount' };

  try {
    const [entry] = await db.insert(counter_cash_entries).values({
      amount,
      reason: 'MANUAL_ADDITION',
      notes,
    }).returning();

    await db.insert(transactions).values({
      document_title: 'MANUAL CASH ENTRY',
      entry_type: 'MANUAL_CASH_ADDITION',
      amount_collected: amount,
      notes,
    });

    revalidatePath('/manager');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error adding cash:', error);
    return { error: 'Failed to add manual cash' };
  }
}



// ─── IST Helpers ──────────────────────────────────────────────
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

function istDateStrToUTCRange(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const startUTC = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)).getTime() - IST_OFFSET;
  const endUTC = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999)).getTime() - IST_OFFSET;
  return { start: new Date(startUTC), end: new Date(endUTC) };
}

function getTodayISTRange() {
  const now = new Date();
  const istMS = now.getTime() + IST_OFFSET;
  const istDate = new Date(istMS);
  const y = istDate.getUTCFullYear();
  const m = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(istDate.getUTCDate()).padStart(2, '0');
  return istDateStrToUTCRange(`${y}-${m}-${d}`);
}

// Dashboard Metrics
export async function getDashboardMetrics(startDateStr?: string, endDateStr?: string) {
  let start: Date, end: Date;

  if (startDateStr && endDateStr) {
    const sRange = istDateStrToUTCRange(startDateStr);
    const eRange = istDateStrToUTCRange(endDateStr);
    start = sRange.start;
    end = eRange.end;
  } else {
    const range = getTodayISTRange();
    start = range.start;
    end = range.end;
  }

  const txs = await db.select().from(transactions)
    .where(and(gte(transactions.created_at, start), lte(transactions.created_at, end)))
    .orderBy(desc(transactions.created_at));
  
  const earnings = txs.reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const cashTotal = txs.filter(t => t.payment_method === 'CASH').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const upiTotal = txs.filter(t => t.payment_method === 'UPI').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const manualCash = txs.filter(t => t.entry_type === 'MANUAL_CASH_ADDITION').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const counterCash = cashTotal + manualCash;

  return {
    todaysEarnings: earnings,
    cashTotal,
    upiTotal,
    counterCash,
    pendingPaymentsCount: 0,
    totalDocumentsPrinted: 0,
    recentTransactions: txs.slice(0, 50),
  };
}
