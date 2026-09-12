// lib/docx/tokenize.ts
// Tokenizer that walks a WordprocessingML part (document.xml, headerN.xml,
// footerN.xml) WITHOUT flattening anything. It records byte ranges so we can
// edit the raw XML in place — the skeleton, styles, tables, breaks, tabs and
// images around the edited runs are never touched.

export interface TextRun {
  tStart: number;   // offset of the raw text inside <w:t>…</w:t>
  tEnd: number;     // end (+1) of that raw text
  text: string;     // decoded text of the run
  xmlSpace: boolean;
}

export interface DocxParagraph {
  pStart: number;
  pEnd: number;
  runs: TextRun[];
}

export interface TokenizedPart {
  xml: string;
  paragraphs: DocxParagraph[];
  allRuns: TextRun[];         // every w:t in the part (incl. inside tables)
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
};

export function decodeXmlText(s: string): string {
  if (!s.includes('&')) return s;
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);?/g, (all, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      const cp = parseInt(code.slice(2), 16);
      return Number.isFinite(cp) && cp >= 0 ? String.fromCodePoint(cp) : all;
    }
    if (code.startsWith('#')) {
      const cp = parseInt(code.slice(1), 10);
      return Number.isFinite(cp) && cp >= 0 ? String.fromCodePoint(cp) : all;
    }
    return ENTITIES[`&${code};`] ?? all;
  });
}

export function encodeXmlText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const OPEN_TAG = /<w:t(\s[^>]*?)?>/g;
const OPEN_P = /<w:p(\s[^>]*?)?>/g;
const CLOSE_P = /<\/w:p>/g;

export function tokenizePart(xml: string): TokenizedPart {
  const paragraphs: DocxParagraph[] = [];

  // Pair up <w:p> … </w:p> ranges (paragraphs never nest).
  const pOpens: number[] = [];
  let m: RegExpExecArray | null;
  OPEN_P.lastIndex = 0;
  while ((m = OPEN_P.exec(xml)) !== null) pOpens.push(m.index);
  CLOSE_P.lastIndex = 0;
  const closes: number[] = [];
  while ((m = CLOSE_P.exec(xml)) !== null) closes.push(m.index);

  for (let i = 0; i < pOpens.length; i++) {
    const pStart = pOpens[i];
    const pEnd = closes[i] !== undefined ? closes[i] + '</w:p>'.length : xml.length;
    const body = xml.slice(pStart, pEnd);
    const runs: TextRun[] = [];
    OPEN_TAG.lastIndex = 0;
    let t: RegExpExecArray | null;
    while ((t = OPEN_TAG.exec(body)) !== null) {
      const tagStart = t.index;
      const contentStart = tagStart + t[0].length;
      const closeIdx = body.indexOf('</w:t>', contentStart);
      if (closeIdx === -1) break;
      const raw = body.slice(contentStart, closeIdx);
      runs.push({
        tStart: pStart + contentStart,
        tEnd: pStart + closeIdx,
        text: decodeXmlText(raw),
        xmlSpace: /xml:space\s*=\s*"preserve"/.test(t[1] ?? ''),
      });
      OPEN_TAG.lastIndex = closeIdx + '</w:t>'.length;
    }
    paragraphs.push({ pStart, pEnd, runs });
  }

  // All w:t runs (covers any run not inside a w:p, e.g. unusual structures).
  const allRuns: TextRun[] = [];
  OPEN_TAG.lastIndex = 0;
  while ((m = OPEN_TAG.exec(xml)) !== null) {
    const tagStart = m.index;
    const contentStart = tagStart + m[0].length;
    const closeIdx = xml.indexOf('</w:t>', contentStart);
    if (closeIdx === -1) break;
    allRuns.push({
      tStart: contentStart,
      tEnd: closeIdx,
      text: decodeXmlText(xml.slice(contentStart, closeIdx)),
      xmlSpace: /xml:space\s*=\s*"preserve"/.test(m[1] ?? ''),
    });
    OPEN_TAG.lastIndex = closeIdx + '</w:t>'.length;
  }

  return { xml, paragraphs, allRuns };
}

