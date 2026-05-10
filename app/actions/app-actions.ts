'use server';

import { db } from '@/db';
import { documents, transactions, counter_cash_entries } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
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



// Dashboard Metrics
export async function getDashboardMetrics(startDateStr?: string, endDateStr?: string) {
  const start = startDateStr ? new Date(startDateStr) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = endDateStr ? new Date(endDateStr) : new Date();
  end.setHours(23, 59, 59, 999);

  const txs = await db.select().from(transactions).orderBy(desc(transactions.created_at));

  const filteredTxs = txs.filter(t => {
    const d = new Date(t.created_at!);
    return d >= start && d <= end;
  });
  
  const earnings = filteredTxs.reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const cashTotal = filteredTxs.filter(t => t.payment_method === 'CASH').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const upiTotal = filteredTxs.filter(t => t.payment_method === 'UPI').reduce((sum, t) => sum + (t.amount_collected || 0), 0);

  const allCashTxs = txs.filter(t => t.payment_method === 'CASH').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  const allManualAdditions = txs.filter(t => t.entry_type === 'MANUAL_CASH_ADDITION').reduce((sum, t) => sum + (t.amount_collected || 0), 0);
  
  const counterCash = allCashTxs + allManualAdditions;

  return {
    todaysEarnings: earnings,
    cashTotal,
    upiTotal,
    counterCash,
    pendingPaymentsCount: 0,
    totalDocumentsPrinted: 0,
    recentTransactions: filteredTxs.slice(0, 50),
  };
}
