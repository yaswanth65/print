import { useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { FileText, ZoomIn, ZoomOut, Printer, Edit3, FormInput } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { createDocument } from '@/app/actions/app-actions';

interface ToolbarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

export const Toolbar = ({ printRef }: ToolbarProps) => {
  const { activeTemplate, setActiveTemplate, editMode, setEditMode, zoom, setZoom } = useDocumentStore();
  const [showPopup, setShowPopup] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Print_simulator_${activeTemplate}`,
  });

  const onExportClick = () => {
    setShowPopup(true);
  };

  const confirmAndPrint = async () => {
    if (!customerName.trim()) return alert('Please enter Customer Name');
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('documentTitle', activeTemplate === 'rent_agreement' ? 'Rent Agreement' : 'Affidavit');
    formData.append('templateType', activeTemplate);

    const res = await createDocument(formData);
    setIsSubmitting(false);

    if (res.success) {
      setShowPopup(false);
      setCustomerName('');
      
      // Trigger actual print
      handlePrint();
    } else {
      alert(res.error || 'Failed to save record to manager dashboard');
    }
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

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full font-sans">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Document Print</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="text-sm text-gray-700">
                <p><span className="font-semibold">Template:</span> {activeTemplate === 'rent_agreement' ? 'Rent Agreement' : 'Affidavit'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAndPrint}
                disabled={isSubmitting || !customerName.trim()}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Confirm & Print'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
