import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './plotAgreement.module.css';

export const PlotAgreementPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.plot_agreement;
  const t = 'plot_agreement';

  const vendorName = formatTeluguValue(d.vendorName, language);
  const purchaserName = formatTeluguValue(d.purchaserName, language);
  const plotLocation = formatTeluguValue(d.plotLocation, language);

  return (
    <div className={styles['plot-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['plot-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ ప్లాట్ విక్రయ నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['plot-title']}>
            {isTe ? 'ఓపెన్ ప్లాట్ విక్రయ ఒప్పంద పత్రము' : 'AGREEMENT OF SALE FOR OPEN PLOT'}
          </h1>

          <p className={styles['plot-intro']}>
            {isTe ? (
              <>
                ఈ ప్లాట్ విక్రయ ఒప్పందము తేదీ: <EditableField template={t} fieldPath="agreementDate" value={d.agreementDate} className="font-bold" /> నాడు, విక్రేత <span className="font-bold uppercase">{vendorName}</span> మరియు కొనుగోలుదారు <span className="font-bold uppercase">{purchaserName}</span> ల మధ్య కుదుర్చుకోబడినది.
              </>
            ) : (
              <>
                This Plot Sale Agreement is executed on <EditableField template={t} fieldPath="agreementDate" value={d.agreementDate} className="font-bold" /> between{' '}
                <EditableField template={t} fieldPath="vendorName" value={d.vendorName} className="font-bold uppercase" /> (VENDOR) and{' '}
                <EditableField template={t} fieldPath="purchaserName" value={d.purchaserName} className="font-bold uppercase" /> (PURCHASER).
              </>
            )}
          </p>

          <div className="space-y-4 text-justify leading-relaxed">
            <p>
              {isTe
                ? 'ప్లాట్ నెం. ' + d.plotNumber + ', సర్వే నెం. ' + d.surveyNumber + ', మొత్తం విస్తీర్ణము ' + d.totalExtentSqYds + ' చదరపు గజములు గల స్థలము ' + plotLocation + ' నందు కలదు.'
                : 'The Vendor agrees to sell Plot No. ' + d.plotNumber + ' in Sy. No. ' + d.surveyNumber + ' measuring ' + d.totalExtentSqYds + ' Sq. Yards located at ' + plotLocation + '.'}
            </p>
            <p>
              {isTe
                ? 'మొత్తం ప్రతిఫలము రూ. ' + d.totalAmount + '/- లుగా నిర్ణయించగా, కొనుగోలుదారు అడ్వాన్స్ బైనాగా రూ. ' + d.advancePaid + '/- లు చెల్లించినారు. మిగిలిన బకాయి రిజిస్ట్రేషన్ సమయంలో చెల్లించవలెను.'
                : 'Total sale price agreed is Rs. ' + d.totalAmount + '/- against which an advance of Rs. ' + d.advancePaid + '/- is paid by the Purchaser.'}
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
