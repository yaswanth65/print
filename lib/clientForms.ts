// lib/clientForms.ts
// Type-safe client-side wrappers for the /api/forms endpoints.

import type { FormTemplate, FormTemplateMeta, TemplateDef, TemplateStatus } from './types';

async function handle<T>(res: Response, fallback?: T): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function getForms(signal?: AbortSignal): Promise<FormTemplateMeta[]> {
  const res = await fetch('/api/forms', { cache: 'no-store', signal });
  return handle<FormTemplateMeta[]>(res, []);
}

export async function uploadForm(file: File): Promise<FormTemplateMeta> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/forms', { method: 'POST', body: fd });
  return handle<FormTemplateMeta>(res);
}

export async function uploadStructuralForm(blank: File, filled: File): Promise<FormTemplateMeta> {
  const fd = new FormData();
  fd.append('file', blank);
  fd.append('filled', filled);
  const res = await fetch('/api/forms', { method: 'POST', body: fd });
  return handle<FormTemplateMeta>(res);
}

export async function getForm(id: string, signal?: AbortSignal): Promise<FormTemplate> {
  const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, { cache: 'no-store', signal });
  return handle<FormTemplate>(res);
}

export interface SaveFormInput {
  title?: string;
  status?: TemplateStatus;
  template_def?: TemplateDef;
  redetect?: boolean;
}

export async function saveForm(id: string, patch: SaveFormInput): Promise<FormTemplate> {
  const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return handle<FormTemplate>(res);
}

export async function removeForm(id: string): Promise<void> {
  const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await handle<{ ok: boolean }>(res);
}

export interface RenderResult {
  blob: Blob;
  filename: string;
}

export async function renderForm(id: string, values: Record<string, string>): Promise<RenderResult> {
  const res = await fetch(`/api/forms/${encodeURIComponent(id)}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) {
    let message = `Render failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const cd = res.headers.get('Content-Disposition') ?? '';
  const m = cd.match(/filename="?([^";]+)"?/);
  return { blob, filename: m ? m[1] : `${id}.docx` };
}