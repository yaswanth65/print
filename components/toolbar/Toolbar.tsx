import { useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { FileText, ZoomIn, ZoomOut, Printer, Edit3, FormInput } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface ToolbarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

export const Toolbar = ({ printRef }: ToolbarProps) => {
  const { activeTemplate, setActiveTemplate, editMode, setEditMode, zoom, setZoom } = useDocumentStore();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Print_simulator_${activeTemplate}`,
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
            value={activeTemplate} 
            onChange={(e) => setActiveTemplate(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="rent_agreement">Rent Agreement (Draft)</option>
            <option value="affidavit">Affidavit</option>
          </select>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-4">
          
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

          {/* Export */}
          <button 
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>
    </>
  );
};
