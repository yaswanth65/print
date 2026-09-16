import { db } from './index';
import { sql } from 'drizzle-orm';

async function resetOperators() {
  console.log('Resetting operators table to exactly 5 users...');
  try {
    await db.execute(sql`TRUNCATE TABLE "operators" RESTART IDENTITY CASCADE;`);
    console.log('Operators table truncated.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

resetOperators();
