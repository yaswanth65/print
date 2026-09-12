# 02 — Form Builder (admin2 `/admin2`)

Form Builder is the **admin** side of the app. It turns any uploaded legal
document into a fillable form:

```
upload a document (.cfa/.doc/.docx/.pdf/.txt)
      │  (API: extract text → auto-detect blanks)
      ▼
DRAFT template            ── review/edit page ──┐
      ▲                                          │ rename fields, change types,
      │  Save Draft                              │ set dropdown options, delete
      └──────────────────────────────────────────┤
      │  Save & Activate                         ▼
      ▼                                     READY template appears
      "Uploaded Forms" group in the          in the Print Studio dropdown
      Form Builder list                      (`/` → pick it → fill → PDF)
```

Route tree:

| Route | Purpose |
|---|---|
| `app/admin2/layout.tsx` | Portal header + page shell |
| `app/admin2/page.tsx` | List + upload |
| `app/admin2/[id]/page.tsx` | Review / edit / activate one template |

---

## 1. Layout — `app/admin2/layout.tsx`

A distinct look from the Print Studio so the two roles never visually blur:

- Dark `#1e293b` sticky header titled **Form Builder** with the tagline
  "Upload any document → auto-detect blanks → fillable form".
- A **"← Open Print Studio"** link back to `/`.
- Content constrained to `max-w-7xl` on a `#eef1f6` background.

---

## 2. List + upload — `app/admin2/page.tsx`

### Upload zone (dropzone)
A dashed-border card that:
- Opens the native file picker on click
  (`accept=".cfa,.doc,.docx,.pdf,.txt"`),
- Accepts drag-and-drop (`onDragOver`/`onDrop`),
- Shows a spinner while `uploading`,
- Displays extraction/upload errors inline.

On a dropped/picked file → `handleFile(file)`:
```ts
const row = await uploadForm(file);   // POST /api/forms  (multipart)
await load();                          // refresh the list
router.push(`/admin2/${row.id}`);      // straight into review
```

### Template grid
`getForms()` (GET /api/forms) fills the list once on mount (unmount-guarded,
`setState` happens inside `.then`, never synchronously in the effect body).

Each card shows:
- **Title** + **status chip** — `READY` (green, appears in Print Studio) vs
  `DRAFT` (amber),
- source type badge from `SOURCE_TYPE_LABELS` (CFA / Word (.doc) / Word (.docx)
  / PDF / Text),
- field count, original filename, created date,
- actions: **Review Blanks / Edit·Manage** → `/admin2/{id}`, and **delete**
  (`confirm()` → `removeForm(id)` = DELETE /api/forms/{id}).

Empty states: "Loading…", "No form templates yet", grid otherwise.

---

## 3. Review / edit — `app/admin2/[id]/page.tsx`

### Params & loading
- `params` is a `Promise` in Next 15 → unwrapped with React's `use(params)`
  (this is the pattern that avoids the old `params`-is-sync bug).
- On mount, `getForm(id)` (GET /api/forms/{id}) loads the full record; the
  component keeps local copies of `title` and `fields` so edits are local until
  saved (`loaded`, `saving`, `error`, `notice` local state).

### Header row
- Editable **Form Title** input (used as the label in the Print Studio
  dropdown).
- Status badge: **ACTIVE IN STUDIO** (READY) / **DRAFT**.
- Field summary: `N fields · M dropdowns`.

### Action bar
| Button | What it does |
|---|---|
| ← All Forms | back to `/admin2` |
| **Re-detect blanks** | `PATCH { redetect: true }` → the API re-runs blank detection on the stored `extracted_text` and returns the new definition. Undoes accidental deletions. |
| Delete | `DELETE /api/forms/{id}` then redirect to `/admin2` |
| **Save Draft** | keeps status `DRAFT` (not shown in Print Studio) |
| **Save & Activate** | sets status `READY` → form appears in Print Studio dropdown |

Save sends the curated `template_def` (current `fields` + original `layout`)
back via `saveForm` (PATCH). A green flash confirms *"Saved & activated — this
form now appears in the Print Studio dropdown."*

### Field editor (left column, `lg:col-span-5`)
Each detected field is a card with:

- its `key` (`field01`, `field02`, …) and a **remove** button (removes the
  field; spots in the document that used it become plain blanks),
- an editable **label**,
- a **type** select — `Text`, `Text area`, `Date`, `Dropdown list`
  (`FIELD_TYPE_LABELS`),
- when type = dropdown, a comma-separated **options** input
  (`parseOptions()` dedupes and splits on commas/newlines; switching to
  dropdown pre-fills `S/o., D/o., W/o.` if the field has no options).

### Preview + extracted text (right column, `lg:col-span-7`)
- **Document Preview** — `DocPreview` renders the full layout with every field
  spot highlighted as a **chip**: blue = text field, amber = dropdown
  (`mode="review"`). This is how the admin visually checks detection before
  activating.
- **Extracted Text** — collapsible `<pre>` of the raw text the detector worked
  on (with line count).
- A warning box appears when `layout` is empty ("no detected blanks — you can
  still activate it as a plain document, or re-upload a version that marks
  blanks with underscores / dotted lines") and a tip about underline-blank
  detection limits.

---

## 4. Preview renderer — `components/admin2/DocPreview.tsx`

Shared renderer used by the review screen (`mode="review"`) and reusable in
"plain" mode. Walks `def.layout`:

- `{ t }` segment → plain text,
- `{ f }` segment → look up the field:
  - review mode → colored chip (`field.label` + ` ▾` for dropdowns),
  - plain mode → bold / dotted-underline placeholder.

Title attributes on chips expose `"(label · type)"` on hover for quick
inspection.

---

## 5. Field / type reference

| Type | Input rendered (Print Studio) | Notes |
|---|---|---|
| `text` | single-line text input | default for all blanks/patterns |
| `textarea` | multi-line textarea | for long content spots |
| `date` | `<input type="date">` | typed date values |
| `select` | dropdown | options from `field.options` (e.g. Relation: `S/o., D/o., W/o.`) |

Statuses: `DRAFT` (hidden from operators) · `READY` (visible in Print Studio).