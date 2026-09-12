// app/api/forms/[id]/route.ts
// GET    → full template (text + definition) for the review/editor screen
// PATCH  → admin saves curated definition, title, status (DRAFT / READY)
// DELETE → remove the template
//
// Structural (two-file DOCX) templates re-diff from their stored inputs when
// PATCH { redetect: true }; legacy templates re-run the text detector.

import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import { deleteTemplate, getTemplate, updateTemplate } from '@/lib/templateRepo';
import { detectBlanks } from '@/lib/blankDetect';
import { buildStructuralTemplate } from '@/lib/docx/template';
import type { DocxTemplateDef, TemplateDef, TemplateStatus } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidDef(def: unknown): def is TemplateDef {
  if (!def || typeof def !== 'object') return false;
  const d = def as any;
  return Array.isArray(d.fields) && Array.isArray(d.layout);
}

async function redetectStructural(id: string): Promise<{ def: DocxTemplateDef; zip: Buffer }> {
  const existing = await getTemplate(id);
  const def = existing?.template_def as DocxTemplateDef | null;
  if (!existing || !def || def.kind !== 'docx') throw new Error('Template is not a structural DOCX template');
  if (!def.inputFiles?.blank || !def.inputFiles.filled) throw new Error('Missing stored blank/filled inputs');

  const base = join(process.cwd(), 'uploads', id);
  const blankBuf = await fsp.readFile(join(base, def.inputFiles.blank!));
  const filledBuf = await fsp.readFile(join(base, def.inputFiles.filled!));

  const out = await buildStructuralTemplate(blankBuf, filledBuf);
  const nextDef: DocxTemplateDef = {
    kind: 'docx',
    fields: out.templateDef.fields,
    layout: [],
    htmlSkeleton: out.htmlSkeleton,
    inputFiles: { blank: def.inputFiles.blank, filled: def.inputFiles.filled },
  };
  return { def: nextDef, zip: out.templateZip };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getTemplate(id);
  if (!row) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { title?: string; template_def?: unknown; status?: string; redetect?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.title !== undefined && typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title must be a string' }, { status: 400 });
  }
  if (body.status !== undefined && !['DRAFT', 'READY'].includes(body.status)) {
    return NextResponse.json({ error: 'status must be DRAFT or READY' }, { status: 400 });
  }
  if (body.template_def !== undefined && !isValidDef(body.template_def)) {
    return NextResponse.json({ error: 'template_def must contain fields[] and layout[]' }, { status: 400 });
  }

  let templateDef = body.template_def as TemplateDef | undefined;

  // Re-run detection against the stored inputs (admin reset button).
  if (body.redetect) {
    const existing = await getTemplate(id);
    const isDocx = (existing?.template_def as DocxTemplateDef | null)?.kind === 'docx';
    if (existing && isDocx) {
      try {
        const { def, zip } = await redetectStructural(id);
        await fsp.writeFile(join(process.cwd(), 'uploads', id, 'template.docx'), zip);
        templateDef = def;
      } catch (e: any) {
        return NextResponse.json({ error: `Re-diff failed: ${e?.message ?? e}` }, { status: 500 });
      }
    } else if (existing?.extracted_text) {
      templateDef = detectBlanks(existing.extracted_text);
    }
  }

  // Preserve structural metadata when the admin saves an edited field set.
  if (templateDef && (templateDef as DocxTemplateDef).kind !== 'docx') {
    const existing = await getTemplate(id);
    const current = existing?.template_def as DocxTemplateDef | null;
    if (current?.kind === 'docx') {
      templateDef = {
        ...templateDef,
        kind: 'docx',
        htmlSkeleton: current.htmlSkeleton,
        inputFiles: current.inputFiles,
      } as DocxTemplateDef;
    }
  }

  const updated = await updateTemplate(id, {
    title: body.title,
    status: body.status as TemplateStatus | undefined,
    template_def: templateDef,
  });

  if (!updated) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteTemplate(id);
  if (!ok) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}