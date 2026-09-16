import { config } from 'dotenv';
config({ path: '.env' });
import { neon } from '@neondatabase/serverless';
import { randomBytes, scryptSync } from 'node:crypto';

const sql = neon(process.env.DATABASE_URL);

// Deterministic scrypt hash stored as salt:hash (matches lib/auth.ts hashPin)
function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function init() {
  console.log('Connecting to Neon DB...');
  await sql`
    CREATE TABLE IF NOT EXISTS work_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wo_number VARCHAR(50) NOT NULL UNIQUE,
      customer_name VARCHAR(255) NOT NULL,
      customer_contact VARCHAR(50) NOT NULL,
      document_type VARCHAR(100) NOT NULL,
      wo_amount INTEGER NOT NULL DEFAULT 0,
      amount_paid INTEGER NOT NULL DEFAULT 0,
      amount_due INTEGER NOT NULL DEFAULT 0,
      due_date VARCHAR(50),
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      internal_notes TEXT,
      created_by VARCHAR(100),
      system_name VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

await sql`
    CREATE TABLE IF NOT EXISTS operators (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      system_name VARCHAR(50) NOT NULL,
      role VARCHAR(50) DEFAULT 'Operator',
      pin_hash VARCHAR(300),
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Add auth columns if upgrading an existing database
  await sql`ALTER TABLE operators ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Operator'`;
  await sql`ALTER TABLE operators ADD COLUMN IF NOT EXISTS pin_hash VARCHAR(300)`;

  // Atomic sequence row used by the app to generate unique WO numbers
  await sql`
    CREATE TABLE IF NOT EXISTS work_order_seq (
      id INTEGER PRIMARY KEY,
      seq INTEGER NOT NULL
    );
  `;
  const maxWo = await sql`SELECT coalesce(max(substring(wo_number from 'WO-([0-9]+)')::integer), 2046) AS m FROM work_orders`;
  const seqStart = parseInt(maxWo[0].m) || 2046;
  await sql`
    INSERT INTO work_order_seq (id, seq) VALUES (1, ${seqStart})
    ON CONFLICT (id) DO UPDATE SET seq = GREATEST(work_order_seq.seq, ${seqStart})
  `;

// Seed operators if empty
  const existingOps = await sql`SELECT count(*) FROM operators`;
  if (parseInt(existingOps[0].count) === 0) {
    const ops = [
      { name: 'Pradhyumn Dhondi', system_name: 'System 1', role: 'Chief Operator', pin: '1001' },
      { name: 'Suresh Varma', system_name: 'System 2', role: 'Senior Operator', pin: '1002' },
      { name: 'Rajesh Kumar', system_name: 'System 3', role: 'Legal Documentation', pin: '1003' },
      { name: 'Anitha Reddy', system_name: 'System 4', role: 'Forms & DTP', pin: '1004' },
      { name: 'Kiran Rao', system_name: 'System 5', role: 'General Operator', pin: '1005' }
    ];
    for (const op of ops) {
      const pinHash = hashPin(op.pin);
      await sql`INSERT INTO operators (name, system_name, role, pin_hash) VALUES (${op.name}, ${op.system_name}, ${op.role}, ${pinHash})`;
      console.log(`operator "${op.name}" PIN = ${op.pin}`);
    }
    console.log('Operators seeded!');
  } else {
    // Backfill PINs for operators created before the auth upgrade
    const withoutPin = await sql`SELECT * FROM operators WHERE pin_hash IS NULL`;
    for (const op of withoutPin) {
      const pin = '1234';
      const pinHash = hashPin(pin);
      await sql`UPDATE operators SET pin_hash = ${pinHash} WHERE id = ${op.id}`;
      console.log(`backfilled PIN for "${op.name}" (default PIN = ${pin})`);
    }
  }

  // Seed initial realistic work orders if none
  const existingWos = await sql`SELECT count(*) FROM work_orders`;
  if (parseInt(existingWos[0].count) === 0) {
    const initialWos = [
      { wo_number: 'WO-2047', customer_name: 'Angus Copper', customer_contact: '+91 9848012345', document_type: 'Lease Deed', wo_amount: 1000, amount_paid: 200, amount_due: 800, due_date: '2026-06-22', status: 'Confirmed', internal_notes: 'Commercial lease agreement for 5 years' },
      { wo_number: 'WO-2048', customer_name: 'Catherine Lopp', customer_contact: '+91 9848023456', document_type: 'Lease Deed', wo_amount: 1000, amount_paid: 200, amount_due: 800, due_date: '2026-06-22', status: 'Confirmed', internal_notes: 'Shop mulgie lease agreement' },
      { wo_number: 'WO-2049', customer_name: 'Edgar Irving', customer_contact: '+91 9848034567', document_type: 'Lease Deed', wo_amount: 1000, amount_paid: 200, amount_due: 800, due_date: '2026-06-22', status: 'Pending', internal_notes: 'Needs identity verification' },
      { wo_number: 'WO-2050', customer_name: 'Lara Croft', customer_contact: '+91 9848045678', document_type: 'Single Women Affidavit', wo_amount: 1000, amount_paid: 200, amount_due: 800, due_date: '2026-06-24', status: 'Cancel', internal_notes: 'Cancelled due to missing docs' },
      { wo_number: 'WO-2051', customer_name: 'Sonna Gangamani', customer_contact: '+91 9848056789', document_type: 'Single Women Affidavit', wo_amount: 1000, amount_paid: 200, amount_due: 800, due_date: '2026-06-24', status: 'Pending', internal_notes: 'Ontari Mahila pension self-declaration' },
      { wo_number: 'WO-2052', customer_name: 'Chintalapally Gangareddy', customer_contact: '+91 9848067890', document_type: 'SBI Alias General', wo_amount: 800, amount_paid: 800, amount_due: 0, due_date: '2026-06-25', status: 'Confirmed', internal_notes: 'Aadhaar vs bank passbook alias declaration' }
    ];
    for (const w of initialWos) {
      await sql`INSERT INTO work_orders (wo_number, customer_name, customer_contact, document_type, wo_amount, amount_paid, amount_due, due_date, status, internal_notes) 
                VALUES (${w.wo_number}, ${w.customer_name}, ${w.customer_contact}, ${w.document_type}, ${w.wo_amount}, ${w.amount_paid}, ${w.amount_due}, ${w.due_date}, ${w.status}, ${w.internal_notes})`;
    }
    console.log('Work orders seeded!');
  }

  console.log('Neon DB initialized successfully!');
}

init().catch(console.error);
