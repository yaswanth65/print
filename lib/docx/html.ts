// lib/docx/html.ts
// Builds a lightweight HTML *skeleton* of the template document for the
// on-screen preview. It is derived from the DOCX structure (paragraph runs +
// tables) so it keeps alignment, font size/weight/underline and tables — but it
// is only a preview. The .docx files you download are the real rendering.
//
// The skeleton keeps raw {{token}} strings inside <span data-f="…"> markers so
// the client just swaps values in place.

import { extractStructure, decodeXmlText, type DocxParagraph, type DocxTable, type TextRun } from './tokenize';

export interface SkeletonResult {
  html: string;
  tokenNames: string[];
}

function runCss(runXml: string): string {
  const parts: string[] = [];
  const bold = /<w:b\s*\/>/.test(runXml) || /<w:b\s+w:val="1"/.test(runXml);
  const italic = /<w:i\s*\/>/.test(runXml) || /<w:i\s+w:val="1"/.test(runXml);
  const underline = /<w:u\s*\/>/.test(runXml) || /<w:u\s+[^>]*w:val="[^"0]"/.test(runXml);
  const sz = runXml.match(/<w:sz\s+w:val="(\d+)"/);
  const ascii = runXml.match(/w:ascii="([^"]+)"/);
  const color = runXml.match(/w:color\s+w:val="([^"]+)"/);
  if (bold) parts.push('font-weight:700');
  if (italic) parts.push('font-style:italic');
  if (underline) parts.push('text-decoration:underline');
  if (sz) parts.push(`font-size:${Math.round(Number(sz[1]) / 2)}pt`);
  if (ascii) parts.push(`font-family:'${ascii[1]}',serif`);
  if (color) parts.push(`color:#${color[1]}`);
  return parts.join(';');
}

function pPrCss(pPr: string): string {
  const parts: string[] = [];
  const jc = pPr.match(/w:jc\s+w:val="([^"]+)"/);
  if (jc) {
    const map: Record<string, string> = { start: 'left', end: 'right', right: 'right', center: 'center', both: 'justify', justify: 'justify' };
    parts.push(`text-align:${map[jc[1]] ?? jc[1]}`);
  }
  const ind = pPr.match(/<w:ind\s+[^>]*w:(?:left|start)="(-?\d+)"/);
  if (ind) parts.push(`padding-left:${Number(ind[1]) / 20}pt`);
  const spacing = pPr.match(/<w:spacing\s+([^>]*?)\/?>/);
  if (spacing) {
    const before = spacing[1].match(/w:before="(\d+)"/);
    const after = spacing[1].match(/w:after="(\d+)"/);
    const line = spacing[1].match(/w:line="(\d+)"/);
    if (before || after) {
      parts.push(`margin:${before ? Number(before[1]) / 20 + 'pt' : '0'} 0 ${after ? Number(after[1]) / 20 + 'pt' : '0'}`);
    }
    if (line && Number(line[1]) > 0) parts.push(`line-height:${Number(line[1]) / 240}`);
  }
  return parts.join(';');
}

function runXmlOf(paraXml: string, run: TextRun): string | null {
  const open = paraXml.lastIndexOf('<w:r', run.tStart);
  const close = paraXml.indexOf('</w:r>', run.tStart);
  if (open === -1 || close === -1) return null;
  return paraXml.slice(open, close + '</w:r>'.length);
}

function renderParagraphRuns(paraXml: string, paragraph: DocxParagraph): string {
  let out = '';
  let pos = paragraph.pStart;
  const sorted = [...paragraph.runs].sort((a, b) => a.tStart - b.tStart);

  for (const run of sorted) {
    if (run.tStart > pos) {
      const gap = paraXml.slice(pos, run.tStart);
      const tabCount = (gap.match(/<w:tab\s*\/>/g) ?? []).length;
      if (tabCount) out += '&#160;&#160;&#160;&#160;'.repeat(Math.min(tabCount, 6));
      if (/<w:br\s*\/>/.test(gap)) out += '<br/>';
      if (/<w:cr\s*\/>/.test(gap)) out += '<br/>';
    }
    const runXml = runXmlOf(paraXml, run);
    const css = runXml ? ` style="${runCss(runXml)}"` : '';
    const text = decodeXmlText(run.text);
    const tokenized = text.replace(/\{\{(.*?)\}\}/g, (_m, t: string) => `<span class="docx-field" data-f="${t}">{{${t}}}</span>`);
    out += `<span${css}>${tokenized || '&#160;'}</span>`;
    pos = run.tEnd;
  }
  return out;
}

function paragraphToHtml(partXml: string, paragraph: DocxParagraph): string {
  const pXml = partXml.slice(paragraph.pStart, paragraph.pEnd);
  const pPr = pXml.match(/<w:pPr\b[\s\S]*?<\/w:pPr>/);
  const css = pPr ? pPrCss(pPr[0]) : '';
  const inner = renderParagraphRuns(partXml, paragraph);
  return inner.trim() ? `<p style="${css}">${inner}</p>` : `<p style="${css}">&#160;</p>`;
}

function tableToHtml(table: DocxTable): string {
  const tds = table.rows.map((row) => {
    const cells = row.cells
      .map((cell) => `<td style="padding:4px 10px;vertical-align:top">${cell.paragraphs.map((p) => paragraphToHtml(cell.raw, p)).join('')}</td>`)
      .join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table style="border-collapse:collapse;width:100%;box-sizing:border-box"><tbody>${tds}</tbody></table>`;
}

export function buildHtmlSkeleton(partXml: string): SkeletonResult {
  const { tables, paragraphs } = extractStructure(partXml);
  const items: Array<{ start: number; end: number; p?: DocxParagraph; t?: DocxTable }> = [
    ...tables.map((t) => ({ start: t.start, end: t.end, t })),
    ...paragraphs.map((p) => ({ start: p.pStart, end: p.pEnd, p })),
  ].sort((a, b) => a.start - b.start);

  const html = items.map((it) => (it.t ? tableToHtml(it.t) : paragraphToHtml(partXml, it.p!))).join('\n');

  const tokenNames = new Set<string>();
  for (const m of html.matchAll(/\{\{(.*?)\}\}/g)) tokenNames.add(`{{${m[1]}}}`);

  return { html, tokenNames: [...tokenNames] };
}

// Single call for the common routes: build from the document body part.
export function skeletonFromParts(parts: Record<string, string>): SkeletonResult {
  return buildHtmlSkeleton(parts['word/document.xml'] ?? '');
}