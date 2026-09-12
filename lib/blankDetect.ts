// lib/blankDetect.ts
// Turn extracted document text into a form definition WITHOUT any AI.
//
// Pass 1 — "marked" blanks: underscore runs, long space runs, dotted lines.
// Pass 2 — pattern suggestions: high-confidence legal-doc fields (relation,
//          age, roll no., deponent name, dates, amounts, PAN/Aadhaar/phone).
//
// Output is a TemplateDef: a list of fields + a paragraph layout where any
// detected spot is a `{ f: key }` token so the document can be re-rendered
// with values filled in.

import type { FieldType, FormField, LayoutParagraph, LayoutSegment, TemplateDef } from './types';

// ─── Match machinery ───────────────────────────────────────────

interface BlankMatch {
  start: number;
  end: number;
  label: string;
  rule?: PatternRule;
}

// Marked blanks, longest-first so overlapping runs resolve sensibly.
function markedRules(line: string): BlankMatch[] {
  const hits: BlankMatch[] = [];
  const push = (re: RegExp, label: (pre: string) => string) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const pre = line.slice(0, m.index);
      hits.push({ start: m.index, end: m.index + m[0].length, label: label(pre) });
      if (m[0].length === 0) re.lastIndex++;
    }
  };
  // "______"  (only when not a lone leading run — require visible content before)
  push(/_{2,}/g, (pre) => labelFromContext(pre) || 'Blank');
  // long horizontal whitespace/tabs used to reserve a space — but NOT indentation
  push(/(?<=\S)[ \t]{4,}/g, (pre) => labelFromContext(pre) || 'Blank');
  // dotted lines: "..... " — 3+ dots surrounded by whitespace, or any 4+ run
  push(/(?<!\.)\.{3,}(?!\.)(?=\s|$)/g, (pre) => labelFromContext(pre) || 'Blank');
  return hits.sort((a, b) => a.start - b.start || b.end - a.end);
}

function labelFromContext(pre: string): string {
  let ctx = pre.trimEnd();
  if (!ctx || !/\S/.test(ctx)) return '';
  const lastTerminator = Math.max(ctx.lastIndexOf(','), ctx.lastIndexOf(':')) + 1;
  ctx = lastTerminator > 0 ? ctx.slice(lastTerminator).trim() : ctx;
  ctx = ctx.replace(/^(?:and|&|,\s*)+/gi, '').trim();
  if (!ctx) return '';
  return ctx.slice(-24).trim();
}

// ─── Pattern suggestions ───────────────────────────────────────

interface PatternRule {
  name: string;
  re: RegExp;
  type: FieldType;
  options?: string[];
  dedupe?: boolean; // share the same field across every occurrence
}

