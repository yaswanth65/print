import { config } from 'dotenv';
config({ path: '.env' });
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Seed operators if empty
  const existingOps = await sql`SELECT count(*) FROM operators`;
  if (parseInt(existingOps[0].count) === 0) {
    const ops = [
      { name: 'Pradhyumn Dhondi', system_name: 'System 1' },
      { name: 'Suresh Varma', system_name: 'System 2' },
      { name: 'Rajesh Kumar', system_name: 'System 3' },
      { name: 'Anitha Reddy', system_name: 'System 4' },
      { name: 'Kiran Rao', system_name: 'System 5' }
    ];
    for (const op of ops) {
      await sql`INSERT INTO operators (name, system_name) VALUES (${op.name}, ${op.system_name})`;
    }
    console.log('Operators seeded!');
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
