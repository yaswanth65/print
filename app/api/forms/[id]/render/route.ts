// app/api/forms/[id]/render/route.ts
// POST { values } → hydrates the stored structural template (template.docx)
// with the operator's values and returns a fresh .docx (native document, not
// an HTML print). Layout is preserved by construction.

import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import { getTemplate } from '@/lib/templateRepo';
import { renderDocx } from '@/lib/docx/render';
import type { DocxTemplateDef } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { values?: Record<string, string> } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const row = await getTemplate(id);
  if (!row) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  const def = row.template_def as DocxTemplateDef | null;
  if (!def || def.kind !== 'docx') {
    return NextResponse.json({ error: 'Not a structural DOCX template' }, { status: 400 });
  }

  const templatePath = join(process.cwd(), 'uploads', id, 'template.docx');
  let templateZip: Buffer;
  try {
    templateZip = await fsp.readFile(templatePath);
  } catch {
    return NextResponse.json({ error: 'Stored template file is missing' }, { status: 500 });
  }

  try {
    const output = await renderDocx(templateZip, body.values ?? {}, def.fields);
    const filename = (row.title || 'document')
      .replace(/[^a-zA-Z0-9 _-]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 120) || 'document';

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': `attachment; filename="${filename}.docx"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    console.error('render failed:', e);
    return NextResponse.json({ error: e?.message || 'Failed to render document' }, { status: 500 });
  }
}