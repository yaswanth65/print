import { pgTable, uuid, varchar, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const workOrders = pgTable('work_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  wo_number: varchar('wo_number', { length: 50 }).notNull().unique(),
  customer_name: varchar('customer_name', { length: 255 }).notNull(),
  customer_contact: varchar('customer_contact', { length: 50 }).notNull(),
  document_type: varchar('document_type', { length: 100 }).notNull(),
  wo_amount: integer('wo_amount').notNull().default(0),
  amount_paid: integer('amount_paid').notNull().default(0),
  amount_due: integer('amount_due').notNull().default(0),
  due_date: varchar('due_date', { length: 50 }),
  status: varchar('status', { length: 50 }).notNull().default('Pending'),
  internal_notes: text('internal_notes'),
  created_by: varchar('created_by', { length: 100 }),
  system_name: varchar('system_name', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const operators = pgTable('operators', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  system_name: varchar('system_name', { length: 50 }).notNull(),
  active: boolean('active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
