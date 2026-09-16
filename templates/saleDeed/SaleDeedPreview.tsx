import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './saleDeed.module.css';

export const SaleDeedPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.sale_deed;
  const t = 'sale_deed';

  const vendorName = formatTeluguValue(d.vendorName, language);
  const purchaserName = formatTeluguValue(d.purchaserName, language);
  const propertyDescription = formatTeluguValue(d.propertyDescription, language);

  return (
    <div className={styles['sale-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['sale-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ స్థిరాస్తి విక్రయ నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['sale-title']}>
            {isTe ? 'స్థిరాస్తి సంపూర్ణ విక్రయ దస్తావేజు' : 'DEED OF ABSOLUTE SALE'}
          </h1>

          <p className={styles['sale-intro']}>
            {isTe ? (
              <>
                ఈ విక్రయ దస్తావేజు తేదీ: <EditableField template={t} fieldPath="saleDate" value={d.saleDate} className="font-bold" /> నాడు, విక్రేత (వెండార్) <span className="font-bold uppercase">{vendorName}</span> మరియు కొనుగోలుదారు (పర్చేజర్) <span className="font-bold uppercase">{purchaserName}</span> ల మధ్య వ్రాయించి ఇవ్వబడినది.
              </>
            ) : (
              <>
                This Deed of Absolute Sale is made on <EditableField template={t} fieldPath="saleDate" value={d.saleDate} className="font-bold" /> between{' '}
                <EditableField template={t} fieldPath="vendorName" value={d.vendorName} className="font-bold uppercase" /> (VENDOR) and{' '}
                <EditableField template={t} fieldPath="purchaserName" value={d.purchaserName} className="font-bold uppercase" /> (PURCHASER).
              </>
            )}
          </p>

          <div className="space-y-4 text-justify leading-relaxed">
            <p>
              {isTe
                ? 'విక్రయ ప్రతిఫల మొత్తం రూ. ' + d.saleConsideration + '/- లను విక్రేత కొనుగోలుదారు నుండి పూర్తిగా అందుకుని, ఆస్తిపై సర్వ హక్కులను కొనుగోలుదారుకు సంపూర్ణముగా బదలాయించినారు.'
                : 'The Vendor has received the total sale consideration of Rs. ' + d.saleConsideration + '/- and conveyed all rights and ownership to the Purchaser.'}
            </p>
            <p className="font-semibold">
              {isTe ? 'ఆస్తి వివరణ: ' : 'Schedule of Property: '}
              <span className="font-bold uppercase">{propertyDescription}</span>.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-300 grid grid-cols-2 gap-8">
          <div>
            <p className="font-bold uppercase">{vendorName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'విక్రేత సంతకము' : 'SIGNATURE OF VENDOR'}</p>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase">{purchaserName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'కొనుగోలుదారు సంతకము' : 'SIGNATURE OF PURCHASER'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
