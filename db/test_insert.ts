import { db } from './index';
import { workOrders } from './schema';

async function testInsert() {
  try {
    const res = await db.insert(workOrders).values({
      wo_number: 'WO-9999',
      customer_name: 'yash',
      customer_contact: '1234567890',
      document_type: 'CDMA Death Corrections Application Form (Government / Municipal Forms)',
      wo_amount: 160,
      amount_paid: 150,
      amount_due: 10,
      due_date: '16-09-2026',
      status: 'Completed',
      internal_notes: 'done',
      created_by: 'Jagadeeshwar Dhondi',
      system_name: 'System 1',
    }).returning();
    console.log(res);
  } catch (err: any) {
    console.error('ERROR:', err);
  }
  process.exit(0);
}
testInsert();
