import { db } from './index';
import { operators, workOrderSeq } from './schema';
import { hashPin } from '../lib/auth';

const OPERATORS_LIST = [
  { id: '1', name: 'Jagadeeshwar Dhondi', role: 'Senior Operator' },
  { id: '2', name: 'Pradhyumn Dhondi', role: 'Chief Operator' },
  { id: '3', name: 'Poshetty', role: 'Legal Documentation' },
  { id: '4', name: 'Vennela', role: 'Forms & DTP' },
  { id: '5', name: 'Manikanta', role: 'General Operator' },
];

async function seed() {
  console.log('Starting seed...');

  try {
    for (let i = 0; i < OPERATORS_LIST.length; i++) {
      const op = OPERATORS_LIST[i];
      // Generate a pin: 1001, 1002, ... or 1234
      const pin = i < 5 ? (1001 + i).toString() : '1234';
      
      await db.insert(operators).values({
        name: op.name,
        system_name: `System ${Math.floor(Math.random() * 5) + 1}`,
        role: op.role,
        pin_hash: hashPin(pin),
        active: true,
      }).catch(e => {
        console.error(`Failed to insert operator ${op.name}`, e);
      });
      console.log(`Seeded operator: ${op.name} with pin: ${pin}`);
    }

    try {
      await db.insert(workOrderSeq).values({ id: 1, seq: 2046 }).catch(e => {
        console.log('Work order sequence already seeded.');
      });
    } catch (e) {
       console.log('Work order sequence seed skipped.', e);
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
