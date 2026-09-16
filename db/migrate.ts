import { db } from './index';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Starting migration manually...');

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "work_order_seq" (
        "id" integer PRIMARY KEY NOT NULL,
        "seq" integer NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "work_orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "wo_number" varchar(50) NOT NULL,
        "customer_name" varchar(255) NOT NULL,
        "customer_contact" varchar(50) NOT NULL,
        "document_type" varchar(100) NOT NULL,
        "wo_amount" integer DEFAULT 0 NOT NULL,
        "amount_paid" integer DEFAULT 0 NOT NULL,
        "amount_due" integer DEFAULT 0 NOT NULL,
        "due_date" varchar(50),
        "status" varchar(50) DEFAULT 'Pending' NOT NULL,
        "internal_notes" text,
        "created_by" varchar(100),
        "system_name" varchar(50),
        "created_at" timestamp with time zone DEFAULT now()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "operators" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(100) NOT NULL,
        "system_name" varchar(50) NOT NULL,
        "role" varchar(50) DEFAULT 'Operator',
        "pin_hash" varchar(300),
        "active" boolean DEFAULT true,
        "created_at" timestamp with time zone DEFAULT now()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "document_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "customer_name" varchar(255) NOT NULL,
        "customer_contact" varchar(50) NOT NULL,
        "document_type" varchar(100) NOT NULL,
        "document_name" varchar(255) NOT NULL,
        "operator_name" varchar(100) DEFAULT 'Operator',
        "system_name" varchar(50) DEFAULT 'System 1',
        "amount" integer DEFAULT 0,
        "status" varchar(50) DEFAULT 'Saved',
        "document_data" text,
        "created_at" timestamp with time zone DEFAULT now()
      );
    `);
    
    // Attempt to add a unique constraint if not exists (might fail if already exists)
    try {
        await db.execute(sql`ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_wo_number_unique" UNIQUE("wo_number");`);
    } catch(e) {}

    console.log('Migration completed!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
