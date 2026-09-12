# 01 — Print Studio (Root Page `/`)

The root page is the actual **print-facing deliverable** of the project. An
**operator** picks a template (built-in, or an uploaded form built by the admin
in Form Builder), fills in the fields, and exports a print-ready PDF of the
completed A4 document.

> Stack: Next.js 15 (App Router) · React 19 · TypeScript · Zustand (client state)
> · Tailwind CSS 4 · `react-to-print` (PDF export).

---
V
## 1. Page structure — `app/page.tsx`

```tsx
<div className="flex flex-col h-screen …">       // full-viewport app shell
  <Toolbar printRef={printRef} />                // top command bar
  <div className="flex flex-1 overflow-hidden">
    <div className="w-[380px] …print:hidden">    // left: EditorPanel (fields)
      <EditorPanel />
    </div>
    <div className="flex-1 …">
      <PreviewPanel ref={printRef} />            // right: live A4 preview
    </div>
  </div>
</div>
```

- `printRef` is a `useRef<HTMLDivElement>(null)` holding the preview node — it is
  handed to `useReactToPrint` in the Toolbar and to `PreviewPanel` via
  `forwardRef`, so printing clones exactly what the operator sees.
- The editor column is hidden on print (`print:hidden`); the preview column
  becomes the printed page.
- The keyboard effect on mount exists only as a placeholder hook (currently a
  no-op) left over from the original scaffold.

### Layout & fonts — `app/layout.tsx`
- Injects the **Inter** font as `--font-sans` and **Lora** serif as
  `--font-serif` (Lora is used for the legal/body copy of previews).
- Defines metadata title *"Print simulator - Professional Document Editor"* and
  loads `globals.css` (print CSS lives there).

---

## 2. Top bar — `components/toolbar/Toolbar.tsx`

### Template / form picker
The `<select>` is bound to `selectValue = activeFormId ?? activeTemplate` and
has **two optgroups**:

| Group | Content | Behavior on select |
|---|---|---|
| `Built-in Templates` | `rent_agreement`, `affidavit`, `sale_deed`, `plot_agreement`, `ssc_memo_affidavit` | `setActiveTemplate(...)` (also clears any active uploaded form) |
| `Uploaded Forms` | every template with `status === 'READY'` fetched from the API | `selectUploadedForm(formId)` |

- On mount the Toolbar **fetches the ready-form list** once via `getForms()`
  (`lib/clientForms.ts`) and stores it in the Zustand store (`setForms`). The
  promise is unmount-guarded (`let mounted`).
- `selectUploadedForm` sets `activeFormId`, and **lazily loads the full
  template definition** (`getForm(formId)` → `setFormDef`) plus an empty value
  map (`setFormValues(formId, {})`) — the definition is cached in
  `store.formDefs` so switching templates repeatedly doesn't re-fetch.
- An empty "No uploaded forms yet" disabled option appears when the admin has
  not activated any form yet.
- **"Form Builder"** button links to `/admin2` so the operator flow and admin
  flow are one click apart.

### Edit mode toggle
`editMode ∈ 'form' | 'direct'` (Zustand):
- **Form Edit** — fields are edited through the side panel inputs.
- **Direct Edit** — the preview content becomes directly editable; the side
  panel shows an informational placeholder instead of inputs.

### Zoom
`zoom` (50–200%, step 10) applies `transform: scale(zoom/100)` to the preview,
anchored at the *top center* so documents scale without scrolling the viewport
violently.

### Export PDF
```ts
const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: docTitle });
```
- `docTitle` is the uploaded form's title when a dynamic form is active,
  otherwise `Print_simulator_<template>`.

---

## 3. Editor (left) — `components/editor/EditorPanel.tsx`

- Imports `react-hook-form` forms for the 5 built-in templates
  (`RentAgreementForm`, `AffidavitForm`, `SaleDeedForm`, `PlotAgreementForm`,
  `SscMemoAffidavitForm`). Each form:
  1. seeds `useForm({ defaultValues: data.<template> })`,
  2. `reset()`s when store data changes,
  3. `watch()`es the whole form and round-trips it back into the store via
     `updateData('<template>', JSON.parse(JSON.stringify(formValues)))` — i.e.
     built-in forms are effectively **auto-saving**.
- If `editMode === 'direct'` it returns the "Direct Edit Mode Active" panel.
- If an uploaded form is active (`activeFormId`), it renders
  `<DynamicForm formId={activeFormId} />` instead of any built-in form.

---

## 4. Preview (right) — `components/preview/PreviewPanel.tsx`

