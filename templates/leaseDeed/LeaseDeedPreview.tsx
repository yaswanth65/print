import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './leaseDeed.module.css';

export const LeaseDeedPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.lease_deed;
  const t = 'lease_deed';

  const lessorName = formatTeluguValue(d.lessorName, language);
  const lesseeName = formatTeluguValue(d.lesseeName, language);
  const propertyAddress = formatTeluguValue(d.propertyAddress, language);

  return (
    <div className={styles['lease-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['lease-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['lease-title']}>
            {isTe ? 'వాణిజ్య లీజు ఒప్పంద దస్తావేజు' : 'COMMERCIAL LEASE DEED'}
          </h1>

          <p className={styles['lease-intro']}>
            {isTe ? (
              <>
                ఈ వాణిజ్య లీజు దస్తావేజు తేదీ: <EditableField template={t} fieldPath="deedDate" value={d.deedDate} className="font-bold" /> నాడు, మొదటి పక్షమైన యజమాని <span className="font-bold uppercase">{lessorName}</span> మరియు రెండవ పక్షమైన లీజుదారు <span className="font-bold uppercase">{lesseeName}</span> ల మధ్య కుదుర్చుకోబడినది.
              </>
            ) : (
              <>
                This Commercial Lease Deed is made and executed on <EditableField template={t} fieldPath="deedDate" value={d.deedDate} className="font-bold" /> by and between{' '}
                <EditableField template={t} fieldPath="lessorName" value={d.lessorName} className="font-bold uppercase" /> (LESSOR) and{' '}
                <EditableField template={t} fieldPath="lesseeName" value={d.lesseeName} className="font-bold uppercase" /> (LESSEE).
              </>
            )}
          </p>

          <p className="mb-4 text-justify font-medium">
            {isTe ? 'లీజు ఆస్తి / షాపు చిరునామా: ' : 'Commercial Premises: '}
            <span className="font-bold uppercase">{propertyAddress}</span>.
          </p>

          <div className="space-y-3 text-justify leading-relaxed">
            <h3 className="font-bold text-sm uppercase underline">{isTe ? 'లీజు నిబంధనలు:' : 'TERMS & CONDITIONS:'}</h3>
            <p>
              {isTe
                ? '1. ఈ వాణిజ్య లీజు మొత్తం ' + d.leasePeriodYears + ' సంవత్సరముల కాలపరిమితికి ఇవ్వబడినది.'
                : '1. The commercial premises are leased for an initial term of ' + d.leasePeriodYears + ' years.'}
            </p>
            <p>
              {isTe
                ? '2. నెలవారీ లీజు అద్దె రూ. ' + d.monthlyRent + '/- లుగా నిర్ణయించడమైనది.'
                : '2. The monthly lease rent is fixed at Rs. ' + d.monthlyRent + '/- payable in advance.'}
            </p>
            <p>
              {isTe
                ? '3. లీజుదారు అడ్వాన్స్ డిపాజిట్‌గా రూ. ' + d.advanceDeposit + '/- లను లెస్సర్‌కు చెల్లించినారు.'
                : '3. The Lessee has deposited a sum of Rs. ' + d.advanceDeposit + '/- as security advance.'}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-300 grid grid-cols-2 gap-8">
          <div>
            <p className="font-bold uppercase">{lessorName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'లెస్సర్ / యజమాని సంతకము' : 'LESSOR (OWNER)'}</p>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase">{lesseeName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'లెస్సీ / లీజుదారు సంతకము' : 'LESSEE (TENANT)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