// Replace the raw text of a run range with new content. Returns a new XML
// string. Sets xml:space="preserve" when the new text has leading/trailing
// whitespace so Word does not trim it.
export function replaceRunText(xml: string, run: TextRun, newText: string): string {
  const escaped = encodeXmlText(newText);
  const hasEdgeSpace = /^\s|\s$/.test(newText);
  let out = xml.slice(0, run.tStart) + escaped + xml.slice(run.tEnd);

  if (hasEdgeSpace) {
    // locate the <w:t …> opening tag for this run and add xml:space
    const open = out.lastIndexOf('<w:t', run.tStart);
    const close = out.indexOf('>', open);
    if (open !== -1 && close !== -1) {
      const tag = out.slice(open, close + 1);
      if (!/xml:space\s*=/.test(tag)) {
        const next = tag.slice(5, -1);
        const replaced = `<w:t xml:space="preserve"${next}>`;
        out = out.slice(0, open) + replaced + out.slice(close + 1);
      }
    }
  }
  return out;
}

const OPEN_TBL = /<w:tbl(\s[^>]*?)?>/g;
const CLOSE_TBL = /<\/w:tbl>/g;
const OPEN_TR = /<w:tr(\s[^>]*?)?>/g;
const CLOSE_TR = /<\/w:tr>/g;
const OPEN_TC = /<w:tc(\s[^>]*?)?>/g;
const CLOSE_TC = /<\/w:tc>/g;

export interface DocxTableCell {
  start: number;
  end: number;
  paragraphs: DocxParagraph[];
  raw: string;
}
export interface DocxTableRow {
  start: number;
  end: number;
  cells: DocxTableCell[];
}
export interface DocxTable {
  start: number;
  end: number;
  rows: DocxTableRow[];
}

// Split a tokenized part into tables and non-table paragraph blocks, keeping
// original order for rendering. (Header/footer parts are simple; document.xml
// usually mixes tables + paragraphs.)
export function extractStructure(xml: string): { tables: DocxTable[]; paragraphs: DocxParagraph[] } {
  const tables: DocxTable[] = [];
  const tblOpens: number[] = [];
  let m: RegExpExecArray | null;
  OPEN_TBL.lastIndex = 0;
  while ((m = OPEN_TBL.exec(xml)) !== null) tblOpens.push(m.index);
  CLOSE_TBL.lastIndex = 0;
  const tblCloses: number[] = [];
  while ((m = CLOSE_TBL.exec(xml)) !== null) tblCloses.push(m.index);

  const taken = new Set<number>();
  for (let i = 0; i < tblOpens.length; i++) {
    const start = tblOpens[i];
    const end = tblCloses[i] !== undefined ? tblCloses[i] + '</w:tbl>'.length : xml.length;
    const tblXml = xml.slice(start, end);

    const rows: DocxTableRow[] = [];
    const trOpens: number[] = [];
    OPEN_TR.lastIndex = 0;
    while ((m = OPEN_TR.exec(tblXml)) !== null) trOpens.push(m.index);
    CLOSE_TR.lastIndex = 0;
    const trCloses: number[] = [];
    while ((m = CLOSE_TR.exec(tblXml)) !== null) trCloses.push(m.index);

    for (let r = 0; r < trOpens.length; r++) {
      const rStart = trOpens[r];
      const rEnd = trCloses[r] !== undefined ? trCloses[r] + '</w:tr>'.length : tblXml.length;
      const trXml = tblXml.slice(rStart, rEnd);

      const cells: DocxTableCell[] = [];
      const tcOpens: number[] = [];
      OPEN_TC.lastIndex = 0;
      while ((m = OPEN_TC.exec(trXml)) !== null) tcOpens.push(m.index);
      CLOSE_TC.lastIndex = 0;
      const tcCloses: number[] = [];
      while ((m = CLOSE_TC.exec(trXml)) !== null) tcCloses.push(m.index);

      for (let c = 0; c < tcOpens.length; c++) {
        const cStart = tcOpens[c];
        const cEnd = tcCloses[c] !== undefined ? tcCloses[c] + '</w:tc>'.length : trXml.length;
        const raw = trXml.slice(cStart, cEnd);
        cells.push({ start: start + rStart + cStart, end: start + rStart + cEnd, raw, paragraphs: tokenizePart(raw).paragraphs });
      }
      rows.push({ start: start + rStart, end: start + rEnd, cells });
    }
    tables.push({ start, end, rows });
    for (let p = start; p < end; p++) taken.add(p);
  }

  const paragraphs = tokenizePart(xml).paragraphs.filter((p) => {
    const inside = tables.some((t) => p.pStart >= t.start && p.pEnd <= t.end);
    return !inside;
  });

  return { tables, paragraphs };
}