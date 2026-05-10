import { pgTable, uuid, varchar, jsonb, timestamp, integer, text, pgEnum } from 'drizzle-orm/pg-core';

export const documentStatusEnum = pgEnum('document_status', ['PENDING_PAYMENT', 'PAID']);
export const entryTypeEnum = pgEnum('entry_type', ['DOCUMENT_PAYMENT', 'MANUAL_CASH_ADDITION']);
export const paymentMethodEnum = pgEnum('payment_method', ['CASH', 'UPI']);
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'OPERATOR']);

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  customer_name: varchar('customer_name', { length: 255 }).notNull(),
  document_title: varchar('document_title', { length: 255 }).notNull(),
  template_type: varchar('template_type', { length: 255 }),
  template_data: jsonb('template_data'),
  bill_amount: integer('bill_amount'),
  status: documentStatusEnum('status').default('PENDING_PAYMENT').notNull(),
  created_by: uuid('created_by'),
  printed_at: timestamp('printed_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  document_id: uuid('document_id'),
  customer_name: varchar('customer_name', { length: 255 }),
  document_title: varchar('document_title', { length: 255 }).notNull(),
  entry_type: entryTypeEnum('entry_type').notNull(),
  payment_method: paymentMethodEnum('payment_method'),
  bill_amount: integer('bill_amount'),
  received_amount: integer('received_amount'),
  change_amount: integer('change_amount'),
  amount_collected: integer('amount_collected').notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  created_by: uuid('created_by'),
});

export const counter_cash_entries = pgTable('counter_cash_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: integer('amount').notNull(),
  reason: varchar('reason', { length: 255 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  created_by: uuid('created_by'),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
});


