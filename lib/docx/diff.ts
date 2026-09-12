// lib/docx/diff.ts
// The structural template engine: compare a blank DOCX with its filled twin,
// run-by-run inside the ORIGINAL paragraphs/tables, and produce a template
// whose every changed value is replaced by a semantic {{field_name}} token.
//
// Nothing is flattened to text and nothing is rebuilt: we only rewrite the
// raw text of the specific <w:t> runs that differ. Layout, styles, tables,
// tabs, images, page breaks etc. are untouched by construction.

import { decodeXmlText, replaceRunText, tokenizePart, type DocxParagraph, type TextRun } from './tokenize';
import type { FieldType, FormField } from '../types';

export interface DiffOptions {
  blankValue?: string; // fallback label when no context exists
}

export interface DiffResult {
  fields: FormField[];
  parts: Record<string, string>;
  partOrder: string[];
  fieldKeys: string[];
}

const BOX_CHARS = new Set(['☐', '☑', '□', '■', '◻', '◼', '▢', '▣']);

function isBoxText(s: string): boolean {
  return s.length > 0 && [...s].every((c) => BOX_CHARS.has(c));
}

// ─── value → field type ─────────────────────────────────────────
function inferType(value: string): FieldType {
  const v = value.trim();
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(v)) return 'date';
  if (/^\d{4}\s?\d{4}\s?\d{4}$/.test(v)) return 'text'; // aadhaar (semantic label decides)
  if (/^[6-9]\d{9}$/.test(v)) return 'text';
  if (!/\d/.test(v)) return 'text';
  if (/^\d{1,3}$/.test(v)) return 'text';
  return 'text';
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(o|w|s)\/o\./g, (m) => m.replace(/[.\/]/g, ''))
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Label from the literal text before a run inside its own paragraph.
function contextLabel(runs: Array<Pick<TextRun, 'text'>>, index: number): string {
  let ctx = '';
  for (let i = 0; i < index; i++) ctx += runs[i] ? (runs[i].text as string) : '';
  ctx = ctx.trim();
  if (!ctx) return '';

  let label: string;
  const colon = ctx.lastIndexOf(':');
  if (colon >= 0) {
    label = ctx.slice(colon + 1).trim();
  } else {
    const comma = ctx.lastIndexOf(',');
    label = comma >= 0 ? ctx.slice(comma + 1).trim() : ctx;
  }
  if (!label || /^[^a-zA-Z0-9]+$/.test(label)) label = ctx;
  return label.slice(-30);
}

// Alignment of two run arrays from the SAME original document. Both docs
// share (almost) the same run order, so alignment is basically monotonic.
// Equal runs anchor the walk; uncertain regions are resolved with a bounded
// window-LCS that preserves every run that exists in both docs (extra runs on
// either side become inserts/removes). Only when NO equal text exists in the
// window do we pair blank↔filled 1:1 — the classic "fill-in slot" (and Word's
// habit of splitting one value across several runs, handled by the caller).
function alignRuns(a: TextRun[], b: TextRun[]): Array<{ a?: number; b?: number }> {
  const n = a.length, m = b.length;
  const pairs: Array<{ a?: number; b?: number }> = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i]!.text === b[j]!.text) { pairs.push({ a: i, b: j }); i++; j++; continue; }
    // filled run j is an insert directly before an equal blank run
    if (i + 1 < n && a[i + 1]!.text === b[j]!.text) { pairs.push({ a: i }); i++; continue; }
    // blank run i is a remove directly before an equal filled run
    if (j + 1 < m && a[i]!.text === b[j + 1]!.text) { pairs.push({ b: j }); j++; continue; }
    // default: positional replace / fill-in slot
    pairs.push({ a: i, b: j }); i++; j++;
  }
  while (i < n) pairs.push({ a: i++ });
  while (j < m) pairs.push({ b: j++ });
  return pairs;
}

interface FieldReg {
  fields: FormField[];
  bySig: Map<string, { key: string; value: string; label: string; type: FieldType }>;
  nextSuffix: Map<string, number>;
}

function makeRegistry(): FieldReg {
  return { fields: [], bySig: new Map(), nextSuffix: new Map() };
}

