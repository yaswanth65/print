import { db } from './index';
import { users, documents, transactions, counter_cash_entries, attendance } from './schema';

async function main() {
  console.log('Seeding database...');

  await db.delete(attendance);
  await db.delete(counter_cash_entries);
  await db.delete(transactions);
  await db.delete(documents);
  await db.delete(users);

  const [admin] = await db.insert(users).values({
    name: 'Admin', phone: '9999999991', role: 'ADMIN',
  }).returning();
  const [manager] = await db.insert(users).values({
    name: 'Manager', phone: '9999999992', role: 'MANAGER',
  }).returning();
  const operators = await db.insert(users).values([
    { name: 'Ravi Kumar', phone: '9999999993', role: 'OPERATOR' },
    { name: 'Sita Reddy', phone: '9999999994', role: 'OPERATOR' },
    { name: 'Venkat Rao', phone: '9999999995', role: 'OPERATOR' },
    { name: 'Latha Devi', phone: '9999999996', role: 'OPERATOR' },
    { name: 'Mohan Das', phone: '9999999997', role: 'OPERATOR' },
  ]).returning();

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;

  function istDate(hours: number, minutes: number): Date {
    const ist = new Date(now.getTime() + istOffset);
    ist.setUTCHours(hours, minutes, 0, 0);
    return new Date(ist.getTime() - istOffset);
  }

  function istDateStr(daysAgo: number): string {
    const ist = new Date(now.getTime() + istOffset);
    ist.setUTCDate(ist.getUTCDate() - daysAgo);
    const y = ist.getUTCFullYear();
    const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
    const d = String(ist.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  await db.insert(counter_cash_entries).values({
    amount: 5000,
    reason: 'MANUAL_ADDITION',
    notes: 'Opening cash',
    created_at: istDate(8, 0),
  });

  await db.insert(transactions).values([
    {
      entry_type: 'DOCUMENT_PAYMENT', payment_method: 'UPI',
      bill_amount: 500, received_amount: 500, amount_collected: 500,
      document_title: 'Rental Agreement - Kumar', created_at: istDate(9, 30),
    },
    {
      entry_type: 'DOCUMENT_PAYMENT', payment_method: 'CASH',
      bill_amount: 1200, received_amount: 1500, change_amount: 300, amount_collected: 1200,
      document_title: 'Affidavit - Priya', created_at: istDate(10, 15),
    },
    {
      entry_type: 'DOCUMENT_PAYMENT', payment_method: 'UPI',
      bill_amount: 800, received_amount: 800, amount_collected: 800,
      document_title: 'Direct Payment - Reddy', created_at: istDate(11, 0),
    },
    {
      entry_type: 'DOCUMENT_PAYMENT', payment_method: 'CASH',
      bill_amount: 2000, received_amount: 2000, amount_collected: 2000,
      document_title: 'Rental Agreement - Sita', created_at: istDate(12, 30),
    },
    {
      entry_type: 'MANUAL_CASH_ADDITION', amount_collected: 5000,
      document_title: 'MANUAL CASH ENTRY', notes: 'Opening cash',
      created_at: istDate(8, 0),
    },
  ]);

  await db.insert(attendance).values([
    { user_id: admin.id, date: istDateStr(1), status: 'PRESENT' },
    { user_id: manager.id, date: istDateStr(1), status: 'PRESENT' },
    { user_id: operators[0].id, date: istDateStr(1), status: 'PRESENT' },
    { user_id: operators[1].id, date: istDateStr(1), status: 'PRESENT' },
    { user_id: operators[2].id, date: istDateStr(1), status: 'ABSENT' },
    { user_id: operators[3].id, date: istDateStr(1), status: 'PRESENT' },
    { user_id: operators[4].id, date: istDateStr(1), status: 'HALF_DAY' },
    { user_id: admin.id, date: istDateStr(2), status: 'PRESENT' },
    { user_id: manager.id, date: istDateStr(2), status: 'ABSENT' },
    { user_id: operators[0].id, date: istDateStr(2), status: 'PRESENT' },
    { user_id: operators[1].id, date: istDateStr(2), status: 'ABSENT' },
    { user_id: operators[2].id, date: istDateStr(2), status: 'PRESENT' },
    { user_id: operators[3].id, date: istDateStr(2), status: 'PRESENT' },
    { user_id: operators[4].id, date: istDateStr(2), status: 'PRESENT' },
    { user_id: admin.id, date: istDateStr(3), status: 'PRESENT' },
    { user_id: manager.id, date: istDateStr(3), status: 'PRESENT' },
    { user_id: operators[0].id, date: istDateStr(3), status: 'HALF_DAY' },
    { user_id: operators[1].id, date: istDateStr(3), status: 'PRESENT' },
    { user_id: operators[2].id, date: istDateStr(3), status: 'PRESENT' },
    { user_id: operators[3].id, date: istDateStr(3), status: 'ABSENT' },
    { user_id: operators[4].id, date: istDateStr(3), status: 'PRESENT' },
  ]);

  console.log('Database seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to seed:', err);
  process.exit(1);
});
