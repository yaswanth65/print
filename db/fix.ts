import { db } from './index';
import { sql } from 'drizzle-orm';

async function fix() {
  console.log('Fixing operators table...');
  try {
    await db.execute(sql`ALTER TABLE "operators" ADD COLUMN IF NOT EXISTS "role" varchar(50) DEFAULT 'Operator';`);
    await db.execute(sql`ALTER TABLE "operators" ADD COLUMN IF NOT EXISTS "pin_hash" varchar(300);`);
    await db.execute(sql`ALTER TABLE "operators" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true;`);
    await db.execute(sql`ALTER TABLE "operators" ADD COLUMN IF NOT EXISTS "system_name" varchar(50);`);
    console.log('Fixed!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
}
fix();
