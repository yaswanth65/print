'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { PAPER_FORMATS } from '@/lib/paper-formats';
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
import { BobGoldLoanIndemnityPreview } from '@/templates/bobGoldLoanIndemnity/BobGoldLoanIndemnityPreview';
import { PanInstantSignatureAffidavitPreview } from '@/templates/panInstantSignatureAffidavit/PanInstantSignatureAffidavitPreview';

export const PreviewPanel = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const {
    activeTemplate,
    zoom,
    paperFormat,
    editMode,
    language,
    directContent,
    setDirectContent,
  } = useDocumentStore();

  const isDirectEdit = editMode === 'direct';
  const paper = PAPER_FORMATS[paperFormat] || PAPER_FORMATS.a4;
  const isIdCard = activeTemplate === 'identity_card';

  const containerRef = useRef<HTMLDivElement>(null);
  const capturedRef = useRef(false);

  const storedHtml = directContent[activeTemplate] as string | undefined;

  // When entering direct edit or switching templates, capture the rendered
  // DOM into the store so that subsequent re-renders (zoom change, etc.)
  // don't wipe the user's edits.
  useEffect(() => {
    if (!isDirectEdit) {
      capturedRef.current = false;
      return;
    }
    if (storedHtml !== undefined) {
      capturedRef.current = true;
      return;
    }
    // First time entering direct mode for this template – snapshot the
    // live DOM so edits have a backing store value from the start.
    if (!capturedRef.current && containerRef.current) {
      capturedRef.current = true;
      // Defer to next microtask so layout is complete.
      queueMicrotask(() => {
        if (containerRef.current) {
          setDirectContent(activeTemplate, containerRef.current.innerHTML);
        }
      });
    }
  }, [isDirectEdit, activeTemplate, storedHtml, setDirectContent]);

  const handleDirectInput = () => {
    if (containerRef.current) {
      setDirectContent(activeTemplate, containerRef.current.innerHTML);
    }
  };

  return (
    <main
      className={`h-full w-full bg-slate-200 overflow-y-auto print:bg-white print:overflow-visible custom-scrollbar ${
        language === 'te' ? 'font-telugu' : ''
      }`}
    >
      {/* Direct Edit Active Notification Banner */}
      {isDirectEdit && (
        <div className="sticky top-0 z-30 bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>DIRECT EDIT MODE ACTIVE: You can click and type directly anywhere inside the document canvas. Formatting and changes are live.</span>
          </div>
          <span className="text-[11px] bg-amber-700/60 px-2 py-0.5 rounded">Changes will be exported to Print & Word</span>
        </div>
      )}

      {/* Zoom Container - Centers scaling from top */}
      <div className="flex justify-center min-h-full py-8 print:py-0 print:block" style={{ transformOrigin: 'top center' }}>
        <div
          ref={ref}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 ease-out print:transform-none print:m-0 flex flex-col items-center"
        >
          {/* DYNAMIC PAPER SHELL */}
          <div
            ref={containerRef}
            contentEditable={isDirectEdit}
            suppressContentEditableWarning
            onInput={handleDirectInput}
            style={{
              width: isIdCard ? undefined : `${paper.widthMm}mm`,
              minHeight: isIdCard ? undefined : `${paper.heightMm}mm`,
              paddingLeft: isIdCard ? undefined : `${paper.leftMarginMm}mm`,
              paddingRight: isIdCard ? undefined : `${paper.rightMarginMm}mm`,
              paddingTop: isIdCard ? undefined : `${paper.topMarginMm}mm`,
              paddingBottom: isIdCard ? undefined : `${paper.bottomMarginMm}mm`,
            }}
            className={`relative transition-all bg-white ${
              isIdCard
                ? ''
                : 'shadow-2xl rounded-xs print:shadow-none print:w-full print:min-h-full'
            } ${
              isDirectEdit ? 'outline-2 outline-dashed outline-amber-400 cursor-text' : ''
            }`}
            {...(storedHtml !== undefined && isDirectEdit
              ? { dangerouslySetInnerHTML: { __html: storedHtml } }
              : {})}
          >
            {/* Render form-mode children (skipped when dangerouslySetInnerHTML is active) */}
            {!(storedHtml !== undefined && isDirectEdit) && (
              <div className="relative z-10 w-full">
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
                {activeTemplate === 'bob_gold_loan_indemnity' && <BobGoldLoanIndemnityPreview />}
                {activeTemplate === 'pan_instant_signature_affidavit' && <PanInstantSignatureAffidavitPreview />}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
});

PreviewPanel.displayName = 'PreviewPanel';