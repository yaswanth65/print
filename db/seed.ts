import { db } from './index';
import { users, documents, transactions, counter_cash_entries } from './schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Seeding database...');
  
  // Clear existing
  await db.delete(counter_cash_entries);
  await db.delete(transactions);
  await db.delete(documents);
  await db.delete(users);

  // Users
  const [admin] = await db.insert(users).values({ name: 'Admin', role: 'ADMIN' }).returning();
  const [manager] = await db.insert(users).values({ name: 'Manager', role: 'MANAGER' }).returning();
  const [operator] = await db.insert(users).values({ name: 'Operator', role: 'OPERATOR' }).returning();

  // Documents
  const [doc1] = await db.insert(documents).values({
    customer_name: 'John Doe',
    document_title: 'Rental Agreement',
    template_type: 'rental',
    status: 'PENDING_PAYMENT',
    created_by: operator.id,
  }).returning();

  const [doc2] = await db.insert(documents).values({
    customer_name: 'Jane Smith',
    document_title: 'Affidavit',
    template_type: 'affidavit',
    status: 'PENDING_PAYMENT',
    created_by: operator.id,
  }).returning();

  console.log('Database seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to seed:', err);
  process.exit(1);
});