```tsx
<PreviewPanel ref={printRef} />   // forwardRef-exposed component
```
- Wraps content in a slate-grey canvas that is hidden on print
  (`print:bg-white`, `print:overflow-visible`, `print:transform-none`).
- When `activeFormId` is set and its definition is loaded → `DynamicPreview`.
- Otherwise renders the matching built-in preview:
  `RentAgreementPreview` / `AffidavitPreview` / `SaleDeedPreview` /
  `PlotAgreementPreview` / `SscMemoAffidavitPreview`.

---

## 5. Built-in templates — `templates/`

Each folder contains a static JSX document that mirrors a real legal document
and its sample data lives in the store:

| Template | Folder |
|---|---|
| Rent Agreement (Rent Agreement Draft) | `templates/rentAgreement/` |
| Affidavit | `templates/affidavit/` |
| Sale Deed | `templates/saleDeed/` |
| Plot Sale Agreement | `templates/plotAgreement/` |
| **SSC Memo Lost Affidavit** | `templates/sscMemoAffidavit/` |

The **SSC Memo Lost Affidavit** template was added from the real-world file
`testenv/AFFIDAVIT SSC MEMO LOST NOTARY.doc_16107 (1).cfa` (K. SONA BAI,
D/o. SUBHASH, SSC MARCH 2004, Roll No. 0657747, RAOJI SANGAM HIGH SCHOOL,
lost 26-02-2015, oath 18-04-2015 at Armoor — see doc 04). Its preview renders
as A4 `document-paper` with the standard serif legal typography.

---

## 6. Dynamic (uploaded) form rendering — `components/dynamic/`

These rendering components exist *only* for upload-grown forms.

### `DynamicPreview.tsx`
- Takes `def.layout` (paragraph → segment list), maps each segment:
  - `{ t }` → literal text,
  - `{ f }` → a `<DynamicEditable>` for that field's current value.
- `whitespace-pre-wrap` preserves the original line breaks from extraction.

### `DynamicEditable.tsx`
- In **form mode**: filled value renders bold; an empty value renders as a
  dotted underline placeholder (a blank line for un-filled fields, which also
  prints as a blank).
- In **direct mode**: a `contentEditable` span. `onBlur` writes
  `setFormValue(formId, field.key, innerText)` back into the store; `onPaste`
  is intercepted to paste plain text only (no HTML formatting).

### `DynamicForm.tsx`
- The fill-in panel: fields grouped by their detected **group** (section
  headers like *DEPONENT*), numbered 01, 02, ….
- Input type by `field.type`:
  - `select` → dropdown from `field.options` (empty → "— select —"),
  - `textarea` → multiline,
  - `date` → `<input type=date>`,
  - anything else → text input.
- Every edit calls `setFormValue(formId, field.key, value)` in the store; DOM
  and preview update reactively via `DynamicPreview`.

---

## 7. Client state — `store/useDocumentStore.ts` (Zustand)

Two slices:

**Static templates slice (original)**
- `activeTemplate`, `editMode`, `zoom`, `data.{rent_agreement|affidavit|sale_deed|plot_agreement|ssc_memo_affidavit}`.
- Actions: `setActiveTemplate` (also clears `activeFormId`), `setEditMode`,
  `setZoom`, `updateData`, `updateField` (deep path setter: e.g.
  `updateField('sale_deed', 'seller.name', 'X')`).

**Uploaded-forms slice (added for dynamic forms)**
| State | Purpose |
|---|---|
| `forms: FormTemplateMeta[]` | menu list for the Toolbar dropdown |
| `activeFormId: string \| null` | which uploaded form is open (null ⇒ built-in) |
| `formDefs: Record<string, TemplateDef>` | lazily-loaded form definitions |
| `formValues: Record<string, Record<fieldKey, string>>` | the operator's typed values |

Actions: `setForms`, `setActiveForm`, `setFormDef`, `setFormValues`,
`setFormValue`.

Because store slices are separate, a built-in template and an uploaded form
never conflict; switching built-in templates clears `activeFormId`.

---

## 8. Print pipeline

1. Operator edits a field → `setFormValue` → `DynamicPreview` re-renders.
2. *Export PDF* → `useReactToPrint` clones the `printRef` node into a hidden
   iframe and calls `window.print()` on it, with `documentTitle` naming the
   saved PDF.
3. Global CSS: editor column and toolbar are `print:hidden`; the preview is
   scaled back to 100% (`print:transform-none`) and pinned to A4 metrics
   (`@page`, `document-paper` width) defined in `globals.css`.

> Because every printed value is already text in the DOM (no canvas), the PDF
> contains selectable, searchable text.