# Template Creation & Modular Styling Architecture Guide

This document serves as the standard operating procedure (SOP) and complete technical specification for adding new legal, government, commercial, and photo-bearing document templates to the **Varma Xerox** application.

---

## Architectural Principles

1. **Modular CSS Per Document**:
   Every document template MUST reside in its own dedicated directory under `templates/<templateName>/` with its own isolated CSS module (`<templateName>.module.css`).
   - Editing margins, font sizes, line heights, stamp paper space, or image frames in one document must **never** affect another document.
   - Never write document-specific layout rules inside global CSS (`globals.css`).

2. **Native Dual Export & Print Fidelity**:
   Every template must support:
   - **Pixel-Accurate Print / PDF**: Browser print dialog triggered via `react-to-print`, with print-specific media queries (`print:hidden`, `print:border-transparent`, `print-color-adjust: exact`).
   - **Native Word (`.docx`) Export**: Clean `.docx` generation using token replacement over the original skeleton XML via `/api/export-docx`, with XML character escaping (`&`, `<`, `>`, `"`, `'`).

3. **Two-Way Data Sync**:
   All field inputs in the left-hand editor panel sync to the Zustand global store (`store/useDocumentStore.ts`), which automatically updates the live preview and enables direct inline editing via `<EditableField />`.

4. **Multi-Asset & Photo Upload Support**:
   Templates requiring photos (e.g. CV / Resume, ID Cards, Affidavits) support:
   - Immediate base64 client-side file reading via `FileReader`.
   - Direct click-to-upload overlays right on the document canvas and in the editor panel.
   - Print-safe embedding with preservation of aspect ratios and print background colors.

5. **Multi-Terminal Dashboard & Neon DB**:
   - Work orders are recorded against the active terminal (`System 1` to `System 5`) and operator name.
   - Templates listed in the store view automatically load into `/operator` with active template state initialized.

---

## End-to-End Workflow for Adding a New Document

Adding a new document involves **7 distinct steps**:

```
[Source .docx File]
       │
       ▼
1. Analyze & Tokenize .docx  ──►  Create public/templates/<templateKey>_template.docx
       │
       ▼
2. Create Template Directory ──►  templates/<templateKey>/
       │                            ├── <templateName>Preview.tsx
       │                            └── <templateName>.module.css
       │
       ▼
3. Update Zustand Store     ──►  store/useDocumentStore.ts
       │                            ├── TemplateType union
       │                            ├── initial<TemplateName> state
       │                            └── DocumentState.data mapping
       │
       ▼
4. Add Form Editor Panel    ──►  components/editor/EditorPanel.tsx
       │                            ├── <TemplateName>Form component
       │                            └── Switch case in EditorPanel
       │
       ▼
5. Register in Preview      ──►  components/preview/PreviewPanel.tsx
       │                            └── Conditional render for activeTemplate
       │
       ▼
6. Update Toolbar Dropdown  ──►  components/toolbar/Toolbar.tsx
       │                            ├── BUILTIN_TEMPLATE_TYPES array
       │                            ├── <option> in select dropdown
       │                            └── Word Export download handler
       │
       ▼
7. Hook Up DOCX Export API  ──►  app/api/export-docx/route.ts
       │                            └── Token map replacement logic
       │
       ▼
[Build Verification & Fast Refresh Test] (npm run build)
```

---

## Detailed Step-by-Step Implementation

### Step 1: Inspect and Prepare the Source DOCX
1. Inspect the source Word document using Node.js and `jszip` to examine paragraphs, run formatting (`<w:b/>`, `<w:u/>`, `<w:sz/>`), and text alignment:
   ```bash
   node -e '
   const JSZip = require("jszip");
   const fs = require("fs");
   fs.readFile("<path-to-source.docx>", async (err, data) => {
     const zip = await JSZip.loadAsync(data);
     const xml = await zip.file("word/document.xml").async("string");
     const paragraphs = xml.match(/<w:p[\s>].*?<\/w:p>/gs) || [];
     paragraphs.forEach((p, i) => {
       const text = (p.match(/<w:t[\s>].*?<\/w:t>/gs) || []).map(t => t.replace(/<[^>]+>/g, "")).join("");
       if (text.trim()) console.log(`[${i}] ${text.trim()}`);
     });
   });
   '
   ```
2. Build a clean `.docx` template where operator-fillable texts are replaced with tokens such as `{{applicantName}}`, `{{aadharNumber}}`, `{{village}}`, etc.
3. Save the tokenized template to:
   `public/templates/<templateKey>_template.docx`

---

### Step 2: Create Modular CSS and Preview Component
Create a new directory under `templates/<templateName>/` with two files:

#### A. `templates/<templateName>/<templateName>.module.css`
Define classes using clean CSS:
- Container: `.document-container` with `'Times New Roman'` font family.
- Stamp Space: `.stamp-space` (e.g., `height: 200px`, dashed border, light background, `print:hidden`).
- Title / Subtitle: Bold, centered, underline, proper line-height.
- Paragraphs: `text-align: justify`, standard line height (`1.5`), indentations (`text-indent: 40px`).
- Signatures: Flexbox space-between for Witness and Deponent blocks.

