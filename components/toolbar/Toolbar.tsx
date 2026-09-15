import { useState } from 'react';
import Link from 'next/link';
import { useDocumentStore } from '@/store/useDocumentStore';
import { FileText, Printer, Download, Loader2, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import type { TemplateType } from '@/store/useDocumentStore';

interface ToolbarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

const BUILTIN_TEMPLATE_TYPES: { id: TemplateType; label: string }[] = [
  { id: 'cv_resume', label: 'Curriculum Vitae (CV / Resume)' },
  { id: 'identity_card', label: 'Government Identity Card' },
  { id: 'cdma_death_correction', label: 'CDMA Death Corrections Application Form' },
  { id: 'lease_deed', label: 'Lease Deed (Commercial / Mulgie)' },
  { id: 'sbi_alias_general', label: 'SBI Alias Declaration Affidavit' },
  { id: 'single_women_affidavit', label: 'Single Women (Ontari Mahila) Affidavit' },
  { id: 'ssc_memo_affidavit', label: 'SSC Memo Lost Affidavit' },
  { id: 'rent_agreement', label: 'Rent Agreement (Draft)' },
  { id: 'affidavit', label: 'General Affidavit' },
  { id: 'sale_deed', label: 'Sale Deed' },
  { id: 'plot_agreement', label: 'Plot Sale Agreement' },
];

export const Toolbar = ({ printRef }: ToolbarProps) => {
  const {
    activeTemplate,
    setActiveTemplate,
    zoom,
    setZoom,
    data,
  } = useDocumentStore();

  const [downloading, setDownloading] = useState(false);

  const docTitle = `Varma_Xerox_${activeTemplate}`;

  // Export as Word (DOCX) handler
  const handleExportWord = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
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
      else fname = `${activeTemplate}.docx`;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
      {/* Left Group */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <div className="h-5 w-[1px] bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2C75FF] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900 font-sans">Varma Xerox</span>
        </div>
        <div className="h-5 w-[1px] bg-slate-200"></div>
        <select 
          value={activeTemplate} 
          onChange={(e) => setActiveTemplate(e.target.value as TemplateType)}
          className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2C75FF]"
        >
          {BUILTIN_TEMPLATE_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-3">
        {/* Zoom */}
        <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
          <button 
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border-r border-slate-200 text-slate-700 text-sm font-semibold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-2.5 py-1 bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center min-w-[3rem]">{zoom}%</span>
          <button 
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border-l border-slate-200 text-slate-700 text-sm font-semibold"
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* Export as Word Button */}
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
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#2C75FF] hover:bg-blue-600 text-white rounded-md text-sm font-medium transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};
