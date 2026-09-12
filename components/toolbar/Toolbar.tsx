import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDocumentStore } from '@/store/useDocumentStore';
import { FileText, ZoomIn, ZoomOut, Printer, Edit3, FormInput, PlusCircle, Download, Loader2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { getForms, getForm, renderForm } from '@/lib/clientForms';
import type { TemplateType } from '@/store/useDocumentStore';

interface ToolbarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

const BUILTIN_TEMPLATE_TYPES: TemplateType[] = [
  'rent_agreement', 
  'affidavit', 
  'sale_deed', 
  'plot_agreement', 
  'ssc_memo_affidavit',
  'cdma_death_correction',
  'lease_deed',
  'sbi_alias_general',
  'single_women_affidavit'
];

export const Toolbar = ({ printRef }: ToolbarProps) => {
  const {
    activeTemplate,
    setActiveTemplate,
    editMode,
    setEditMode,
    zoom,
    setZoom,
    forms,
    setForms,
    activeFormId,
    setActiveForm,
    formDefs,
    setFormDef,
    setFormValues,
    data,
  } = useDocumentStore();

  useEffect(() => {
    let mounted = true;
    getForms()
      .then((f) => {
        if (mounted) setForms(f);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [setForms]);

  const selectUploadedForm = async (formId: string) => {
    setActiveForm(formId);
    if (formDefs[formId]) return;
    try {
      const t = await getForm(formId);
      if (t?.template_def) {
        setFormDef(formId, t.template_def);
        setFormValues(formId, {});
      }
    } catch {
      // template fetch failed; keep placeholder state
    }
  };

  const onTemplateChange = (value: string) => {
    if (BUILTIN_TEMPLATE_TYPES.includes(value as TemplateType)) {
      setActiveTemplate(value as TemplateType);
      return;
    }
    selectUploadedForm(value);
  };

  const readyForms = forms.filter((f) => f.status === 'READY');
  const selectValue = activeFormId ?? activeTemplate;
  const docTitle = activeFormId
    ? forms.find((f) => f.id === activeFormId)?.title ?? 'Uploaded_Form'
    : `Print_simulator_${activeTemplate}`;

  const [downloading, setDownloading] = useState(false);

  const activeDef = activeFormId ? formDefs[activeFormId] : null;
  const isDocxTemplate = activeDef && 'kind' in activeDef && activeDef.kind === 'docx';

  // Export as Word (DOCX) handler for both built-in templates and uploaded forms
  const handleExportWord = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (activeFormId) {
        const currentValues = (useDocumentStore.getState().formValues[activeFormId] ?? {}) as Record<string, string>;
        const { blob, filename } = await renderForm(activeFormId, currentValues);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else if (
        activeTemplate === 'cdma_death_correction' || 
        activeTemplate === 'lease_deed' || 
        activeTemplate === 'sbi_alias_general' ||
        activeTemplate === 'single_women_affidavit'
      ) {
        const currentValues = data[activeTemplate] || {};
        const res = await fetch('/api/export-docx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            template: activeTemplate,
            values: currentValues,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to export DOCX');
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        let fname = 'document.docx';
        if (activeTemplate === 'cdma_death_correction') fname = 'CDMA_Death_Corrections_Application_Form.docx';
        else if (activeTemplate === 'lease_deed') fname = 'LEASE_DEED.docx';
        else if (activeTemplate === 'sbi_alias_general') fname = 'SBI_ALIAS_DECLARATION_AFFIDAVIT.docx';
        else if (activeTemplate === 'single_women_affidavit') fname = 'SINGLE_WOMEN_ONTARI_MAHILA_AFFIDAVIT.docx';
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        alert('Export as Word is configured for CDMA, Lease Deed, SBI Alias, and Single Women Affidavit templates.');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to export Word document');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: docTitle,
  });

  const onExportClick = () => {
    handlePrint();
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
        
        {/* Left Group */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold"><FileText className="w-4 h-4" /></div>
            <span className="font-semibold tracking-tight text-slate-800">Print simulator</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <select 
            value={selectValue} 
            onChange={(e) => onTemplateChange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <optgroup label="Built-in Templates">
              <option value="rent_agreement">Rent Agreement (Draft)</option>
              <option value="affidavit">Affidavit</option>
              <option value="sale_deed">Sale Deed</option>
              <option value="plot_agreement">Plot Sale Agreement</option>
              <option value="ssc_memo_affidavit">SSC Memo Lost Affidavit</option>
              <option value="cdma_death_correction">CDMA Death Corrections Application Form</option>
              <option value="lease_deed">Lease Deed (Commercial / Mulgie)</option>
              <option value="sbi_alias_general">SBI Alias Declaration Affidavit</option>
              <option value="single_women_affidavit">Single Women (Ontari Mahila) Affidavit</option>
            </optgroup>
            {readyForms.length > 0 && (
              <optgroup label="Uploaded Forms">
                {readyForms.map((f) => (
                  <option key={f.id} value={f.id}>{f.title}</option>
                ))}
              </optgroup>
            )}
            {readyForms.length === 0 && (
              <option disabled value="">No uploaded forms yet (Form Builder)</option>
            )}
          </select>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-3">
          
          <Link
            href="/admin2"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Form Builder
          </Link>
          
          {/* Editor Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setEditMode('form')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                editMode === 'form' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Form Edit
            </button>
            <button 
              onClick={() => setEditMode('direct')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                editMode === 'direct' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Direct Edit
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-3 py-1 bg-white hover:bg-slate-50 border-r border-slate-200 text-slate-700"
              title="Zoom Out"
            >
              -
            </button>
            <span className="px-3 py-1 bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center min-w-[3rem]">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="px-3 py-1 bg-white hover:bg-slate-50 border-l border-slate-200 text-slate-700"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Export as Word Button (Right next to Print / Export PDF) */}
          <button
            onClick={handleExportWord}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            title="Export native Word (.docx) document with original layout and formatting"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export as Word</span>
          </button>

          {/* Export PDF / Print */}
          <button 
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>
    </>
  );
};
