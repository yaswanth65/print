// lib/templateRepo.ts
// Storage for dynamic form templates.
//
// - When DATABASE_URL is configured (production): uses the existing neon/drizzle Postgres
//   setup and the `form_templates` table (run `npm run db:push` once).
// - Otherwise: falls back to a local JSON file so the studio works offline in dev.
//
// Server-only module.

import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import type { FormTemplate, FormTemplateMeta, TemplateDef, TemplateStatus } from './types';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'form-templates.json');

interface RowRecord {
  id: string;
  title: string;
  source_type: FormTemplate['source_type'];
  original_filename: string | null;
  file_path: string | null;
  extracted_text: string | null;
  template_def: TemplateDef | null;
  status: TemplateStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

function toMeta(row: RowRecord): FormTemplateMeta {
  return {
    id: row.id,
    title: row.title,
    source_type: row.source_type,
    original_filename: row.original_filename,
    status: row.status,
    field_count: row.template_def?.fields?.length ?? 0,
    created_at: row.created_at,
  };
}

function toFull(row: RowRecord): FormTemplate {
  return { ...toMeta(row), extracted_text: row.extracted_text, template_def: row.template_def, file_path: row.file_path };
}

// ─── JSON fallback store ───────────────────────────────────────

async function readRows(): Promise<RowRecord[]> {
  try {
    const raw = await fsp.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRows(rows: RowRecord[]): Promise<void> {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), 'utf8');
}

// ─── Postgres store ────────────────────────────────────────────

const USE_DB = !!process.env.DATABASE_URL;

async function dbGet<T = any>(fn: (db: any, schema: any, helpers: any) => Promise<T>): Promise<T> {
  const [{ db }, { formTemplates }, { desc, asc }] = await Promise.all([
    import('@/db'),
    import('@/db/schema'),
    import('drizzle-orm'),
  ]);
  return fn(db, formTemplates, { desc });
}

function mapRow(r: any): RowRecord {
  return {
    id: r.id,
    title: r.title,
    source_type: r.source_type ?? null,
    original_filename: r.original_filename ?? null,
    file_path: r.file_path ?? null,
    extracted_text: r.extracted_text ?? null,
    template_def: r.template_def ?? null,
    status: (r.status as TemplateStatus) ?? 'DRAFT',
    created_by: r.created_by ?? null,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    updated_at: r.updated_at ? (r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at)) : null,
  };
}

// ─── Public API ────────────────────────────────────────────────

export async function listTemplates(): Promise<FormTemplateMeta[]> {
  if (USE_DB) {
    try {
      const rows = await dbGet((db, table, { desc }) =>
        db.select().from(table).orderBy(desc(table.created_at)),
      );
      return rows.map(mapRow).map(toMeta);
    } catch (e) {
      console.error('listTemplates(db) failed, falling back to file store:', e);
    }
  }
  return (await readRows()).map(toMeta);
}

export async function getTemplate(id: string): Promise<FormTemplate | null> {
  if (USE_DB) {
    try {
      const rows = await dbGet((db, table, { desc }) =>
        db.select().from(table).where((t: any) => t.id.eq(id)),
      );
      if (rows.length === 0) {
        // fall through to file store (row may have been created under file mode)
      } else {
        return toFull(mapRow(rows[0]));
      }
    } catch (e) {
      console.error('getTemplate(db) failed, trying file store:', e);
    }
  }
  const rows = await readRows();
  const row = rows.find((r) => r.id === id);
  return row ? toFull(row) : null;
}

export interface CreateTemplateInput {
  title: string;
  source_type: FormTemplate['source_type'];
  original_filename?: string;
  file_path?: string;
  extracted_text?: string;
  template_def?: TemplateDef;
  created_by?: string;
}

export async function createTemplate(input: CreateTemplateInput): Promise<FormTemplateMeta> {
  const record: RowRecord = {
    id: crypto.randomUUID(),
    title: input.title,
    source_type: input.source_type ?? null,
    original_filename: input.original_filename ?? null,
    file_path: input.file_path ?? null,
    extracted_text: input.extracted_text ?? null,
    template_def: input.template_def ?? null,
    status: 'DRAFT',
    created_by: input.created_by ?? null,
    created_at: new Date().toISOString(),
    updated_at: null,
  };

  if (USE_DB) {
    try {
      const rows = await dbGet((db, table) => {
        const created = new Date(record.created_at);
        return db
          .insert(table)
          .values({
            id: record.id,
            title: record.title,
            source_type: record.source_type,
            original_filename: record.original_filename,
            file_path: record.file_path,
            extracted_text: record.extracted_text,
            template_def: record.template_def,
            status: record.status,
            created_by: record.created_by ?? undefined,
            created_at: created,
          })
          .returning();
      });
      return toMeta(mapRow(rows[0]));
    } catch (e) {
      console.error('createTemplate(db) failed, using file store:', e);
    }
  }
  const rows = await readRows();
  rows.unshift(record);
  await writeRows(rows);
  return toMeta(record);
}

export interface UpdateTemplateInput {
  title?: string;
  template_def?: TemplateDef;
  status?: TemplateStatus;
  extracted_text?: string;
}

export async function updateTemplate(id: string, patch: UpdateTemplateInput): Promise<FormTemplate | null> {
  const updatedAt = new Date().toISOString();

  if (USE_DB) {
    try {
      const rows = await dbGet((db, table) => {
        const values: Record<string, any> = {
          ...(patch.title !== undefined ? { title: patch.title } : {}),
          ...(patch.template_def !== undefined ? { template_def: patch.template_def } : {}),
          ...(patch.status !== undefined ? { status: patch.status } : {}),
          ...(patch.extracted_text !== undefined ? { extracted_text: patch.extracted_text } : {}),
          updated_at: new Date(updatedAt),
        };
        return db.update(table).set(values).where((t: any) => t.id.eq(id)).returning();
      });
      if (rows.length > 0) return toFull(mapRow(rows[0]));
      // fall through in case row only exists in file store
    } catch (e) {
      console.error('updateTemplate(db) failed, trying file store:', e);
    }
  }

  const rows = await readRows();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const current = rows[idx];
  const next: RowRecord = {
    ...current,
    title: patch.title ?? current.title,
    template_def: patch.template_def ?? current.template_def,
    status: patch.status ?? current.status,
    extracted_text: patch.extracted_text ?? current.extracted_text,
    updated_at: updatedAt,
  };
  rows[idx] = next;
  await writeRows(rows);
  return toFull(next);
}

export async function deleteTemplate(id: string): Promise<boolean> {
  if (USE_DB) {
    try {
      const rows = await dbGet((db, table) =>
        db.delete(table).where((t: any) => t.id.eq(id)).returning({ id: table.id }),
      );
      if (rows.length > 0) return true;
    } catch (e) {
      console.error('deleteTemplate(db) failed, trying file store:', e);
    }
  }
  const rows = await readRows();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  await writeRows(next);
  return true;
}