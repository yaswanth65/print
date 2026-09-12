# 04 — Implementation Context (decisions, history, verification)

This file documents **how the whole thing was actually built** — the decisions,
the real-world constraints, the iteration cycle, and how it was verified — so
anyone (or any future session) can pick it back up without re-deriving it.

---

## 1. The goal

The client works with OTVM-style **legal documents** (affidavits, sale deeds,
rent agreements, plot agreements) in a weird container format `.cfa`. The daily
workflow is: a sample document comes in → staff must produce a final,
completed, printed copy with party details filled in.

The automation goal agreed with the user:

> **Admin uploads one sample document → blank spots are auto-detected into a
> fillable form → admin quick-review → form appears in a dropdown → operator
> fills it → prints a completed A4 document.**

### Constraints that shaped everything

| Decision | Why |
|---|---|
| **No LLM in the pipeline** | User explicitly declined an AI-text model; expensive/hard to host; must be fast and deterministic. Detection = regex + heuristics. |
| **Output = HTML preview + PDF print** | User asked for print output; re-generating native Word/OLE2 `.doc` is fragile and licensing-bound. HTML gives instant WYSIWYG and searchable-text PDFs. |
| **Blanks = mix** | Some blanks are *marked* (`_____`, dotted lines, long spaces), others are *unmarked* prose (`aged 25 years`, `Roll No. X`). Detector handles both (Pass 1 + Pass 2). |
| **Storage = Postgres with JSON fallback** | The app already had neon/drizzle Postgres. No `DATABASE_URL` was configured locally, so a JSON-file store keeps dev/offline working. |
| **Multi-user web app** | Whole thing lives in the existing Next.js app; the role separation (admin vs operator) is UI-level today, auth not yet built. The app already has admin/manager/operator routes in `/app`. |

---

## 2. What existed before this feature

- A Next.js 15 **"Print simulator"** app (`print/` folder) with:
  - 4 static JSX templates (`rent_agreement`, `affidavit`, `sale_deed`,
    `plot_agreement`) with hard-coded sample data,
  - Zustand store (`useDocumentStore`), react-hook-form editor panel,
    react-to-print preview,
  - drizzle/Neon Postgres + existing db schema,
  - admin/manager/operator placeholder pages,
  - a real sample file in `testenv/` (the SSC memo affidavit `.cfa`).

---

## 3. How it was implemented (step by step)

### Step 1 — Recover a real document (reverse-engineering `.cfa`)

Analysed `testenv/AFFIDAVIT SSC MEMO LOST NOTARY.doc_16107 (1).cfa`:

- bytes `0–3` = `QHBK` magic, rest is a **zlib-compressed** payload,
- `inflateSync` produced an **OLE2 Word `.doc`** (header `D0 CF 11 E0 …`).

Recovered full text: *"I, K. SONA BAI D/o. SUBHASH, aged 25 years, R/o.
H.No. 6-9-97, Namdev Wada, NIZAMABAD … SSC Public Examination held in the Month
of MARCH 2004 with Roll No. 0657747 through RAOJI SANGAM HIGH SCHOOL …
lost by me on 26-02-2015 while traveling by RTC Bus from Armoor to Balkonda …
On 18-04-2015 at Armoor … DEPONENT … sworn and signed … K. SONA BAI".*

### Step 2 — Static proof: `ssc_memo_affidavit` template

Added a 5th static template (data in store, `SscMemoAffidavitPreview.tsx`,
EditorPanel form, PreviewPanel, Toolbar option) to prove the full
fill-and-print loop against the real document. Production build passed.

### Step 3 — Standalone batch converter — `scripts/extract-cfa.ps1`

PowerShell + .NET `ZLibStream` + Word COM converts any `.cfa` → `.doc`, `.txt`,
and (optionally) `.pdf`. **Gotcha found:** Word's `SaveAs([ref]…)` fails in PS;
the working call is `$doc.SaveAs([string]$path, 7)`.

### Step 4 — admin2 build-out (the main feature)

Created in one pass, verified package by package:

- **`lib/types.ts`**, **`lib/declarations.d.ts`** — shared shapes + module
  typings.
- **`db/schema.ts`** — `form_templates` table.
- **`lib/templateRepo.ts`** — Postgres + JSON dual store.
- **`lib/extract.ts`** — cfa/doc/docx/pdf/txt extraction.
- **`lib/blankDetect.ts`** — deterministic detector.
- **`app/api/forms/route.ts` + `[id]/route.ts`** — upload/list/get/patch/delete.
- **`lib/clientForms.ts`** — fetch wrappers.
- **`app/admin2/layout.tsx`, `page.tsx`, `[id]/page.tsx`** —
  portal, dropzone list, review/edit screen.
- **`components/admin2/DocPreview.tsx`** — chip-highlighted preview.

`npm install word-extractor mammoth pdf-parse` (31 packages, build-safe).

### Step 5 — Pipeline verification against the real file

A throwaway `tsx` script fed the extracted text into `detectBlanks`. First run
found bugs, fix cycle:

| Bug found | Root cause | Fix |
|---|---|---|
| House number `6-9-97` became a "Date" | date regex matched `nn-nn-nnnn` anywhere | date pattern must begin with `on/dated/On the` |
| Blank spot created before `DEPONENT` | leading indentation spaces matched the long-space rule | long-space rule now requires a preceding non-space `(?<=\S)` |
| `D/o.` not detected | lowercase + case-sensitivity | case-insensitive flag on the relation rule (+ saw `d/o.` in real text) |
| Two different dates collapsed into one field | blanket dedupe by label | date patterns excluded from dedupe; dedupe only for Relation & blank spots |

After the rewrite, detection output on the real affidavit was:

