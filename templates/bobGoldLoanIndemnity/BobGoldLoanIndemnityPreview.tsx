import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './bobGoldLoanIndemnity.module.css';

export const BobGoldLoanIndemnityPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.bob_gold_loan_indemnity;
  const t = 'bob_gold_loan_indemnity';

  const branchName = formatTeluguValue(d.branchName, language);
  const borrowerName = formatTeluguValue(d.borrowerName, language);
  const relativeName = formatTeluguValue(d.relativeName, language);
  const address = formatTeluguValue(d.address, language);

  return (
    <div className={styles['bob-container']}>
      <div className="document-paper">
        <div className="text-center font-bold text-xs uppercase tracking-wider mb-2 text-gray-600">
          APPENDIX - IV
        </div>
        <h1 className={styles['bob-title']}>
          {isTe ? 'నష్టపరిహార హామీ పత్రము (ఇండెమ్నిటీ లెటర్)' : 'LETTER OF INDEMNITY'}
        </h1>
        <p className="text-center text-[10pt] font-semibold text-gray-700 mb-6">
          {isTe
            ? '(బంగారు రుణ మదింపు పత్రము / అప్రైజల్ షీట్ పోయిన సందర్భములో సమర్పించునది)'
            : '(In respect of issue of duplicate token / Appraisal form / receipt)'}
        </p>

        <div className="mb-6 space-y-1 text-[10.5pt]">
          <p className="font-bold">{isTe ? 'స్వీకర్త:' : 'To,'}</p>
          <p className="font-bold">{isTe ? 'శాఖా మేనేజర్ గారు,' : 'The Branch Manager,'}</p>
          <p className="font-semibold">{isTe ? 'బ్యాంక్ ఆఫ్ బరోడా,' : 'Bank of Baroda,'}</p>
          <p><span className="font-bold uppercase">{branchName}</span> {isTe ? 'బ్రాంచ్' : 'Branch.'}</p>
        </div>

        <div className="mb-4 text-[10.5pt]">
          <p className="font-semibold">
            {isTe ? 'విషయము:' : 'Dear Sir,'}
          </p>
          <p className="font-medium text-justify mt-1">
            {isTe
              ? 'బంగారు రుణ ఖాతా నెం. ' + d.loanAccountNumber + ' కు సంబంధించిన గోల్డ్ లోన్ అప్రైజల్ షీట్ (రుణగ్రహీత కాపీ) పోయినందున డూప్లికేట్ జారీ మరియు నగలు విడుదల కొరకు నష్టపరిహార పత్రము.'
              : 'Sub: Loss of Token / Gold Loan Appraisal Form / Receipt in respect of Gold Loan Account No: ' + d.loanAccountNumber}
          </p>
        </div>

        {isTe ? (
          <div className="space-y-4 text-justify text-[10.5pt] leading-relaxed">
            <p>
              నేను, <span className="font-bold uppercase">{borrowerName}</span>, తండ్రి/భర్త: <span className="font-bold uppercase">{relativeName}</span>, నివాసం: <span className="font-bold uppercase">{address}</span>, మీ బ్రాంచ్‌లో బంగారు రుణ ఖాతా నెం. <span className="font-bold">{d.loanAccountNumber}</span> ద్వారా తేదీ <span className="font-bold">{d.sanctionDate}</span> నాడు మొత్తం రూ. <span className="font-bold">{d.loanAmount}</span> రుణం పొందియున్నాను.
            </p>
            <p>
              సదరు బంగారు రుణానికి హామీగా నేను మీ బ్యాంకులో <span className="font-bold">{d.ornamentsDescription}</span> (మొత్తం బరువు <span className="font-bold">{d.grossWeight}</span> గ్రాములు) డిపాజిట్ చేసి ఉన్నాను.
            </p>
            <p>
              రుణ మంజూరు సమయంలో బ్యాంకు వారు నాకు అందించిన గోల్డ్ లోన్ అప్రైజల్ షీట్ / రసీదు ప్రమాదవశాత్తూ పోయినదని, ఎంత వెతికినప్పటికీ లభించలేదని ఇందుమూలముగా తెలియజేయుచున్నాను.
            </p>
            <p>
              నేను సదరు బంగారు రుణాన్ని పూర్తిగా చెల్లించి నా బంగారు ఆభరణాలను తిరిగి తీసుకుంటున్న సందర్భంగా, బ్యాంకు వారికి ఎటువంటి ఆర్థిక లేదా చట్టపరమైన నష్టం కలగకుండా నన్ను సంపూర్ణ బాధ్యుడిగా చేస్తూ ఈ నష్టపరిహార హామీ పత్రము (Letter of Indemnity) ను వ్రాసి ఇచ్చుచున్నాను.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-justify text-[10.5pt] leading-relaxed">
            <p>
              I, <EditableField template={t} fieldPath="borrowerName" value={d.borrowerName} className="font-bold uppercase" />,{' '}
              <EditableField template={t} fieldPath="relation" value={d.relation} />{' '}
              <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />,{' '}
              residing at <EditableField template={t} fieldPath="address" value={d.address} className="font-bold uppercase" />, have availed a Gold Loan of Rs.{' '}
              <EditableField template={t} fieldPath="loanAmount" value={d.loanAmount} className="font-bold" /> under Loan Account No.{' '}
              <EditableField template={t} fieldPath="loanAccountNumber" value={d.loanAccountNumber} className="font-bold" /> dated{' '}
              <EditableField template={t} fieldPath="sanctionDate" value={d.sanctionDate} className="font-bold" /> from your branch against pledge of gold ornaments described as{' '}
              <EditableField template={t} fieldPath="ornamentsDescription" value={d.ornamentsDescription} className="font-bold" /> weighing{' '}
              <EditableField template={t} fieldPath="grossWeight" value={d.grossWeight} className="font-bold" /> grams.
            </p>
            <p>
              I state that the original Appraisal Form / Token / Receipt issued to me at the time of pledge has been lost / misplaced by me and cannot be found despite diligent search.
            </p>
            <p>
              In consideration of the Bank agreeing to release the pledged ornaments to me without production of original appraisal form, I hereby agree to indemnify and keep indemnified the Bank against all claims, actions, losses, damages, costs and expenses whatsoever that the Bank may incur by reason of releasing the pledged gold.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-300 grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10pt] font-semibold">{isTe ? 'తేదీ:' : 'Date:'} <EditableField template={t} fieldPath="letterDate" value={d.letterDate} className="font-bold" /></p>
            <p className="text-[10pt] font-semibold">{isTe ? 'స్థలము:' : 'Place:'} <span className="font-bold uppercase">{branchName}</span></p>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase">{borrowerName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'రుణగ్రహీత సంతకము' : 'Signature of Borrower'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
