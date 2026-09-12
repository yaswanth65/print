# 03 — Backend Pipeline (extract → detect → store → serve)

All the machinery that turns a raw uploaded file into a combined
**storage + detection pipeline**. It is fully **server-side** (Node runtime) and
uses **zero AI/LLM** — detection is deterministic regex + heuristics (see doc 04
for why).

```
                    ┌──────────── data/                     ┌────────────
 uploaded file ───► │ app/api/forms ─► lib/extract ─► text  │
 (cfa/pdf/doc/      │ POST             (with inner .doc for │
  docx/txt)         │                   .cfa)               │
                    │                      │                │ app/api/forms/[id]
                    │                      ▼                │ GET / PATCH / DELETE
                    │               lib/blankDetect         │
                    │                   (TemplateDef)       │
                    │                      │                │
                    │                      ▼                │
                    │              lib/templateRepo ───────►│
                    │              (Postgres or JSON file)  │
                    └───────────────────────────────────────┘
                                     ▲
                    lib/clientForms ─┘
                    (fetch wrappers used by Print Studio toolbar
                     & Form Builder pages)
```

---

## 1. Shared types — `lib/types.ts`

The contract between detector, storage, API and UI:

```ts
export type FieldType     = 'text' | 'textarea' | 'date' | 'select';
export type FieldSource   = 'blank' | 'pattern' | 'manual';
export type TemplateStatus= 'DRAFT' | 'READY';
export type SourceType    = 'cfa' | 'doc' | 'docx' | 'pdf' | 'txt';

interface FormField  { key; label; type; options?; group?; source?; placeholder? }
interface LayoutSegment { t?; f? }                    // literal text | field ref
type    LayoutParagraph = LayoutSegment[];
interface TemplateDef    { fields: FormField[]; layout: LayoutParagraph[] }

interface FormTemplateMeta { id; title; source_type; original_filename; status; field_count; created_at }
interface FormTemplate     extends FormTemplateMeta { extracted_text; template_def; file_path }
```

**The layout model is the key idea**: a document is a list of *paragraphs*, each
a list of *segments*. A segment is either raw text (`t`) or a reference to a
field (`f`). Rendering = join segments, substituting field values. This keeps
the original text order and lets the preview show blanks in exactly their
original positions.

---

## 2. Extraction — `lib/extract.ts`

| Extension | Mechanism | Notes |
|---|---|---|
| `.cfa` | magic `QHBK` (4 bytes) + **zlib** payload | `unwrapCfa()` → `inflateSync(buf.subarray(8))`; the payload is actually an OLE2 Word `.doc`, which is then parsed like a `.doc` |
| `.doc` | `word-extractor` | pure Node OLE2 parser — **no MS Word required**. Writes a temp file, extracts, cleans up |
| `.docx` | `mammoth.extractRawText` | OOXML → text |
| `.pdf` | `pdf-parse` | loaded via `createRequire(import.meta.url)` because the package is CommonJS without a clean ESM default export (this avoids webpack interop errors in route handlers) |
| `.txt` | `utf-8` decode | BOM stripped (`^\uFEFF`) |

`extractTextFromBuffer(buf, name)` returns `{ type, text, innerDocBytes? }`;
`innerDocBytes` is only populated for `.cfa` (the unwrapped `.doc`), which the
upload route persists alongside the original for best-fidelity future edits.

`isOleDoc()` guards the Word payload by checking the `D0 CF 11 E0 …` OLE header
and raises friendly errors otherwise.

---

## 3. Blank detection — `lib/blankDetect.ts`

Deterministic, O(text), two passes per line.

### Pass 1 — "marked" blanks (most reliable)
`markedRules(line)` finds literal blank characters (longest match wins):

| Regex | Meaning |
|---|---|
| `_{2,}` | underscore runs `______` |
| `(?<=\S)[ \t]{4,}` | 4+ spaces/tabs *after non-space* — this was tightened with a lookbehind so **indentation** at line start is NOT detected as a blank (fix, see doc 04) |
| `(?<!\.)\.{3,}(?!\.)(?=\s|$)` | dotted lines `.....` |

`labelFromContext(pre)` derives a label from the text just before the blank
(last clause after `,`/`:`, trimmed to 24 chars) — e.g. `Roll No. ______` →
label "Roll No.".

### Pass 2 — pattern suggestions (when no marked blank on the line)
`PATTERNS` table is the curated legal-document field library:

| name | regex | type |
|---|---|---|
| Relation | `\b([SDW]\/o\.)` | `select` options `S/o. / D/o. / W/o.` |
| Age | `aged\s+(?:about\s+)?(\d+)\s+years` | `text` |
| Deponent Name | `^I,\s*([^\n]{2,}?)\s+(?:Shri|Smt|Kum|…|[SDW]/o\.)` | `text` |
| Roll No. | `Roll\s*No\.?\s*[:.\- ]?\s*([0-9][0-9A-Za-z/*\-]*)` | `text` |
| Date | `(?:on|dated|On the|on the)\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})` | `text` |
| Amount | `Rs\.?\s*(?:only\s*)?([0-9][0-9,]*)` | `text` |
| Phone | `\b([6-9]\d{9})\b` | `text` |
| Aadhaar | `\b(\d{4}\s\d{4}\s\d{4})\b` | `text` |
| PAN | `\b([A-Z]{5}\d{4}[A-Z])\b` | `text` |

