// lib/docx/zip.ts
// Minimal .docx (OPC zip) read/write helpers built on jszip.
// Server-only.

import JSZip from 'jszip';

export async function openDocx(buf: Buffer): Promise<JSZip> {
  return JSZip.loadAsync(buf);
}

export async function readPartText(zip: JSZip, name: string): Promise<string> {
  const file = zip.file(name);
  if (!file) throw new Error(`Missing docx part: ${name}`);
  return file.async('string');
}

export async function readPartBuffer(zip: JSZip, name: string): Promise<Buffer> {
  const file = zip.file(name);
  if (!file) throw new Error(`Missing docx part: ${name}`);
  const raw = await file.async('nodebuffer');
  return Buffer.from(raw);
}

export function xmlPartNames(zip: JSZip): string[] {
  return Object.keys(zip.files).filter((n) => n.endsWith('.xml'));
}

// Serialize a whole docx back to a Buffer. `patch` overrides any entry; every
// other package part (styles.xml, media, headers…) is copied byte-for-byte.
export async function writeDocx(zip: JSZip, patch?: Record<string, string | Buffer>): Promise<Buffer> {
  const out = new JSZip();
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);
  for (const name of names) {
    if (patch && name in patch) {
      const v = patch[name];
      out.file(name, typeof v === 'string' ? v : v);
    } else {
      const file = zip.file(name)!;
      const raw = await file.async('nodebuffer');
      // nodebuffer is a Buffer on Node; wrap plain if needed
      out.file(name, Buffer.isBuffer(raw) ? raw : Buffer.from(raw as Uint8Array));
    }
  }
  return Buffer.from(await out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}