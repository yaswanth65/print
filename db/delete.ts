import { db } from './index';
import { operators } from './schema';
import { inArray } from 'drizzle-orm';

async function deleteExtra() {
  console.log('Deleting extra operators...');
  try {
    await db.delete(operators).where(inArray(operators.name, ['Ravi', 'Prasad', 'Sunil']));
    console.log('Deleted Ravi, Prasad, and Sunil.');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
}
deleteExtra();