function cleanLabel(raw: string, fallback: string): string {
  let l = raw.trim();
  l = l.replace(/^[_\s,.:;\-/]+/, '').replace(/[_\s,.:;\-/]+$/, '').replace(/\s{2,}/g, ' ');
  if (!l) return fallback;
  return l.slice(0, 40);
}

function getFieldKey(reg: FieldReg, label: string, type: FieldType, value: string): string {
  const SPECIAL: Record<string, string> = { i: 'applicant_name', 'i,': 'applicant_name' };
  let base = slugify(label) || (type === 'checkbox' ? 'option' : 'value');
  if (base.length <= 2 && SPECIAL[base] === undefined) {
    base = type === 'checkbox' ? 'option' : 'field';
  } else if (SPECIAL[base] !== undefined) {
    base = SPECIAL[base]!;
  }
  const norm = value.trim().toLowerCase();
  const sig = `${base}\u0000${type}\u0000${norm}`;
  const hit = reg.bySig.get(sig);
  if (hit) return hit.key;
  const suffix = reg.nextSuffix.get(base) ?? 1;
  reg.nextSuffix.set(base, suffix + 1);
  const key = suffix === 1 ? base : `${base}_${suffix}`;
  const field: FormField = { key, label: cleanLabel(label, base), type, source: 'docx-diff' };
  reg.fields.push(field);
  reg.bySig.set(sig, { key, value: norm, label, type });
  return key;
}

// ─── main entry ─────────────────────────────────────────────────
export function buildDocxTemplate(blankParts: Record<string, string>, filledParts: Record<string, string>): DiffResult {
  const reg = makeRegistry();
  const parts: Record<string, string> = { ...blankParts };
  const partOrder: string[] = [];

  for (const name of Object.keys(blankParts)) {
    if (!(name in filledParts)) continue;
    const blankXml = blankParts[name]!;
    const filledXml = filledParts[name]!;
    partOrder.push(name);

    const tb = tokenizePart(blankXml);
    const tf = tokenizePart(filledXml);
    const n = Math.min(tb.paragraphs.length, tf.paragraphs.length);

    // Collect ALL edits for the part, then apply them in one descending pass so
    // offsets stay valid no matter how many paragraphs changed.
    const allEdits: Edit[] = [];
    for (let p = 0; p < n; p++) {
      allEdits.push(...diffParagraph(reg, tb.paragraphs[p]!, tf.paragraphs[p]!));
    }
    parts[name] = applyEdits(blankXml, allEdits);
  }

  // render-ready key set (tokens incl. checkbox positions)
  const tokenKeys = new Set<string>();
  for (const key of reg.fields.map((f) => f.key)) tokenKeys.add(`{{${key}}}`);
  for (const f of reg.fields) for (const t of f.positionTokens ?? []) tokenKeys.add(`{{${t.replace(/^\{\{|\}\}$/g, '')}}`);

  return { fields: reg.fields, parts, partOrder, fieldKeys: [...tokenKeys] };
}

type Edit = { run: TextRun; text: string };

function applyEdits(xml: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => b.run.tStart - a.run.tStart);
  let out = xml;
  for (const e of sorted) out = replaceRunText(out, e.run, e.text);
  return out;
}

