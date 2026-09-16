import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './panInstantSignatureAffidavit.module.css';

export const PanInstantSignatureAffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.pan_instant_signature_affidavit;
  const t = 'pan_instant_signature_affidavit';

  const deponentName = formatTeluguValue(d.deponentName, language);
  const relativeName = formatTeluguValue(d.relativeName, language);
  const address = formatTeluguValue(d.address, language);
  const bankName = formatTeluguValue(d.bankName, language);
  const branchName = formatTeluguValue(d.branchName, language);
  const declarationPlace = formatTeluguValue(d.declarationPlace, language);

  return (
    <div className={styles['pan-container']}>
      <div className="document-paper">
        

        <h1 className={styles['pan-title']}>
          {isTe
            ? 'ఇన్‌స్టంట్ పాన్ కార్డు సంతకము ధృవీకరణ ప్రమాణ పత్రము (అఫిడవిట్)'
            : 'AFFIDAVIT-CUM-DECLARATION FOR INSTANT E-PAN CARD SIGNATURE VERIFICATION'}
        </h1>

        <div className="mb-4 text-[10pt] font-semibold text-gray-700">
          {isTe ? 'సమక్షములో: మేనేజర్ గారు,' : 'Before: The Branch Manager,'} <span className="font-bold uppercase">{bankName}</span>, <span className="font-bold uppercase">{branchName}</span>.
        </div>

        {isTe ? (
          <p className={styles['pan-paragraph']}>
            నేను, <span className="font-bold uppercase">{deponentName}</span>, {d.relation === 'S/o' ? 'తండ్రి' : 'భర్త'}: <span className="font-bold uppercase">{relativeName}</span>, వయస్సు సుమారు <span className="font-medium">{d.age}</span> సంవత్సరములు, నివాసం: <span className="font-bold uppercase">{address}</span>, పాన్ కార్డు నెం. <span className="font-bold">{d.panNumber}</span> మరియు ఆధార్ కార్డు నెం. <span className="font-bold">{d.aadharNumber}</span>, ఇందుమూలముగా దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-
          </p>
        ) : (
          <p className={styles['pan-paragraph']}>
            I, <EditableField template={t} fieldPath="deponentName" value={d.deponentName} className="font-bold uppercase" />,{' '}
            <EditableField template={t} fieldPath="relation" value={d.relation} />{' '}
            <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />, aged about{' '}
            <EditableField template={t} fieldPath="age" value={d.age} className="font-medium" /> Years, residing at{' '}
            <EditableField template={t} fieldPath="address" value={d.address} className="font-bold uppercase" />, holding PAN No.{' '}
            <EditableField template={t} fieldPath="panNumber" value={d.panNumber} className="font-bold" /> and Aadhar No.{' '}
            <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold" />, do hereby solemnly affirm and state on oath as under:-
          </p>
        )}

        {isTe ? (
          <div className="space-y-4 text-justify text-[10.5pt] leading-relaxed">
            <p>
              1. నేను ఆదాయపు పన్ను శాఖ (Income Tax Dept) నుండి ఆధార్ ఈ-కేవైసీ ద్వారా ఇన్‌స్టంట్ ఈ-పాన్ కార్డు (Instant e-PAN) పొందియున్నాను. సదరు కార్డు నందు భౌతిక సంతకం లేకుండా డిజిటల్ ధృవీకరణ మాత్రమే కలిగియున్నది.
            </p>
            <p>
              2. రుణ దరఖాస్తు నెం. <span className="font-bold">{d.loanApplicationNumber}</span> నందు నా సంతకము సరిపోల్చడం కొరకు మరియు గుర్తింపు ధృవీకరణ కొరకు ఈ అఫిడవిట్ సమర్పించుచున్నాను.
            </p>
            <p>
              3. నేను ఈ పత్రముపై చేసే సంతకమే నా అధికారిక సంతకమని మరియు భవిష్యత్తులో అన్ని బ్యాంకు వ్యవహారములలో దీనినే ఉపయోగిస్తానని తెలియజేయుచున్నాను.
            </p>
            <p>
              4. ఈ అఫిడవిట్‌లోని అంశములన్నియు నా స్వంత జ్ఞానము మేరకు సంపూర్ణ సత్యమైనవని ధృవీకరించుచున్నాను.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-justify text-[10.5pt] leading-relaxed">
            <p>
              1. I state that I obtained my PAN Card No. <EditableField template={t} fieldPath="panNumber" value={d.panNumber} className="font-bold" /> through online Instant e-PAN facility based on Aadhaar e-KYC, wherein a physical signature is not printed on the face of the card.
            </p>
            <p>
              2. In connection with my Loan Application No. <EditableField template={t} fieldPath="loanApplicationNumber" value={d.loanApplicationNumber} className="font-bold" />, I hereby declare and confirm that the signature affixed below is my genuine and sole legal signature.
            </p>
            <p>
              3. I undertake to indemnify and hold harmless the bank against any claims or issues arising out of the verification of my signature and identity.
            </p>
            <p>
              4. That all statements made above are true and correct to the best of my knowledge and belief.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-300 flex justify-between items-start">
          <div>
            <p className="text-[10pt] font-semibold">{isTe ? 'తేదీ:' : 'Date:'} <EditableField template={t} fieldPath="declarationDate" value={d.declarationDate} className="font-bold" /></p>
            <p className="text-[10pt] font-semibold">{isTe ? 'స్థలము:' : 'Place:'} <span className="font-bold uppercase">{declarationPlace}</span></p>
            <div className="mt-8 border-t border-gray-400 w-44 pt-1 text-center text-xs font-bold uppercase text-gray-600">
              {isTe ? 'న్యాయవాది / నోటరీ' : 'Advocate / Notary'}
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase">{deponentName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'ప్రమాణకర్త సంతకము' : 'Signature of Deponent'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
