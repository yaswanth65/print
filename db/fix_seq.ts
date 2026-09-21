import { db } from './index';
import { workOrderSeq } from './schema';
import { eq } from 'drizzle-orm';

async function fixSeq() {
  try {
    await db.update(workOrderSeq).set({ seq: 2100 }).where(eq(workOrderSeq.id, 1));
    console.log('Fixed sequence to 2100');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
fixSeq();