const PATTERNS: PatternRule[] = [
  // e.g., "D/o. SUBHASH" — becomes a Dropdown field reused across the document
  { name: 'Relation', re: /\b([SDW]\/o\.)/gi, type: 'select', options: ['S/o.', 'D/o.', 'W/o.'], dedupe: true },
  { name: 'Age', re: /aged\s+(?:about\s+)?(\d+)\s+years/gi, type: 'text' },
  // "I, <NAME> D/o." — the person who swears the affidavit
  { name: 'Deponent Name', re: /^I,\s*([^\n]{2,}?)\s+(?:Shri|Smt|Kum|Mosammat|[SDW]\/o\.)/gi, type: 'text' },
  { name: 'Roll No.', re: /Roll\s*No\.?\s*[:.\- ]?\s*([0-9][0-9A-Za-z/*\-]*)/gi, type: 'text' },
  // dates that read "on 26-02-2015" / "dated 12/03/2020" (avoids house numbers)
  { name: 'Date', re: /\b(?:on|dated|On the|on the)\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g, type: 'text' },
  { name: 'Amount (Rs.)', re: /Rs\.?\s*(?:only\s*)?([0-9][0-9,]*)/gi, type: 'text' },
  { name: 'Phone', re: /\b([6-9]\d{9})\b/g, type: 'text' },
  { name: 'Aadhaar', re: /\b(\d{4}\s\d{4}\s\d{4})\b/g, type: 'text' },
  { name: 'PAN', re: /\b([A-Z]{5}\d{4}[A-Z])\b/g, type: 'text' },
];

function patternRules(line: string): BlankMatch[] {
  const hits: BlankMatch[] = [];
  for (const rule of PATTERNS) {
    rule.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.re.exec(line)) !== null) {
      const value = m[1] ?? '';
      const valueStart = m[0].indexOf(value);
      const start = m.index + (valueStart >= 0 ? valueStart : 0);
      hits.push({
        start,
        end: start + value.length,
        label: rule.name,
        rule,
      });
      rule.re.lastIndex = m.index + Math.max(1, value.length);
    }
  }
  return hits.sort((a, b) => a.start - b.start || b.end - a.end);
}

// ─── Field registry ────────────────────────────────────────────

function makeFieldRegistry() {
  const fields: FormField[] = [];
  const bySignature = new Map<string, FormField>();
  let counter = 0;

  function getOrCreate(label: string, opts: {
    type?: FieldType;
    options?: string[];
    group?: string;
    source?: 'blank' | 'pattern';
    dedupe?: boolean;
  }) {
    const cleanLabel = (label || 'Field').trim() || 'Field';

    if (opts.dedupe) {
      const sig = `${cleanLabel}\u0000${opts.type ?? 'text'}`;
      const existing = bySignature.get(sig);
      if (existing) return existing.key;
    }

    counter++;
    const key = `field${String(counter).padStart(2, '0')}`;
    const field: FormField = {
      key,
      label: cleanLabel,
      type: opts.type ?? 'text',
      group: opts.group,
      source: opts.source ?? 'blank',
    };
    if (opts.options?.length) field.options = opts.options;
    fields.push(field);
    if (opts.dedupe) bySignature.set(`${cleanLabel}\u0000${field.type}`, field);
    return key;
  }

  return { fields, getOrCreate };
}

// ─── Paragraph / group handling ────────────────────────────────

function splitParagraphs(text: string): string[][] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.split('\n'))
    .filter((lines) => lines.some((l) => l.trim().length > 0));
}

function headerLineFor(lines: string[]): string {
  for (const line of lines) {
    const t = line.trim();
    if (t.length >= 3 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/[a-z]/.test(t)) {
      return t.replace(/[:\-—\s]+$/g, '');
    }
  }
  return '';
}

// ─── Main entry ────────────────────────────────────────────────

export function detectBlanks(text: string): TemplateDef {
  const reg = makeFieldRegistry();
  const layout: LayoutParagraph[] = [];

  for (const lines of splitParagraphs(text)) {
    const group = headerLineFor(lines) || 'General';

    for (const line of lines) {
      if (!line.trim()) continue;

      // Prefer marked blanks; fall back to pattern suggestions per line.
      let matches = markedRules(line);
      if (matches.length === 0) matches = patternRules(line);

      // Merge overlapping matches (keep the one that starts first).
      const merged: BlankMatch[] = [];
      for (const m of matches) {
        const last = merged[merged.length - 1];
        if (last && m.start < last.end) {
          if (m.end > last.end) last.end = m.end;
          continue;
        }
        merged.push({ ...m });
      }

      const segments: LayoutSegment[] = [];
      let pos = 0;
      for (const m of merged) {
        if (m.start > pos) {
          const t = line.slice(pos, m.start);
          if (t) segments.push({ t });
        }
        if (m.rule) {
          const key = reg.getOrCreate(m.rule.name, {
            type: m.rule.type,
            options: m.rule.options,
            group,
            source: 'pattern',
            dedupe: m.rule.dedupe,
          });
          segments.push({ f: key });
        } else {
          const key = reg.getOrCreate(m.label, { type: undefined, group, source: 'blank', dedupe: true });
          segments.push({ f: key });
        }
        pos = m.end;
      }
      if (pos < line.length) {
        const t = line.slice(pos);
        if (t) segments.push({ t });
      }
      if (segments.length > 0) layout.push(mergeAdjacentText(segments));
    }
  }

  return { fields: reg.fields, layout };
}

function mergeAdjacentText(segments: LayoutSegment[]): LayoutSegment[] {
  const out: LayoutSegment[] = [];
  for (const seg of segments) {
    const last = out[out.length - 1];
    if (seg.t && last?.t) {
      last.t = last.t + seg.t;
    } else {
      out.push({ ...seg });
    }
  }
  return out;
}