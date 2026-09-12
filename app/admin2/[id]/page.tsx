'use client';

import { useEffect, use, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, ChevronDown, Eraser, Loader2, RefreshCw, Save, Trash2,
} from 'lucide-react';
import { getForm, removeForm, saveForm } from '@/lib/clientForms';
import { DocPreview } from '@/components/admin2/DocPreview';
import type { FieldType, FormField, FormTemplate, TemplateStatus } from '@/lib/types';

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  textarea: 'Text area',
  date: 'Date',
  select: 'Dropdown list',
  checkbox: 'Checkbox',
};

function parseOptions(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\n,]+/)) {
    const t = part.trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

export default function Admin2FormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    getForm(id)
      .then((f) => {
        if (!mounted) return;
        setForm(f);
        setTitle(f.title);
        setFields(f.template_def?.fields ?? []);
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message || 'Failed to load form');
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const flash = (msg: string) => {
    setNotice(msg);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3500);
  };

  const updateField = (index: number, patch: Partial<FormField>) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const removeAt = (index: number) => {
    const f = fields[index];
    if (!confirm(`Remove field "${f.label}"? Spots in the document using this field will become blank.`)) return;
    setFields((prev) => prev.filter((_, i) => i !== index));
    flash(`Removed "${f.label}"`);
  };

  const save = async (status: TemplateStatus) => {
    setSaving(true);
    setError(null);
    try {
      const def = {
        fields,
        layout: form?.template_def?.layout ?? [],
      };
      const res = await saveForm(id, { title: title.trim() || form!.title, status, template_def: def });
      setForm(res);
      setTitle(res.title);
      setFields(res.template_def?.fields ?? []);
      flash(
        status === 'READY'
          ? 'Saved & activated — this form now appears in the Print Studio dropdown.'
          : 'Draft saved.',
      );
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const redetect = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await saveForm(id, { redetect: true });
      setForm(res);
      setTitle(res.title);
      setFields(res.template_def?.fields ?? []);
      flash('Blank detection re-run on the extracted text.');
    } catch (e: any) {
      setError(e?.message || 'Re-detect failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${title}"?`)) return;
    try {
      await removeForm(id);
      router.push('/admin2');
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const fieldCount = fields.length;
  const readyCount = useMemo(() => fields.filter((f) => f.type === 'select').length, [fields]);
  const status = form?.status ?? 'DRAFT';

  if (!loaded) {
    return <div className="bg-white rounded-xl p-12 text-center text-sm text-slate-400 font-medium">Loading…</div>;
  }
  if (!form) {
    return (
      <div className="bg-white rounded-xl p-12 text-center space-y-3">
        <div className="text-sm text-slate-500 font-medium">This form template could not be found.</div>
        <Link href="/admin2" className="text-sm font-bold text-indigo-600 hover:underline">
          ← Back to Form Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">
            Form Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-bold text-slate-800 outline-none border border-transparent hover:border-slate-200 focus:border-indigo-400 rounded-md px-2 py-1.5 bg-slate-50"
            placeholder="e.g., SSC Memo Lost Affidavit"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap lg:justify-end">
          <span className={`text-[10px] font-black px-2 py-1 rounded-full tracking-wide ${
            status === 'READY' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {status === 'READY' ? 'ACTIVE IN STUDIO' : 'DRAFT'}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {fieldCount} field{fieldCount === 1 ? '' : 's'} · {readyCount} dropdown{readyCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin2"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 transition-colors"
        >
          ← All Forms
        </Link>
        <button
          onClick={redetect}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Re-detect blanks
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 bg-white border border-red-200 rounded-md px-3 py-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
        <div className="flex-1" />
        <button
          onClick={() => save('DRAFT')}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 bg-white border border-slate-300 rounded-md px-3 py-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Draft
        </button>
        <button
          onClick={() => save('READY')}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-bold text-white hover:bg-[#0a6557] bg-[#0d7c6b] rounded-md px-4 py-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Save & Activate
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-md px-3 py-2 text-xs font-bold">{error}</div>
      )}
      {notice && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-md px-3 py-2 text-xs font-bold">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Field list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Detected Fields
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Auto-detected blank spots &amp; suggestions. Rename, change the input type, add dropdown
              options, or remove anything you don&apos;t want.
            </p>

            {fields.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-8 font-medium">
                No fields detected. Use &quot;Re-detect blanks&quot; or upload a different document.
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.key} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-200 text-[10px] font-bold text-slate-600 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <code className="text-[10px] text-slate-400 font-mono">{field.key}</code>
                    <button
                      onClick={() => removeAt(i)}
                      className="ml-auto text-slate-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                      title="Remove field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-sm font-semibold outline-none focus:border-indigo-400"
                    placeholder="Field label"
                  />

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const next = e.target.value as FieldType;
                          updateField(i, {
                            type: next,
                            options:
                              next === 'select'
                                ? field.options?.length
                                  ? field.options
                                  : ['S/o.', 'D/o.', 'W/o.']
                                : undefined,
                          });
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-sm font-medium outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                      >
                        {(Object.keys(FIELD_TYPE_LABELS) as FieldType[]).map((t) => (
                          <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                        Dropdown options (comma separated)
                      </label>
                      <input
                        value={field.options?.join(', ') ?? ''}
                        onChange={(e) => updateField(i, { options: parseOptions(e.target.value) })}
                        placeholder="e.g., S/o., D/o., W/o."
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + raw text */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Document Preview
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Highlighted chips = detected blanks. Blue = text, amber = dropdown.
            </p>
            <div className="border border-slate-200 rounded-lg p-6 bg-white">
              <DocPreview
                def={
                  form.template_def && 'kind' in form.template_def && form.template_def.kind === 'docx'
                    ? { ...form.template_def, fields }
                    : { fields, layout: form.template_def?.layout ?? [] }
                }
                mode="review"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowText((v) => !v)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Extracted Text ({form.extracted_text?.split('\n').length ?? 0} lines)
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showText ? 'rotate-180' : ''}`} />
            </button>
            {showText && (
              <pre className="px-4 pb-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50 max-h-96 overflow-y-auto">
                {form.extracted_text || '(no extracted text)'}
              </pre>
            )}
          </div>

          {form.template_def?.layout.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs font-medium text-amber-800">
              This document has no detected blanks. You can still activate it as a plain document, or
              re-upload a version that marks blanks with underscores / dotted lines.
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Eraser className="w-3.5 h-3.5" />
            <span>Tip: underlined blanks in Word files are usually visible as blank text runs — re-upload with explicit
              underscores if nothing was detected. Fields only appear on the printed page where they were in the original.</span>
          </div>
        </div>
      </div>
    </div>
  );
}