```
field01 Deponent Name        (text)   — I, K. SONA BAI …
field02 Relation             (select) — S/o. / D/o. / W/o.  (reused everywhere)
field03 Age                  (text)   — aged 25 years
field04 Roll No.             (text)   — 0657747
field05 Date                 (text)   — on 26-02-2015
field06 (oath line)          (text)   — blank before the signature name
8 layout paragraphs
```
No false positives on the house number, no phantom blanks on indentation.

### Step 6 — Full CRUD e2e through the live HTTP API

Started `next start` on port 3111 and exercised the real endpoints with `curl`
(PowerShell's `Invoke-RestMethod -Form` sent malformed multipart — first 500,
diagnosed from server logs):

```
POST   .cfa  → 201 {id, title, source_type:"cfa", status:"DRAFT", field_count:6}
GET    /api/forms            → list with the DRAFT row
GET    /api/forms/{id}       → 6 fields, 8 paragraphs
PATCH  {status:"READY", title:"SSC Memo Lost Affidavit"} → READY
DELETE                       → {ok:true}; list empty again
```

### Step 7 — Wire dynamic forms into Print Studio

- **Store** (`useDocumentStore`) — added `forms`, `activeFormId`, `formDefs`,
  `formValues` + setters; `setActiveTemplate` clears `activeFormId`.
- **`components/dynamic/`** (`DynamicPreview`, `DynamicEditable`,
  `DynamicForm`) — render the layout with live values; form/direct edit.
- **`Toolbar`** — fetches READY forms on mount, new optgroup
  **"Uploaded Forms"**, lazy `getForm` on select, **Form Builder** link,
  print title uses the form title.
- **`PreviewPanel`** — branches to `DynamicPreview` when an uploaded form is
  active; **`EditorPanel`** likewise → `DynamicForm`.

### Step 8 — Lint + build polish

- Fixed `react-hooks/set-state-in-effect` in the three new data-loading spots by
  moving `setState` into promise `.then/.finally` (never synchronously in the
  effect body) — this is the pattern the React compiler plugin is happy with.
- `pdf-parse` import changed to `createRequire` to silence the webpack
  interop warning.
- Removed a stale `eslint-disable` in `templateRepo.ts`.
- Cleaned a stale `.next` (`PageNotFoundError: /_not-found` cache hiccup),
  rebuilt to a **warning-free green pass**, `eslint` → **0 errors**
  (remaining warnings are pre-existing react-hook-form `watch()` notes).

---

## 4. Current state

**Done & verified:** extraction (all 5 formats on real CFA doc), deterministic
blank detection with a curated pattern library, CRUD API, Postgres + JSON
storage, admin2 Form Builder (upload → review → activate → delete), dynamic
form picker + fill + print in the Print Studio.

**Storage today:** JSON fallback (`data/form-templates.json`) because there is
no `DATABASE_URL` in `.env`. When configured, `npm run db:push` provision the
`form_templates` table and the repo switches automatically (per-op fallback
included).

**Known pre-existing lint noise** (not introduced by this work):
`react-hooks/set-state-in-effect` in `app/admin/page.tsx`, `app/manager/page.tsx`,
`hooks/use-mobile`, `RentAgreementPreview`; `next.config.ts` sets
`eslint.ignoreDuringBuilds`, so builds don't fail on them.

---

## 5. How to run

```bash
npm install                       # install new deps
npm run dev                       # http://localhost:3000  → Print Studio
# open /admin2                    # → Form Builder (upload `.cfa`, review, activate)
# back in Print Studio dropdown   # → pick "SSC Memo Lost Affidavit" → fill → Export PDF

npm run build && npm run start    # production (watch next start + standalone warning — use node .next/standalone/server.js in prod)
npx eslint app/admin2 lib components/dynamic components/preview components/editor components/toolbar store/useDocumentStore.ts
npm run db:push                   # only needed once DATABASE_URL is set
```

### Smoke-test upload via curl
```bash
curl -X POST -F "file=@testenv/AFFIDAVIT SSC MEMO LOST NOTARY.doc_16107 (1).cfa" http://localhost:3000/api/forms
```

---

## 6. Gotchas worth remembering

1. **`.cfa`** = `QHBK` + `inflateSync`-able payload whose decompressed content is
   a real OLE2 `.doc` — never feed the cfa directly to Word extractors.
2. **`pdf-parse`** has no clean ESM default → `createRequire(import.meta.url)`
   in server code.
3. **`next start` + `output: 'standalone'`** logs *"does not work with
   standalone — use node .next/standalone/server.js"*; `next dev` is the
   simplest way to run locally.
4. **PowerShell `Invoke-RestMethod -Form`** produces multipart that Next's
   `request.formData()` rejects — use `curl -F` for API smoke tests.
5. **Word COM `SaveAs([ref]…)`** fails in PowerShell — use
   `$doc.SaveAs([string]$path, 7)`.
6. **`params` in Next 15** is a `Promise` — `const { id } = use(params)`.
7. **Multiple lockfiles** (`pnpm-lock.yaml` at `C:\` + package-lock.json in
   project) cause the Next.js "inferred workspace root" warning — cosmetic.

---

## 7. Possible next steps

1. Set `DATABASE_URL`, run `npm run db:push` → storage moves to Postgres.
2. Add real authentication/roles (admin/manager/operator) — the app already has
   those route shells.
3. Improve pattern library (more Indian legal doc fields: FIR No., case No.,
   Notary stamp details) and label inference.
4. Optional: regenerate a Word `.doc` from a completed form for offices that
   must hand in native files — the unwrapped `innerDocBytes` already saved under
   `uploads/<id>/` is a starting point.