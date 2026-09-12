'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, FileText, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { getForms, removeForm, uploadForm, uploadStructuralForm } from '@/lib/clientForms';
import { SOURCE_TYPE_LABELS, type FormTemplateMeta } from '@/lib/types';

export default function Admin2Page() {
  const router = useRouter();
  const [forms, setForms] = useState<FormTemplateMeta[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setForms(await getForms());
    } catch (e: any) {
      setError(e?.message || 'Failed to load forms');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getForms()
      .then((f) => {
        if (mounted) setForms(f);
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message || 'Failed to load forms');
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleFile = async (file: File) => {
    if (uploading) return;
    setUploading(true);
    setError(null);
    try {
      const row = await uploadForm(file);
      await load();
      router.push(`/admin2/${row.id}`);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDelete = async (row: FormTemplateMeta) => {
    if (!confirm(`Delete "${row.title}"? This form will no longer appear in the Print Studio.`)) return;
    try {
      await removeForm(row.id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const [uploadMode, setUploadMode] = useState<'single' | 'structural'>('structural');
  const [blankFile, setBlankFile] = useState<File | null>(null);
  const [filledFile, setFilledFile] = useState<File | null>(null);
  const blankInputRef = useRef<HTMLInputElement>(null);
  const filledInputRef = useRef<HTMLInputElement>(null);

  const handleStructuralUpload = async () => {
    if (!blankFile || !filledFile || uploading) return;
    setUploading(true);
    setError(null);
    try {
      const row = await uploadStructuralForm(blankFile, filledFile);
      await load();
      router.push(`/admin2/${row.id}`);
    } catch (e: any) {
      setError(e?.message || 'Structural upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Create New Template</h3>
            <p className="text-xs text-slate-500">
              Upload documents to automatically generate a fillable template.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setUploadMode('structural')}
              className={`px-3 py-1 rounded-md transition-all ${
                uploadMode === 'structural'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              2-Slot Diff (Word COM / High-Fidelity)
            </button>
            <button
              onClick={() => setUploadMode('single')}
              className={`px-3 py-1 rounded-md transition-all ${
                uploadMode === 'single'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Single Document
            </button>
          </div>
        </div>

        {uploadMode === 'structural' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slot 1: Blank */}
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setBlankFile(f);
                }}
                onClick={() => blankInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  blankFile ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={blankInputRef}
                  type="file"
                  accept=".doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setBlankFile(f);
                    e.target.value = '';
                  }}
                />
                {blankFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlankFile(null);
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
                <Upload className={`w-7 h-7 mx-auto mb-2 ${blankFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-slate-800 break-all px-2">
                  {blankFile ? blankFile.name : '1. Select Blank Template (.doc/.docx)'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {blankFile ? '✓ Blank document ready' : 'Original file with empty fill-in blanks or underscores'}
                </div>
              </div>

              {/* Slot 2: Filled */}
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setFilledFile(f);
                }}
                onClick={() => filledInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  filledFile ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={filledInputRef}
                  type="file"
                  accept=".doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFilledFile(f);
                    e.target.value = '';
                  }}
                />
                {filledFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilledFile(null);
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
                <Upload className={`w-7 h-7 mx-auto mb-2 ${filledFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-slate-800 break-all px-2">
                  {filledFile ? filledFile.name : '2. Select Filled Sample (.doc/.docx)'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {filledFile ? '✓ Filled sample ready' : 'Same document with sample values filled in'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500">
                {!blankFile && filledFile && (
                  <span className="text-amber-600 font-semibold">
                    ← Upload the blank template to enable generation (or switch to Single Document if you only have one).
                  </span>
                )}
                {blankFile && !filledFile && (
                  <span className="text-amber-600 font-semibold">
                    → Upload the filled sample to enable generation (or switch to Single Document if you only have one).
                  </span>
                )}
                {!blankFile && !filledFile && (
                  <span>Select both a blank document and its filled sample for 100% layout preservation.</span>
                )}
                {blankFile && filledFile && (
                  <span className="text-emerald-600 font-semibold">
                    ✓ Both documents ready — click Generate to create the structural template.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(!blankFile || !filledFile) && (blankFile || filledFile) && (
                  <button
                    type="button"
                    onClick={() => {
                      const fileToUse = blankFile || filledFile;
                      if (fileToUse) {
                        void handleFile(fileToUse);
                      }
                    }}
                    disabled={uploading}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 underline transition-colors"
                  >
                    Continue with just this 1 file
                  </button>
                )}
                <button
                  disabled={!blankFile || !filledFile || uploading}
                  onClick={handleStructuralUpload}
                  className="flex items-center gap-2 bg-[#0d7c6b] hover:bg-[#0a6557] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-md transition-colors shadow-sm"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Processing diff…' : 'Generate Structural Template'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer p-8 text-center ${
              dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".cfa,.doc,.docx,.pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = '';
              }}
            />
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="font-bold text-slate-800">
              {uploading ? 'Processing document…' : 'Drop a document here or click to upload'}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Supported: .cfa, .doc, .docx, .pdf, .txt — one sample per form type is enough
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-md px-3 py-2 text-xs font-bold">
            {error}
          </div>
        )}
      </div>

      {/* Template list */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Form Templates ({forms.length})
          </h2>
        </div>

        {!loaded ? (
          <div className="bg-white rounded-xl p-10 text-center text-sm text-slate-400 font-medium">
            Loading…
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-sm text-slate-500 font-medium">
              No form templates yet. Upload a document to create your first one.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-800 leading-tight text-sm">{f.title}</div>
                  <span
                    className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide ${
                      f.status === 'READY'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {f.status === 'READY' ? 'READY' : 'DRAFT'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {f.source_type ? SOURCE_TYPE_LABELS[f.source_type] ?? f.source_type : '—'}
                  </span>
                  <span>{f.field_count} field{f.field_count === 1 ? '' : 's'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {f.original_filename || ''}
                  {f.created_at ? ` · ${new Date(f.created_at).toLocaleDateString()}` : ''}
                </div>
                <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                  <Link
                    href={`/admin2/${f.id}`}
                    className="flex-1 text-center bg-[#0d7c6b] hover:bg-[#0a6557] text-white text-xs font-bold py-2 rounded-md transition-colors"
                  >
                    {f.status === 'READY' ? 'Edit / Manage' : 'Review Blanks'}
                  </Link>
                  <button
                    onClick={() => handleDelete(f)}
                    className="bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 text-xs font-bold px-3 py-2 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}