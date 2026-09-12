// app/api/forms/route.ts
// POST  → build a form template from uploaded documents
//         • two files (`file` = blank, `filled` = filled sample) and both are
//           .doc/.docx  → STRUCTURAL template (run-level diff, layout preserved)
//         • one file only → legacy text path (fallback)
// GET   → list all form templates (for dropdown / admin list)

import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { extractTextFromBuffer, sourceTypeFromName, ACCEPTED_EXTENSIONS } from '@/lib/extract';
import { detectBlanks } from '@/lib/blankDetect';
import { createTemplate, listTemplates } from '@/lib/templateRepo';
import { normalizeToDocx } from '@/lib/normalize';
import { buildStructuralTemplate } from '@/lib/docx/template';
import type { DocxTemplateDef } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIZE = 40 * 1024 * 1024; // 40 MB
const STRUCTURAL_EXTS = ['.doc', '.docx'];

function sanitizeFilename(name: string): string {
  const safe = name.replace(/[^a-zA-Z0-9._\- ]/g, '_').trim();
  return safe.length > 180 ? safe.slice(0, 180) : safe || 'document';
}

export async function GET() {
  try {
    const items = await listTemplates();
    return NextResponse.json(items);
  } catch (e: any) {
    console.error('GET /api/forms failed:', e);
    return NextResponse.json({ error: 'Could not load form templates' }, { status: 500 });
  }
}

async function readUploadedFile(formData: FormData, field: string): Promise<File | null> {
  const file = formData.get(field);
  return file instanceof File ? file : null;
}

function extOf(name: string): string {
  return '.' + (name.split('.').pop() ?? '').toLowerCase();
}

function defaultTitle(name: string): string {
  return name
    .replace(/\.[^.]*$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ') || 'Untitled Document';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const blank = await readUploadedFile(formData, 'file');
    const filled = await readUploadedFile(formData, 'filled');

    if (!blank) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (blank.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 40 MB)' }, { status: 400 });

    const blankExt = extOf(blank.name);
    if (!ACCEPTED_EXTENSIONS.includes(blankExt)) {
      return NextResponse.json(
        { error: `Unsupported file type "${blankExt}". Use: ${ACCEPTED_EXTENSIONS.join(', ')}` },
        { status: 400 },
      );
    }
    if (filled && filled.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Filled file too large (max 40 MB)' }, { status: 400 });
    }

    const id = randomUUID();
    const dir = join(process.cwd(), 'uploads', id);
    await fsp.mkdir(join(dir, 'inputs'), { recursive: true });
    await fsp.mkdir(join(dir, 'orig'), { recursive: true });

    const safeName = sanitizeFilename(blank.name);
    await fsp.writeFile(join(dir, 'orig', safeName), Buffer.from(await blank.arrayBuffer()));
    if (filled) {
      const safeFilled = sanitizeFilename(filled.name);
      await fsp.writeFile(join(dir, 'orig', safeFilled), Buffer.from(await filled.arrayBuffer()));
    }

    // ── STRUCTURAL PATH: blank + filled, both Word documents ──────────
    const useStructural =
      filled !== null && STRUCTURAL_EXTS.includes(blankExt) && STRUCTURAL_EXTS.includes(extOf(filled.name));

    if (useStructural) {
      const blankBuf = Buffer.from(await blank.arrayBuffer());
      const filledBuf = Buffer.from(await filled.arrayBuffer());

      const nBlank = await normalizeToDocx(blankBuf, blankExt);
      const nFilled = await normalizeToDocx(filledBuf, extOf(filled.name));

      const out = await buildStructuralTemplate(nBlank.docx, nFilled.docx);

      await fsp.writeFile(join(dir, 'inputs', 'blank.docx'), nBlank.docx);
      await fsp.writeFile(join(dir, 'inputs', 'filled.docx'), nFilled.docx);
      await fsp.writeFile(join(dir, 'template.docx'), out.templateZip);

      const templateDef: DocxTemplateDef = {
        kind: 'docx',
        fields: out.templateDef.fields,
        layout: [],
        htmlSkeleton: out.htmlSkeleton,
        inputFiles: {
          blank: 'inputs/blank.docx',
          filled: 'inputs/filled.docx',
        },
      };

      const row = await createTemplate({
        title: defaultTitle(filled!.name) || defaultTitle(blank.name),
        source_type: 'docx',
        original_filename: `${blank.name} + ${filled!.name}`,
        file_path: join('uploads', id, 'template.docx').replace(/\\/g, '/'),
        template_def: templateDef,
      });

      return NextResponse.json(row, { status: 201 });
    }

    // ── LEGACY PATH: single file → text → regex detection ──────────────
    const buf = Buffer.from(await blank.arrayBuffer());
    const extract = await extractTextFromBuffer(buf, blank.name);
    if (!extract.text || !extract.text.trim()) {
      return NextResponse.json(
        { error: 'No readable text could be extracted from this document.' },
        { status: 422 },
      );
    }

    const templateDef = detectBlanks(extract.text);

    const row = await createTemplate({
      title: defaultTitle(blank.name),
      source_type: extract.type,
      original_filename: blank.name,
      file_path: join('uploads', id, safeName).replace(/\\/g, '/'),
      extracted_text: extract.text,
      template_def: templateDef,
    });

    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/forms failed:', e);
    return NextResponse.json({ error: e?.message || 'Failed to process upload' }, { status: 500 });
  }
}