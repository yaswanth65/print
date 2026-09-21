import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { documentHistory } from '@/db/schema';
import { desc, or, sql, eq, and } from 'drizzle-orm';

let memoryHistoryCache: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const operator = searchParams.get('operator') || '';
    const system = searchParams.get('system') || '';

    const conditions = [];
    if (operator && operator !== 'All') {
      conditions.push(eq(documentHistory.operator_name, operator));
    }
    if (system && system !== 'All') {
      conditions.push(eq(documentHistory.system_name, system));
    }
    if (search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          sql`LOWER(${documentHistory.customer_name}) LIKE LOWER(${q})`,
          sql`LOWER(${documentHistory.customer_contact}) LIKE LOWER(${q})`,
          sql`LOWER(${documentHistory.document_name}) LIKE LOWER(${q})`,
          sql`LOWER(${documentHistory.document_type}) LIKE LOWER(${q})`,
          sql`LOWER(${documentHistory.operator_name}) LIKE LOWER(${q})`
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let items: any[] = [];
    try {
      items = await db
        .select()
        .from(documentHistory)
        .where(whereClause)
        .orderBy(desc(documentHistory.created_at))
        .limit(100);
    } catch (dbErr) {
      items = memoryHistoryCache.filter((item) => {
        if (operator && operator !== 'All' && item.operator_name !== operator) return false;
        if (system && system !== 'All' && item.system_name !== system) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          return (
            (item.customer_name || '').toLowerCase().includes(s) ||
            (item.customer_contact || '').toLowerCase().includes(s) ||
            (item.document_name || '').toLowerCase().includes(s)
          );
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    console.error('GET /api/history error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_contact,
      document_type,
      document_name,
      operator_name,
      system_name,
      amount,
      status,
      document_data,
    } = body;

    if (!customer_name || !customer_contact || !document_type) {
      return NextResponse.json(
        { success: false, error: 'Customer name, contact, and document type are required' },
        { status: 400 }
      );
    }

    const recordObj = {
      id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      customer_name,
      customer_contact,
      document_type,
      document_name: document_name || document_type,
      operator_name: operator_name || 'Operator',
      system_name: system_name || 'System 1',
      amount: Number(amount) || 0,
      status: status || 'Saved',
      document_data: typeof document_data === 'string' ? document_data : JSON.stringify(document_data || {}),
      created_at: new Date().toISOString(),
    };

    try {
      const [inserted] = await db
        .insert(documentHistory)
        .values({
          customer_name,
          customer_contact,
          document_type,
          document_name: recordObj.document_name,
          operator_name: recordObj.operator_name,
          system_name: recordObj.system_name,
          amount: recordObj.amount,
          status: recordObj.status,
          document_data: recordObj.document_data,
        })
        .returning();
      if (inserted) {
        memoryHistoryCache.unshift(inserted);
        return NextResponse.json({ success: true, data: inserted });
      }
    } catch (insertErr) {
      console.warn('DB insert fallback to memory cache:', insertErr);
    }

    memoryHistoryCache.unshift(recordObj);
    return NextResponse.json({ success: true, data: recordObj });
  } catch (err: any) {
    console.error('POST /api/history error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, document_data } = body;

    if (!id || !document_data) {
      return NextResponse.json({ success: false, error: 'ID and document_data are required' }, { status: 400 });
    }

    try {
      const [updated] = await db
        .update(documentHistory)
        .set({ document_data: typeof document_data === 'string' ? document_data : JSON.stringify(document_data) })
        .where(eq(documentHistory.id, id))
        .returning();

      if (updated) {
        return NextResponse.json({ success: true, data: updated });
      }
    } catch (dbErr) {
      console.warn('DB update failed', dbErr);
    }
    
    return NextResponse.json({ success: false, error: 'Record not found or update failed' }, { status: 404 });
  } catch (err: any) {
    console.error('PUT /api/history error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

