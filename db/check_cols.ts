import { db } from './index';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const res = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'work_orders';
    `);
    console.log(res.rows.map(r => r.column_name));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
check();
