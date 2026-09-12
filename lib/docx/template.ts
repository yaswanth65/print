// lib/docx/template.ts
// Builds a structural template from a blank .docx and its filled twin:
//
//   1. read the word XML parts of both zips,
//   2. run the run-level diff → semantic fields + a template whose parts carry
//      {{field_name}} tokens in the exact spots where values changed,
//   3. derive the HTML preview skeleton,
//   4. patch the blank zip with the tokenized parts → the template .docx.
//
// Nothing is flattened; the zip skeleton is untouched except the changed runs.

import { openDocx, readPartText, writeDocx } from './zip';
import { buildDocxTemplate } from './diff';
import { buildHtmlSkeleton } from './html';
import type { DocxTemplateDef, FormField } from '../types';

export interface DocxTemplateOutput {
  templateDef: DocxTemplateDef;
  templateZip: Buffer;
  htmlSkeleton: string;
}

export async function buildStructuralTemplate(blankDocx: Buffer, filledDocx: Buffer): Promise<DocxTemplateOutput> {
  const blankZip = await openDocx(blankDocx);
  const filledZip = await openDocx(filledDocx);

  const names = Object.keys(blankZip.files).filter((n) => n.endsWith('.xml'));
  const blankParts: Record<string, string> = {};
  const filledParts: Record<string, string> = {};

  for (const n of names) {
    blankParts[n] = await readPartText(blankZip, n);
    if (filledZip.file(n)) filledParts[n] = await readPartText(filledZip, n);
  }

  const diff = buildDocxTemplate(blankParts, filledParts);
  const skeleton = buildHtmlSkeleton(diff.parts['word/document.xml'] ?? '');

  const templateZip = await writeDocx(blankZip, diff.parts);

  return {
    templateDef: {
      kind: 'docx',
      fields: diff.fields,
      layout: [],
      htmlSkeleton: skeleton.html,
      inputFiles: {},
    },
    templateZip,
    htmlSkeleton: skeleton.html,
  };
}