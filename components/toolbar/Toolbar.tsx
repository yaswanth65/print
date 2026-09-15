'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/store/useDocumentStore';
import {
  FileText,
  Printer,
  Download,
  Loader2,
  ArrowLeft,
  Search,
  ChevronDown,
  Layers,
  Globe,
  Edit3,
  SlidersHorizontal,
  UserCheck,
  Building,
  ScrollText,
  FileCheck,
  CreditCard,
  Folder,
  X,
  Check
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import type { TemplateType } from '@/store/useDocumentStore';
import { PAPER_FORMATS, PaperFormatId } from '@/lib/paper-formats';

interface ToolbarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

// CATEGORIZED TEMPLATES WITH SUBMENUS
export const TEMPLATE_CATEGORIES = [
  {
    name: 'ID Cards & Badges',
    icon: CreditCard,
    items: [
      { id: 'identity_card', label: 'Government Identity Card (TS Govt)', badge: 'Front + Back' },
      { id: 'cv_resume', label: 'Curriculum Vitae (CV / Resume)', badge: 'Photo' },
    ],
  },
  {
    name: 'Legal Affidavits',
    icon: ScrollText,
    items: [
      { id: 'single_women_affidavit', label: 'Single Women (Ontari Mahila) Affidavit', badge: 'Welfare' },
      { id: 'sbi_alias_general', label: 'SBI Alias Declaration Affidavit', badge: 'Bank' },
      { id: 'ssc_memo_affidavit', label: 'SSC Memo Lost Affidavit', badge: 'Education' },
      { id: 'affidavit', label: 'General Sworn Affidavit', badge: 'Notary' },
    ],
  },
  {
    name: 'Property & Agreements',
    icon: Building,
    items: [
      { id: 'rent_agreement', label: 'Residential Rent Agreement (Draft)', badge: 'Rental' },
      { id: 'lease_deed', label: 'Commercial Lease Deed (Mulgie)', badge: 'Stamp' },
      { id: 'plot_agreement', label: 'Plot Sale Agreement', badge: 'Real Estate' },
      { id: 'sale_deed', label: 'Conveyance Sale Deed', badge: 'Deed' },
    ],
  },
  {
    name: 'Government & Municipal',
    icon: FileCheck,
    items: [
      { id: 'cdma_death_correction', label: 'CDMA Death Corrections Application Form', badge: 'Municipal' },
    ],
  },
];

export const Toolbar = ({ printRef }: ToolbarProps) => {
  const router = useRouter();
  const {
    activeTemplate,
    setActiveTemplate,
    zoom,
    setZoom,
    editMode,
    setEditMode,
    paperFormat,
    setPaperFormat,
    language,
    setLanguage,
    idCardSide,
    setIdCardSide,
    activeIdCardType,
    setActiveIdCardType,
    data,
  } = useDocumentStore();

  const [downloading, setDownloading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const docTitle = `Varma_Xerox_${activeTemplate}`;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find active template label
  let activeLabel = 'Select Document';
  for (const cat of TEMPLATE_CATEGORIES) {
    const found = cat.items.find((i) => i.id === activeTemplate);
    if (found) {
      activeLabel = found.label;
      break;
    }
  }

  // Filtered categories based on search
  const filteredCategories = TEMPLATE_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.label.toLowerCase().includes(menuSearch.toLowerCase()) ||
        cat.name.toLowerCase().includes(menuSearch.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  // Switch User / Logout Handler
  const handleSwitchUser = () => {
    localStorage.removeItem('varma_xerox_session');
    router.push('/');
  };

  // Export as Word (DOCX)
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
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20 shadow-xs gap-3">
      {/* LEFT CONTROLS: Brand, Back, and Searchable Menu & Submenus */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Dashboard</span>
        </Link>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2C75FF] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs">
            VX
          </div>
          <span className="font-semibold text-slate-900 font-sans hidden md:inline text-sm">Varma Xerox</span>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* SEARCH + CATEGORIZED MENU & SUBMENUS DROPDOWN */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition shadow-2xs max-w-[280px] sm:max-w-xs truncate"
          >
            <Folder className="w-3.5 h-3.5 text-[#2C75FF] shrink-0" />
            <span className="truncate">{activeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {/* Submenu Popover */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95 duration-150">
              {/* Search input in dropdown */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search all templates..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#2C75FF] focus:bg-white"
                  autoFocus
                />
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Categorized List */}
              <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {filteredCategories.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs">No matching templates found</div>
                ) : (
                  filteredCategories.map((category) => {
                    const CatIcon = category.icon;
                    return (
                      <div key={category.name}>
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded-md mb-1">
                          <CatIcon className="w-3 h-3 text-[#2C75FF]" />
                          <span>{category.name}</span>
                        </div>
                        <div className="space-y-0.5">
                          {category.items.map((item) => {
                            const isSelected = activeTemplate === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveTemplate(item.id as TemplateType);
                                  setIsMenuOpen(false);
                                  setMenuSearch('');
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-blue-50 text-[#2C75FF] font-semibold'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                <span className="truncate pr-2">{item.label}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                    {item.badge}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2C75FF]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER & RIGHT CONTROLS */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1">
        {/* 1. PAPER FORMAT SELECTOR (A4, Ledger, Bond, Stamp Paper) */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5" title="Select Document Paper Format">
          <span className="px-2 text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span className="hidden xl:inline">Format:</span>
          </span>
          <select
            value={paperFormat}
            onChange={(e) => setPaperFormat(e.target.value as PaperFormatId)}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none pr-2 py-1 cursor-pointer"
          >
            <option value="a4">A4 (Minimal Margins)</option>
            <option value="ledger">Ledger (Advocate Stamp Zone)</option>
            <option value="bond">Bond Paper (Header Exclusion)</option>
            <option value="stamp_paper">50/100 Rs Stamp Paper</option>
            {activeTemplate === 'identity_card' && <option value="id_card">ID Card (CR80 / PVC)</option>}
          </select>
        </div>

        {/* 2. LANGUAGE SELECTOR (English -> Telugu) */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5" title="Document Language Translation">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
              language === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('te')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
              language === 'te' ? 'bg-[#2C75FF] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Translate document output to Telugu"
          >
            తెలుగు
          </button>
        </div>

        {/* 3. EDIT MODE TOGGLE: Structured Edit vs Direct Edit */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setEditMode('form')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              editMode === 'form' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">Structured</span>
          </button>
          <button
            type="button"
            onClick={() => setEditMode('direct')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              editMode === 'direct' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Click and edit document text directly on the canvas"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">Direct Edit</span>
          </button>
        </div>

        {/* 4. ID CARD SIDE SELECTOR (If active template is identity_card) */}
        {activeTemplate === 'identity_card' && (
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-0.5 text-xs font-semibold text-[#2C75FF]">
            <button
              onClick={() => setIdCardSide('front')}
              className={`px-2 py-1 rounded-md transition ${idCardSide === 'front' ? 'bg-[#2C75FF] text-white' : 'hover:bg-blue-100'}`}
            >
              Front
            </button>
            <button
              onClick={() => setIdCardSide('back')}
              className={`px-2 py-1 rounded-md transition ${idCardSide === 'back' ? 'bg-[#2C75FF] text-white' : 'hover:bg-blue-100'}`}
            >
              Back
            </button>
            <button
              onClick={() => setIdCardSide('both')}
              className={`px-2 py-1 rounded-md transition ${idCardSide === 'both' ? 'bg-[#2C75FF] text-white' : 'hover:bg-blue-100'}`}
            >
              Both
            </button>
          </div>
        )}

        {/* 5. ZOOM CONTROLS */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="px-2 py-1 hover:bg-slate-50 border-r border-slate-200 text-slate-700 text-xs font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-2 py-1 bg-slate-50 text-[11px] font-semibold text-slate-700 min-w-[2.8rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="px-2 py-1 hover:bg-slate-50 border-l border-slate-200 text-slate-700 text-xs font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* 6. EXPORT AS WORD BUTTON */}
        <button
          onClick={handleExportWord}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
          title="Export native Word (.docx) document"
        >
          {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Export Word</span>
        </button>

        {/* 7. PRINT / PDF BUTTON */}
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2C75FF] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition shadow-xs shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>

        {/* 8. SWITCH USER QUICK BUTTON */}
        <button
          onClick={handleSwitchUser}
          className="p-1.5 text-slate-500 hover:text-[#FB3748] hover:bg-red-50 border border-slate-200 rounded-lg transition shrink-0"
          title="Switch User / Logout"
        >
          <UserCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
