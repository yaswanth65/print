import { forwardRef } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { RentAgreementPreview } from '@/templates/rentAgreement/RentAgreementPreview';
import { AffidavitPreview } from '@/templates/affidavit/AffidavitPreview';
import { SaleDeedPreview } from '@/templates/saleDeed/SaleDeedPreview';
import { PlotAgreementPreview } from '@/templates/plotAgreement/PlotAgreementPreview';
import { SscMemoAffidavitPreview } from '@/templates/sscMemoAffidavit/SscMemoAffidavitPreview';
import { CdmaDeathCorrectionPreview } from '@/templates/cdmaDeathCorrection/CdmaDeathCorrectionPreview';
import { LeaseDeedPreview } from '@/templates/leaseDeed/LeaseDeedPreview';
import { SbiAliasGeneralPreview } from '@/templates/sbiAliasGeneral/SbiAliasGeneralPreview';
import { SingleWomenAffidavitPreview } from '@/templates/singleWomenAffidavit/SingleWomenAffidavitPreview';
import { CvResumePreview } from '@/templates/cvResume/CvResumePreview';
import { IdentityCardPreview } from '@/templates/identityCard/IdentityCardPreview';

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
          {activeTemplate === 'cdma_death_correction' && <CdmaDeathCorrectionPreview />}
          {activeTemplate === 'lease_deed' && <LeaseDeedPreview />}
          {activeTemplate === 'sbi_alias_general' && <SbiAliasGeneralPreview />}
          {activeTemplate === 'single_women_affidavit' && <SingleWomenAffidavitPreview />}
          {activeTemplate === 'ssc_memo_affidavit' && <SscMemoAffidavitPreview />}
          {activeTemplate === 'rent_agreement' && <RentAgreementPreview />}
          {activeTemplate === 'affidavit' && <AffidavitPreview />}
          {activeTemplate === 'sale_deed' && <SaleDeedPreview />}
          {activeTemplate === 'plot_agreement' && <PlotAgreementPreview />}
          {activeTemplate === 'cv_resume' && <CvResumePreview />}
          {activeTemplate === 'identity_card' && <IdentityCardPreview />}
        </div>
      </div>
    </main>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
