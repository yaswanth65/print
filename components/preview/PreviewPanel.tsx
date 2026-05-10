import { forwardRef } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { RentAgreementPreview } from '@/templates/rentAgreement/RentAgreementPreview';
import { AffidavitPreview } from '@/templates/affidavit/AffidavitPreview';

export const PreviewPanel = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { activeTemplate, zoom } = useDocumentStore();

  return (
    <main className="h-full w-full bg-slate-200 overflow-y-auto print:bg-white print:overflow-visible custom-scrollbar">
      {/* Zoom Container - Scale centers from top */}
      <div className="flex justify-center min-h-full py-12 print:py-0 print:block" style={{ transformOrigin: 'top center' }}>
        
        <div 
          ref={ref} 
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} 
          className="transition-transform duration-200 ease-out print:transform-none select-none print:m-0 flex flex-col gap-8 items-center"
        >
          {activeTemplate === 'rent_agreement' && <RentAgreementPreview />}
          {activeTemplate === 'affidavit' && <AffidavitPreview />}
        </div>
        
      </div>
    </main>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
