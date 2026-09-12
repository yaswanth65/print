// lib/extract.ts
// Server-only helpers that pull plain text out of uploaded files.
//
//   .cfa  →  QHBK header + zlib payload. Payload is a Word .doc (OLE2).
//   .doc  →  OLE2 Word → word-extractor (pure Node, no MS Word needed).
//   .docx →  OOXML Word → mammoth.
//   .pdf  →  pdf-parse (pure Node).
//   .txt  →  raw UTF-8.

import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { inflateSync } from 'node:zlib';
import { createRequire } from 'node:module';
import WordExtractor from 'word-extractor';
import mammoth from 'mammoth';
import type { SourceType } from './types';

// pdf-parse ships as CommonJS without a clean ESM default; load it via
// require() to dodge webpack interop issues in route handlers.
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse') as (
  data: Buffer,
  options?: any,
) => Promise<{ text: string; numpages: number; info: any }>;

export const ACCEPTED_EXTENSIONS = ['.cfa', '.doc', '.docx', '.pdf', '.txt'];

export function sourceTypeFromName(name: string): SourceType {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'cfa') return 'cfa';
  if (ext === 'doc') return 'doc';
  if (ext === 'docx') return 'docx';
  if (ext === 'pdf') return 'pdf';
  return 'txt';
}

export interface ExtractResult {
  type: SourceType;
  text: string;
  innerDocBytes?: Buffer;
}

export async function extractTextFromBuffer(buf: Buffer, name: string): Promise<ExtractResult> {
  const type = sourceTypeFromName(name);

  switch (type) {
    case 'cfa': {
      const inner = unwrapCfa(buf);
      const text = await extractDocText(inner);
      return { type, text, innerDocBytes: inner };
    }
    case 'doc':
      return { type, text: await extractDocText(buf) };
    case 'docx': {
      const res = await mammoth.extractRawText({ buffer: buf });
      return { type, text: res.value || '' };
    }
    case 'pdf':
      return { type, text: await extractPdfText(buf) };
    default: {
      const text = buf.toString('utf-8').replace(/^\uFEFF/, '');
      return { type: 'txt', text };
    }
  }
}

// ─── CFA unpacking ─────────────────────────────────────────────

export function unwrapCfa(buf: Buffer): Buffer {
  if (buf.length < 8) throw new Error('File too small to be a .cfa archive');
  const magic = buf.subarray(0, 4).toString('ascii');
  if (magic !== 'QHBK') throw new Error('Not a .cfa archive: missing QHBK header');
  try {
    return Buffer.from(inflateSync(buf.subarray(8)));
  } catch {
    throw new Error('Failed to decompress .cfa archive');
  }
}

function isOleDoc(buf: Buffer): boolean {
  return (
    buf.length >= 8 &&
    buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0 &&
    buf[4] === 0xa1 && buf[5] === 0xb1 && buf[6] === 0x1a && buf[7] === 0xe1
  );
}

async function extractDocText(docBuf: Buffer): Promise<string> {
  if (!isOleDoc(docBuf)) {
    throw new Error('Word payload is not a valid .doc (OLE2) file');
  }
  const tmpPath = join(tmpdir(), `aft_${Date.now()}_${Math.random().toString(36).slice(2)}.doc`);
  await fsp.writeFile(tmpPath, docBuf);
  try {
    const extractor = new WordExtractor();
    const doc = await extractor.extract(tmpPath);
    return doc.getBody() || '';
  } finally {
    await fsp.unlink(tmpPath).catch(() => {});
  }
}

async function extractPdfText(buf: Buffer): Promise<string> {
  const res = await pdfParse(buf);
  return res.text || '';
}