function diffParagraph(reg: FieldReg, bp: DocxParagraph, fp: DocxParagraph): Edit[] {
  const edits: Edit[] = [];
  const pairs = alignRuns(bp.runs, fp.runs);

  // Blank runs that the LCS left unpaired (their filled counterpart changed or
  // split across multiple runs). Claimed in document order by inserted filled
  // runs so a Word-split value still resolves to a single blank slot.
  const pairedBlank = new Set(pairs.map((p) => p.a));
  const unmatchedBlanks = bp.runs
    .map((r, i) => ({ r, i }))
    .filter(({ i, r }) => !pairedBlank.has(i) && r.text.trim().length > 0)
    .map(({ i }) => i);

  // Walk pairs in document order, merging unpaired (extra) filled runs into
  // the preceding filled run so a value Word split across runs becomes ONE
  // logical value.
  const units: Array<{ blankIdx: number | null; filledIdx: number; text: string; isInsert: boolean }> = [];
  let lastFilled = -1;
  let prevWasInsert = false;
  for (const { a, b } of pairs) {
    if (b === undefined) continue; // extra blank run → untouched literal
    const text = fp.runs[b]!.text;
    const last = units.length ? units[units.length - 1]! : null;
    const isInsert = a === undefined;
    const prevChanged =
      last !== null &&
      !last.isInsert &&
      last.blankIdx !== null &&
      last.text !== bp.runs[last.blankIdx]!.text;
    if (
      isInsert &&
      last &&
      (last.isInsert || prevChanged) &&
      lastFilled >= 0 &&
      b === lastFilled + 1
    ) {
      last.text += text;
      last.filledIdx = b;
    } else {
      units.push({ blankIdx: a ?? null, filledIdx: b, text, isInsert });
    }
    lastFilled = b;
    prevWasInsert = isInsert;
  }
  // Claim unmatched blank runs for pure-insertion units in document order
  // (Word often splits one blank slot's value across several runs).
  let claimIdx = 0;
  for (const unit of units) {
    if (unit.blankIdx !== null) continue;
    if (claimIdx < unmatchedBlanks.length) {
      unit.blankIdx = unmatchedBlanks[claimIdx++]!;
    }
  }

  let boxSlots: Array<{ blankIdx: number; labelPos: number }> = [];

  for (const unit of units) {
    const { blankIdx, text } = unit;
    if (blankIdx === null) continue;
    const br = bp.runs[blankIdx]!;
    const bText = br.text;
    if (text === bText) continue;
    if (!text.trim() && !bText.trim()) continue;

    // ☐ → ☑ (or any box glyph change): checkbox slot
    if (isBoxText(text) || isBoxText(bText)) {
      boxSlots.push({ blankIdx, labelPos: blankIdx });
      continue;
    }
    if (!text.trim()) continue;

    const value = text;
    const label0 = contextLabel(bp.runs, blankIdx);
    const type = inferType(value);
    const key = getFieldKey(reg, label0, type, value);
    edits.push({ run: br, text: `{{${key}}}` });
  }

  // Checkbox group → ONE logical field with per-position tokens.
  if (boxSlots.length > 0) {
    // Include every box run of the paragraph (also the unchanged ones): the
    // group is a single choice, and each box keeps its own token for editing.
    const allBoxIdx = bp.runs
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => isBoxText(r.text))
      .map(({ i }) => i);
    if (allBoxIdx.length > boxSlots.length) {
      boxSlots = allBoxIdx.map((blankIdx) => ({ blankIdx, labelPos: blankIdx }));
    }

    const first = boxSlots[0]!.blankIdx;
    const last = boxSlots[boxSlots.length - 1]!.blankIdx;
    const beforeText = bp.runs.filter((r) => r.tStart < bp.runs[first]!.tStart).map((r) => r.text).join(' ');
    const afterText = bp.runs.filter((r) => r.tStart > bp.runs[last]!.tEnd).map((r) => r.text).join(' ');

    const options: string[] = boxSlots.map((slot, i) => {
      const start = bp.runs[slot.blankIdx]!.tEnd;
      const end = i + 1 < boxSlots.length ? bp.runs[boxSlots[i + 1]!.blankIdx]!.tStart : bp.pEnd;
      const between = bp.runs.filter((r) => r.tStart >= start && r.tEnd <= end).map((r) => r.text).join('');
      const label = between.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      return label || `Option ${i + 1}`;
    });

    const groupLabel = beforeText.trim() || afterText.trim() || 'option';
    const base = slugify(groupLabel) || 'option';
    const suffix = reg.nextSuffix.get(base) ?? 1;
    reg.nextSuffix.set(base, suffix + 1);
    const key = suffix === 1 ? base : `${base}_${suffix}`;
    const posTokens = boxSlots.map((_, i) => `{{${key}:${i}}}`);
    const field: FormField = {
      key,
      label: cleanLabel(groupLabel, base),
      type: 'checkbox',
      options,
      positionTokens: posTokens,
      source: 'docx-diff',
    };
    reg.fields.push(field);
    for (let i = 0; i < boxSlots.length; i++) {
      edits.push({ run: bp.runs[boxSlots[i]!.blankIdx]!, text: posTokens[i] });
    }
  }

  return edits;
}