> **Date rule requires an `on/dated` prefix** — added after the real-world test
> showed the house number `6-9-97` was wrongly matched as a date.

### Field registry (dedup + keys)
`makeFieldRegistry()` assigns stable keys `field01, field02, …`. Rules flagged
`dedupe: true` (Relation, and the blank-spot labels) share **one** field across
every occurrence (`bySignature` map) — e.g. the same Relation dropdown is reused
anywhere `D/o.` appears.

### Paragraphs → layout
- `splitParagraphs` groups lines on blank-line boundaries (a "block").
- `headerLineFor` finds an ALL-CAPS section title → becomes the field **group**
  (`DEPONENT`, `General`, …) which drives grouping in the side panel and the
  review screen.
- Per line, marked matches win; otherwise pattern matches. Overlaps are merged
  (keep earliest start, extend end). Text between matches becomes `{ t }`
  segments, matches become `{ f }` segments. `mergeAdjacentText` coalesces
  consecutive text segments.
- Output: `{ fields, layout }` — everything the preview and editor need.

---

## 4. Storage — `lib/templateRepo.ts`

Two backends behind one API; **auto-selected** by `USE_DB = !!process.env.DATABASE_URL`:

### Postgres (production)
- Lazy dynamic imports of `@/db`, `@/db/schema`, `drizzle-orm` so pages that
  never touch the DB don't pay for the module graph.
- Uses the existing neon/drizzle setup. Table: `form_templates` (below).
- Every operation **falls back to the file store** on failure, so a partially
  migrated DB degrades gracefully.

### JSON file fallback (dev / no DATABASE_URL)
- File: `data/form-templates.json` (created on demand).
- `readRows/writeRows` — JSON persists across restarts; the whole store is small
  (< a few MB of template metadata).
- This is how the feature works locally today (see doc 04 verification).

### Public API
`listTemplates()` → `FormTemplateMeta[]` · `getTemplate(id)` → `FormTemplate`
· `createTemplate(input)` → meta (status always starts `DRAFT`) ·
`updateTemplate(id, patch)` → full · `deleteTemplate(id)` → boolean.
`toMeta/toFull` strip/attach the heavy fields (`extracted_text`, `template_def`).

---

## 5. HTTP API

### `app/api/forms/route.ts`
- `runtime = 'nodejs'`, `dynamic = 'force-dynamic'` (needs fs + buffers, never
  cached).
- **POST** (multipart, field name `file`):
  1. validates file `instanceof File`, ≤ 40 MB, extension in
     `ACCEPTED_EXTENSIONS`,
  2. persists the raw file to `uploads/<uuid>/` with a sanitized filename,
  3. `extractTextFromBuffer` (and saves the inner `.doc` for `.cfa`),
  4. rejects 422 if no readable text,
  5. `detectBlanks(text)` → `TemplateDef`,
  6. derive title from filename, `createTemplate(...)` (DRAFT),
  7. returns the meta with `201`.
- **GET** → `listTemplates()`.

### `app/api/forms/[id]/route.ts`
- `params` is awaited (`Promise<{id}>`) — Next 15 style.
- **GET** → full template or 404.
- **PATCH** — validates `title` (string), `status` (`DRAFT|READY`),
  `template_def` (`fields[]` + `layout[]` present). Special flag
  **`redetect: true`** re-runs `detectBlanks` against the *stored*
  `extracted_text` and uses that definition (the admin's "Re-detect" button).
- **DELETE** → `{ ok: true }` or 404.

---

## 6. Client wrappers — `lib/clientForms.ts`

Type-safe `fetch` helpers used by both front-ends:

| Function | Call |
|---|---|
| `getForms()` | GET `/api/forms` (`cache: 'no-store'`) |
| `uploadForm(file)` | POST with `FormData` |
| `getForm(id)` | GET `/api/forms/{id}` |
| `saveForm(id, patch)` | PATCH `{title?, status?, template_def?, redetect?}` |
| `removeForm(id)` | DELETE |

`handle<T>()` normalizes errors to `Error(message)` from any JSON `{error}` the
API returned.

---

## 7. Database — `db/schema.ts`

```ts
export const formTemplates = pgTable('form_templates', {
  id:               uuid('id').primaryKey().defaultRandom(),
  title:            varchar('title', { length: 255 }).notNull(),
  source_type:      varchar('source_type', { length: 32 }),
  original_filename:varchar('original_filename', { length: 512 }),
  file_path:        varchar('file_path', { length: 1024 }),
  extracted_text:   text('extracted_text'),
  template_def:     jsonb('template_def'),       // { fields, layout }
  status:           varchar('status', { length: 32 }).default('DRAFT').notNull(),
  created_by:       uuid('created_by'),
  created_at:       timestamp('created_at').defaultNow(),
  updated_at:       timestamp('updated_at'),
});
```

Push with `npm run db:push` once `DATABASE_URL` is configured. The app works
fully without it (JSON fallback).

---

## 8. Module typings — `lib/declarations.d.ts`

`word-extractor` and `pdf-parse` ship no bundled types; ambient declarations
give `getBody()` / `extract()` / `pdfParse(buffer)` proper TypeScript shapes.

---

## 9. Dependency map (new packages)

`word-extractor` · `mammoth` · `pdf-parse` (extraction); everything else uses
the existing stack (zustand, drizzle, next, lucide-react, react-to-print).