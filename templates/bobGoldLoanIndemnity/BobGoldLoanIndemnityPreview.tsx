import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './bobGoldLoanIndemnity.module.css';

export const BobGoldLoanIndemnityPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const d = data.bob_gold_loan_indemnity || {};
  const t = 'bob_gold_loan_indemnity';
  const isTe = language === 'te';

  return (
    <div className={styles['bob-container']}>
      <div className="document-paper">
        {/* APPENDIX HEADER */}
        <div className={styles['bob-appendix']}>
          {isTe ? 'అనుబంధం IV (APPENDIX IV)' : 'APPENDIX IV'}
        </div>

        {/* TITLE */}
        <h1 className={styles['bob-title']}>
          {isTe ? 'నష్టపరిహార హామీ పత్రము (INDEMNITY LETTER)' : 'INDEMNITY LETTER'}
        </h1>
        <div className={styles['bob-subtitle']}>
          {isTe
            ? '(బంగారు ఋణ అప్రైజల్ షీట్ దరఖాస్తుదారుని కాపీ పోయిన సందర్భంలో సమర్పించునది)'
            : '(In respect of lost / misplaced Gold Loan Appraisal Sheet Borrower Copy)'}
        </div>

        {/* RECIPIENT */}
        <div className={styles['bob-recipient']}>
          <div>{isTe ? 'స్వీకర్త / To,' : 'To,'}</div>
          <div className="font-bold">
            <EditableField template={t} fieldPath="bankName" value={d.bankName || 'Bank of Baroda'} />
          </div>
          <div>
            <EditableField template={t} fieldPath="branchName" value={d.branchName || 'Armoor Branch'} />
          </div>
          <div>
            <EditableField template={t} fieldPath="district" value={d.district || 'Dist. Nizamabad'} />
          </div>
        </div>

        {/* PARAGRAPH 1 */}
        <p className={styles['bob-paragraph']}>
          {isTe ? (
            <>
              బ్యాంక్ ఆఫ్ బరోడా <EditableField template={t} fieldPath="branchName" value={d.branchName || 'ARMOOR'} className="font-bold uppercase" /> శాఖ ద్వారా తేదీ{' '}
              <EditableField template={t} fieldPath="sanctionDate" value={d.sanctionDate || '12-05-2024'} className="font-bold" /> న మంజూరు చేయబడిన బంగారు ఋణం ఖాతా సంఖ్య{' '}
              <EditableField template={t} fieldPath="accountNo" value={d.accountNo || '12340100098765'} className="font-bold" /> మొత్తం రూ.{' '}
              <EditableField template={t} fieldPath="loanAmount" value={d.loanAmount || '1,50,000'} className="font-bold" />/- (రూపాయలు{' '}
              <EditableField template={t} fieldPath="loanAmountWords" value={d.loanAmountWords || 'One Lakh Fifty Thousand'} className="font-bold" /> మాత్రమే) ఋణము పొందిన నా పేరిట{' '}
              <EditableField template={t} fieldPath="borrowerName" value={d.borrowerName || 'CHINTHA RAMESH'} className="font-bold uppercase" />, తండ్రి{' '}
              <EditableField template={t} fieldPath="fatherName" value={d.fatherName || 'CHINTHA SAYANNA'} className="font-bold uppercase" />, నివాసం{' '}
              <EditableField template={t} fieldPath="village" value={d.village || 'Govindpet'} className="font-bold uppercase" /> గ్రామము,{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal || 'Armoor'} className="font-bold uppercase" /> మండలము, జిల్లా నిజామాబాద్, తెలంగాణ లో{' '}
              <EditableField template={t} fieldPath="durationMonths" value={d.durationMonths || '12'} className="font-bold" /> నెలల కాలపరిమితికి ఇవ్వబడినది.
            </>
          ) : (
            <>
              Whereas Bank of Baroda <EditableField template={t} fieldPath="branchName" value={d.branchName || 'ARMOOR'} className="font-bold uppercase" /> branch on{' '}
              <EditableField template={t} fieldPath="sanctionDate" value={d.sanctionDate || '12-05-2024'} className="font-bold" /> sanctioned a gold loan bearing A/c No.{' '}
              <EditableField template={t} fieldPath="accountNo" value={d.accountNo || '12340100098765'} className="font-bold" /> for Rs.{' '}
              <EditableField template={t} fieldPath="loanAmount" value={d.loanAmount || '1,50,000'} className="font-bold" /> (Rupees{' '}
              <EditableField template={t} fieldPath="loanAmountWords" value={d.loanAmountWords || 'One Lakh Fifty Thousand'} className="font-bold" /> only) to me{' '}
              <EditableField template={t} fieldPath="borrowerName" value={d.borrowerName || 'CHINTHA RAMESH'} className="font-bold uppercase" /> S/o.{' '}
              <EditableField template={t} fieldPath="fatherName" value={d.fatherName || 'CHINTHA SAYANNA'} className="font-bold uppercase" /> R/o.{' '}
              <EditableField template={t} fieldPath="village" value={d.village || 'Govindpet'} className="font-bold uppercase" /> village,{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal || 'Armoor'} className="font-bold uppercase" /> Mandal, Dist.Nizamabad, Telangana for{' '}
              <EditableField template={t} fieldPath="durationMonths" value={d.durationMonths || '12'} className="font-bold" /> months.
            </>
          )}
        </p>

        {/* PARAGRAPH 2 */}
        <p className={styles['bob-paragraph']}>
          {isTe ? (
            <>
              సదరు బంగారు ఋణ అప్రైజల్ షీట్ రశీదు నా వద్ద ప్రమాదవశాత్తు పోయినది / కనిపించకుండా పోయినది. సదరు రశీదు ఎవరికీ దుర్వినియోగం చేయబడలేదని మరియు ఎటువంటి ఇతర లావాదేవీలకు ఉపయోగించలేదని నా ద్వారా హామీ ఇవ్వడమైనది. ఒకవేళ భవిష్యత్తులో సదరు గోల్డ్ లోన్ అప్రైజల్ షీట్ దొరికినచో తక్షణమే బ్యాంకుకు తిరిగి అప్పగించబడుతుందని హామీ ఇస్తున్నాను.
            </>
          ) : (
            <>
              And whereas the said Gold Loan Appraisal Sheet has been lost or misplaced and whereas upon my/our representation that the said Gold Loan Appraisal Sheet Receipt has been lost/misplaced and has not been misutilised or dealt with in any manner and undertaking that if the said Gold Loan Appraisal Sheet is found, it shall be returned to you.
            </>
          )}
        </p>

        {/* PARAGRAPH 3 */}
        <p className={styles['bob-paragraph']}>
          {isTe ? (
            <>
              ఇప్పుడు నేను / మేము <span className="font-bold uppercase"><EditableField template={t} fieldPath="borrowerName" value={d.borrowerName || 'CHINTHA RAMESH'} /></span>, నా/మా మరియు నా/మా వారసులు, చట్టబద్ధమైన ప్రతినిధుల తరపున బ్యాంకు వారికి ఎటువంటి నష్టములు, క్లెయిములు, డిమాండ్లు, చట్టపరమైన చర్యలు లేదా ఖర్చులు అసలు గోల్డ్ లోన్ అప్రైజల్ షీట్ సమర్పించనందున కలగకుండా ఎల్లప్పుడూ బ్యాంకును నష్టపరిహార రహితులుగా (Indemnified) ఉంచుతామని ఇందుమూలముగా పూర్తి బాధ్యతతో అంగీకరిస్తున్నాము.
            </>
          ) : (
            <>
              Now, I/we <span className="font-bold uppercase"><EditableField template={t} fieldPath="borrowerName" value={d.borrowerName || 'CHINTHA RAMESH'} /></span>, S/o <EditableField template={t} fieldPath="fatherName" value={d.fatherName || 'CHINTHA SAYANNA'} className="font-bold uppercase" /> in consideration of the premises for myself/ourselves and my/our respective heirs, executors and administrators jointly and severally agree and undertake from time to time and at all times hereafter to indemnify and keep you indemnified from and against all losses, claims, demands, actions, liabilities and expenses which may be made or taken against or incurred by you by reason of the non-submission of the original Gold Loan Appraisal Sheet.
            </>
          )}
        </p>

        {/* DATED LINE */}
        <div className={styles['bob-dated']}>
          {isTe ? (
            <>
              తేదీ: ఆర్మూర్ నందు ఈ <EditableField template={t} fieldPath="datedDay" value={d.datedDay || '18'} className="font-bold" /> వ రోజు,{' '}
              <EditableField template={t} fieldPath="datedMonth" value={d.datedMonth || 'September'} className="font-bold" />,{' '}
              <EditableField template={t} fieldPath="datedYear" value={d.datedYear || '2026'} className="font-bold" />.
            </>
          ) : (
            <>
              Dated at Armoor this <EditableField template={t} fieldPath="datedDay" value={d.datedDay || '18'} className="font-bold" /> day of{' '}
              <EditableField template={t} fieldPath="datedMonth" value={d.datedMonth || 'September'} className="font-bold" />,{' '}
              <EditableField template={t} fieldPath="datedYear" value={d.datedYear || '2026'} className="font-bold" />.
            </>
          )}
        </div>

        {/* SIGNATURES AND WITNESSES */}
        <div className={styles['bob-closing-block']}>
          <div className={styles['bob-witness']}>
            <div className="font-bold">{isTe ? 'సాక్షులు (Witness):' : 'Witness:'}</div>
            <div><EditableField template={t} fieldPath="witness1" value={d.witness1 || '1. '} /></div>
            <div><EditableField template={t} fieldPath="witness2" value={d.witness2 || '2. '} /></div>
          </div>

          <div className={styles['bob-borrower-sign']}>
            <div className="mb-14">{isTe ? 'భవదీయుడు / Yours faithfully,' : 'Yours faithfully,'}</div>
            <div className="font-bold uppercase">
              <EditableField template={t} fieldPath="borrowerName" value={d.borrowerName || 'CHINTHA RAMESH'} />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {isTe ? 'ఋణగ్రహీత సంతకము / Signature(s) of Borrower(s)' : 'Signature(s) of Borrower(s)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
