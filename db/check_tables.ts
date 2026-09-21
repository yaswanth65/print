import { db } from './index';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const res = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    console.log(res.rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
check();
