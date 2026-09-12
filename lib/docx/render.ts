// lib/docx/render.ts
// Hydrate a stored template .docx with operator values.
//
// Technique: the template parts still contain the ORIGINAL document skeleton;
// every {{token}} sits inside the <w:t> of the run where the value belongs. We
// only swap that text back, byte-for-byte around it, then re-zip. Output is a
// real Word file that looks like the source document.

import { openDocx, readPartText, writeDocx } from './zip';
import { encodeXmlText } from './tokenize';
import type { FormField } from '../types';

export const BOX_CHECKED = '☑';
export const BOX_UNCHECKED = '☐';

interface FieldIndex {
  key: string;
  type: string;
  options?: string[];
  positionTokens?: string[];
}

function buildIndex(fields: FormField[]): Map<string, FieldIndex> {
  const map = new Map<string, FieldIndex>();
  for (const f of fields) map.set(f.key, f);
  return map;
}

function replaceToken(xml: string, token: string, replacement: string): string {
  const escaped = encodeXmlText(replacement);
  const re = new RegExp(`(<w:t([^>]*)>)${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(</w:t>)`, 'g');
  const hasEdgeSpace = /^\s|\s$/.test(replacement);
  return xml.replace(re, (all, open: string, attrs: string, close: string) => {
    let tag = open;
    if (hasEdgeSpace && !/xml:space\s*=/.test(attrs)) {
      const inner = attrs.trimStart();
      tag = `<w:t xml:space="preserve"${inner}`;
    }
    return `${tag}${escaped}${close}`;
  });
}

export async function renderDocx(
  templateZip: Buffer,
  values: Record<string, string>,
  fields: FormField[],
): Promise<Buffer> {
  const zip = await openDocx(templateZip);
  const index = buildIndex(fields);
  const names = Object.keys(zip.files).filter((n) => n.endsWith('.xml'));

  const patch: Record<string, string> = {};
  for (const name of names) {
    let xml = await readPartText(zip, name);
    let changed = false;

    for (const f of fields) {
      const token = `{{${f.key}}}`;
      if (xml.includes(token)) {
        const value = values[f.key] ?? '';
        xml = replaceToken(xml, token, value);
        changed = true;
      }
      if (f.type === 'checkbox' && f.positionTokens?.length) {
        const sel = values[f.key] ?? '';
        const selIdx = (f.options ?? []).indexOf(sel);
        for (let i = 0; i < f.positionTokens.length; i++) {
          const t = f.positionTokens[i]!;
          if (!xml.includes(t)) continue;
          xml = replaceToken(xml, t, i === selIdx ? BOX_CHECKED : BOX_UNCHECKED);
          changed = true;
        }
      }
    }

    if (changed) patch[name] = xml;
  }

  return writeDocx(zip, patch);
}

export async function renderParts(
  parts: Record<string, string>,
  values: Record<string, string>,
  fields: FormField[],
): Promise<Record<string, string>> {
  const out: Record<string, string> = { ...parts };
  for (const [name, xml] of Object.entries(parts)) {
    let current = xml;
    for (const f of fields) {
      const token = `{{${f.key}}}`;
      if (current.includes(token)) {
        current = replaceToken(current, token, values[f.key] ?? '');
      }
      if (f.type === 'checkbox' && f.positionTokens?.length) {
        const sel = values[f.key] ?? '';
        const selIdx = (f.options ?? []).indexOf(sel);
        for (let i = 0; i < f.positionTokens.length; i++) {
          const t = f.positionTokens[i]!;
          if (current.includes(t)) current = replaceToken(current, t, i === selIdx ? BOX_CHECKED : BOX_UNCHECKED);
        }
      }
    }
    out[name] = current;
  }
  return out;
}