#### B. `templates/<templateName>/<TemplateName>Preview.tsx`
Use `<div className="document-paper">` as the paper boundary (which has 210mm x 297mm dimensions, white background, shadow, and print page rules).
Wrap editable values with `<EditableField />`:
```tsx
import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './<templateName>.module.css';

export const <TemplateName>Preview: React.FC = () => {
  const { data } = useDocumentStore();
  const d = data.<templateKey>;
  const t = '<templateKey>';

  return (
    <div className={styles['document-container']}>
      <div className="document-paper">
        <div>
          {/* Stamp space */}
          <div className={`${styles['stamp-space']} print:hidden`}>
            <span>[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]</span>
          </div>

          <h1 className={styles['title']}>AFFIDAVIT TITLE</h1>

          <p className={styles['paragraph']}>
            I, <EditableField template={t} fieldPath="applicantName" value={d.applicantName} className="font-bold uppercase" />, ...
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

### Step 3: Update Zustand Global Store (`store/useDocumentStore.ts`)
1. **Extend `TemplateType`**:
   ```typescript
   export type TemplateType =
     | 'rent_agreement'
     | 'affidavit'
     | 'sale_deed'
     | 'plot_agreement'
     | 'ssc_memo_affidavit'
     | 'cdma_death_correction'
     | 'lease_deed'
     | 'sbi_alias_general'
     | 'single_women_affidavit'
     | 'cv_resume'
     | 'identity_card'
     | '<templateKey>';
   ```
2. **Add to `DocumentState.data` interface**:
   ```typescript
   interface DocumentState {
     data: {
       ...
       <templateKey>: any;
     };
   }
   ```
3. **Define Initial Values (`initial<TemplateName>`)**:
   Provide sensible, realistic defaults matching the sample documents.
4. **Wire into `initialState`**:
   Add `<templateKey>: initial<TemplateName>` inside `data`.

---

### Step 4: Add Form Editor in `components/editor/EditorPanel.tsx`
1. Create `<TemplateName>Form`:
   - Use `react-hook-form` initialized with `data.<templateKey>`.
   - Use `watch()` and `useEffect()` to call `updateData('<templateKey>', { ...data.<templateKey>, ...value })`.
   - Group fields into logical sections using `<SectionHeader number="01" title="..." />`.
   - Use `<InputField />` helper for standard text/date inputs.
   - If the template supports photo/emblem uploads, add an upload button with preview thumbnail and hidden file input.
2. Add `<TemplateName>Form` to the `EditorPanel` switch:
   ```tsx
   {activeTemplate === '<templateKey>' && <<TemplateName>Form />}
   ```

---

### Step 5: Wire into Preview Panel (`components/preview/PreviewPanel.tsx`)
1. Import `<TemplateName>Preview`:
   ```tsx
   import { <TemplateName>Preview } from '@/templates/<templateName>/<TemplateName>Preview';
   ```
2. Render conditionally inside `PreviewPanel`:
   ```tsx
   {activeTemplate === '<templateKey>' && <<TemplateName>Preview />}
   ```

---

### Step 6: Update Toolbar & Dropdown (`components/toolbar/Toolbar.tsx`)
1. Add `<templateKey>` to `BUILTIN_TEMPLATE_TYPES`:
   ```typescript
   const BUILTIN_TEMPLATE_TYPES: { id: TemplateType; label: string }[] = [
     { id: '<templateKey>', label: 'Human Readable Document Name' },
     ...
   ];
   ```

---

### Step 7: Update Dashboard Store Catalog (`app/page.tsx`)
Add document metadata to `TEMPLATE_DOCUMENTS` in `app/page.tsx` so operators can access it from the root dashboard:
```typescript
{
  id: '<templateKey>' as TemplateType,
  name: 'Human Readable Document Name',
  category: 'Category Group',
  folder: 'Folder Group',
  pages: '1 Page',
  lastModified: '15 Sep, 2026',
  icon: FileText,
  badge: 'Photo Upload',
  desc: 'Accurate description of the template purpose.',
}
```

---

### Step 8: Hook Up DOCX Export API Route (`app/api/export-docx/route.ts`)
1. Inside `export-docx/route.ts`, handle `body.template === '<templateKey>'`:
   ```typescript
   if (body.template === '<templateKey>') {
     const templatePath = join(process.cwd(), 'public', 'templates', '<templateKey>_template.docx');
     const templateBuf = await fsp.readFile(templatePath);
     const zip = await JSZip.loadAsync(templateBuf);
     let xml = await zip.file('word/document.xml')!.async('string');

     const replaceMap: Record<string, string> = {
       '{{applicantName}}': escapeXml(values.applicantName || ''),
       '{{aadharNumber}}': escapeXml(values.aadharNumber || ''),
       // Map all tokens with escapeXml()...
     };

     for (const [k, v] of Object.entries(replaceMap)) {
       xml = xml.replaceAll(k, v);
     }

     zip.file('word/document.xml', xml);
     const output = await zip.generateAsync({ type: 'nodebuffer' });

     return new NextResponse(new Uint8Array(output), {
       headers: {
         'Content-Type': DOCX_MIME,
         'Content-Disposition': 'attachment; filename="<FILE_NAME>.docx"',
         'Cache-Control': 'no-store',
       },
     });
   }
   ```

---

## Verification Checklist

Before reporting completion to the user, run the following verification steps:

- [ ] **Run Build**: Execute `npm run build` to confirm there are 0 TypeScript compilation errors and all static pages build.
- [ ] **Dev Server Status**: Check that `http://localhost:3000` returns HTTP 200.
- [ ] **Template Switch**: Select the new template in the toolbar dropdown and confirm the preview renders properly.
- [ ] **Two-Way Editing**: Verify modifying an input in the left-hand form updates the preview immediately.
- [ ] **DOCX Export**: Verify that clicking "Export as Word" generates and downloads a valid `.docx` document.
- [ ] **Print Simulation**: Verify that clicking "Print" opens the browser print dialog with stamp paper placeholder boxes cleanly hidden.
