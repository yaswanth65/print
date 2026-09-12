// lib/normalize.ts
// Structural normalization: bring any Word input to modern OOXML (.docx) so
// the structural template engine has a single canonical format.
//
//   .docx → passthrough (validated lightly)
//   .doc  → converted via MS Word COM (Word is installed on the host machine)
//
// Everything downstream (diff, template, render, preview) then works on the
// DOCX structure only. Server-only.

import { execFileSync } from 'node:child_process';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

const WORD_FORMAT_DOCX = 16; // wdFormatDocumentDefault — keeps layout

function isZip(buf: Buffer): boolean {
  return buf.length > 2 && buf[0] === 0x50 && buf[1] === 0x4b;
}

export interface NormalizeResult {
  docx: Buffer;
  converted: 'docx' | 'doc';
  warning?: string;
}

export async function normalizeToDocx(buf: Buffer, ext: string): Promise<NormalizeResult> {
  const lower = ext.toLowerCase();

  if (lower === 'docx') {
    if (!isZip(buf)) {
      throw new Error('File does not look like a valid .docx (missing zip header)');
    }
    return { docx: buf, converted: 'docx' };
  }

  if (lower === 'doc') {
    const docx = await convertDocViaWord(buf);
    return { docx, converted: 'doc' };
  }

  throw new Error(`Unsupported document type "${ext}" — only .doc and .docx are supported here`);
}

// Convert an OLE2 .doc to .docx using installed MS Word (via PowerShell).
// Pure-node parsers only give text; only Word preserves the actual layout.
async function convertDocViaWord(docBuf: Buffer): Promise<Buffer> {
  const dir = await fsp.mkdtemp(join(tmpdir(), 'af_norm_'));
  const inPath = join(dir, `in_${randomUUID()}.doc`);
  const outPath = join(dir, `out_${randomUUID()}.docx`);
  const script = join(dir, 'convert.ps1');

  try {
    await fsp.writeFile(inPath, docBuf);
    const ps = [
      "$ErrorActionPreference = 'Stop'",
      '$word = New-Object -ComObject Word.Application',
      '$word.Visible = $false',
      '$word.DisplayAlerts = 0',
      'try {',
      `  $doc = $word.Documents.Open([string]'${inPath.replace(/'/g, "''")}')`,
      `  $doc.SaveAs([string]'${outPath.replace(/'/g, "''")}', ${WORD_FORMAT_DOCX})`,
      '  $doc.Close(0)',
      '} finally { $word.Quit() }',
    ].join('\n');
    await fsp.writeFile(script, ps, 'utf8');

    executePwsh(`-NoProfile -ExecutionPolicy Bypass -File "${script}"`);
    const out = await fsp.readFile(outPath);
    if (!isZip(out)) throw new Error('Word conversion produced an invalid .docx');
    return out;
  } finally {
    await fsp.rm(dir, { recursive: true, force: true });
  }
}

function executePwsh(args: string): void {
  // Prefer full pwsh 7, fall back to Windows PowerShell 5.1
  for (const exe of ['pwsh', 'powershell.exe']) {
    try {
      execFileSync(exe, args.split(' '), { timeout: 120_000, windowsHide: true, stdio: 'pipe' });
      return;
    } catch (e: any) {
      const noSuchFile = e?.code === 'ENOENT';
      if (!noSuchFile) throw new Error(`MS Word conversion failed: ${e?.stderr?.toString?.() ?? e?.message ?? e}`);
    }
  }
  throw new Error('Neither pwsh nor powershell.exe was found — cannot convert .doc files here');
}