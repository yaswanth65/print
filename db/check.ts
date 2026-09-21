import { db } from './index';
import { operators } from './schema';

async function check() {
  const ops = await db.select().from(operators);
  console.log('Operators:', ops);
  process.exit(0);
}
check();
