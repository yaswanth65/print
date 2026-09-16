import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './sscMemoAffidavit.module.css';

export const SscMemoAffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.ssc_memo_affidavit;
  const t = 'ssc_memo_affidavit';

  const deponentName = formatTeluguValue(d.deponentName, language);
  const fatherName = formatTeluguValue(d.fatherName, language);
  const village = formatTeluguValue(d.village, language);
  const mandal = formatTeluguValue(d.mandal, language);
  const district = formatTeluguValue(d.district, language);
  const schoolName = formatTeluguValue(d.schoolName, language);
  const swearingPlace = formatTeluguValue(d.swearingPlace, language);

  return (
    <div className={styles['ssc-memo-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['ssc-memo-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['ssc-memo-title']}>
            {isTe ? 'ఎస్.ఎస్.సి మార్కుల మెమో పోయినందుకు ప్రమాణ పత్రము (అఫిడవిట్)' : 'AFFIDAVIT (FOR LOSS OF SSC MEMO)'}
          </h1>

          {isTe ? (
            <p className={styles['ssc-memo-paragraph']}>
              నేను, <span className="font-bold uppercase">{deponentName}</span>, తండ్రి: <span className="font-bold uppercase">{fatherName}</span>, వయస్సు సుమారు <span className="font-medium">{d.age}</span> సంవత్సరములు, నివాసం ఇంటి నెం. <span className="font-medium">{d.hNo}</span>, <span className="font-bold uppercase">{village}</span> గ్రామము, <span className="font-bold uppercase">{mandal}</span> మండలము, <span className="font-medium">{district}</span> జిల్లా, తెలంగాణ, ఆధార్ నెం. <span className="font-bold">{d.aadharNumber}</span>, ఇందుమూలముగా దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-
            </p>
          ) : (
            <p className={styles['ssc-memo-paragraph']}>
              I, <EditableField template={t} fieldPath="deponentName" value={d.deponentName} className="font-bold uppercase" />,{' '}
              S/o <EditableField template={t} fieldPath="fatherName" value={d.fatherName} className="font-bold uppercase" />, aged about{' '}
              <EditableField template={t} fieldPath="age" value={d.age} className="font-medium" /> Years, Resident of H.No.{' '}
              <EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-medium" />,{' '}
              <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" /> Village,{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" /> Mandal,{' '}
              <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" /> District, Telangana, Aadhar No.{' '}
              <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold" />, do hereby solemnly affirm and state on oath as under:-
            </p>
          )}

          {isTe ? (
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                1. నేను ఈ ప్రమాణ పత్రము చేయు ప్రమాణకర్తను అని సత్యనిష్ఠతో తెలియజేయుచున్నాను.
              </p>
              <p>
                2. నేను <span className="font-bold uppercase">{schoolName}</span> పాఠశాలలో చదివి, <span className="font-bold">{d.hallTicketNumber}</span> హాల్ టికెట్ నెంబరుతో <span className="font-bold">{d.yearOfPassing}</span> సంవత్సరములో పదవ తరగతి (SSC) ఉత్తీర్ణత సాధించినాను.
              </p>
              <p>
                3. నా అసలు SSC మార్కుల మెమో ప్రమాదవశాత్తూ పోయినదని, ఎంత వెతికిననూ లభించలేదని తెలియజేయుచున్నాను. దీనిపై డూప్లికేట్ మార్కుల మెమో కొరకు సంబంధిత విద్యాశాఖ అధికారులకు దరఖాస్తు చేయుచున్నాను.
              </p>
              <p>
                4. భవిష్యత్తులో నా అసలు మెమో లభించినచో దానిని ప్రభుత్వ విద్యాశాఖకు వెంటనే అప్పగిస్తానని మరియు ఎలాంటి దుర్వినియోగం చేయబోనని ప్రమాణము చేయుచున్నాను.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                1. I state that I am the deponent herein and permanent resident of above mentioned address.
              </p>
              <p>
                2. I passed my Secondary School Certificate (SSC) examination in the year <EditableField template={t} fieldPath="yearOfPassing" value={d.yearOfPassing} className="font-bold" /> with Hall Ticket No. <EditableField template={t} fieldPath="hallTicketNumber" value={d.hallTicketNumber} className="font-bold" /> from <EditableField template={t} fieldPath="schoolName" value={d.schoolName} className="font-bold uppercase" />.
              </p>
              <p>
                3. I state that my original SSC Marks Memo was inadvertently lost/misplaced and despite best efforts could not be traced. I am submitting this affidavit to obtain a duplicate marks memo.
              </p>
              <p>
                4. If the original marks memo is found in future, I undertake to surrender it immediately to the board authorities.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="text-right pr-6 mb-10">
            <span className="font-bold tracking-wider">{isTe ? 'ప్రమాణకర్త (DEPONENT)' : 'DEPONENT'}</span>
          </div>

          <div className="border-t border-gray-300 pt-4 flex justify-between items-start">
            <div>
              <p className="font-bold mb-1">{isTe ? 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది' : 'Sworn and signed before me'}</p>
              <p className="text-[10pt]">
                {isTe ? 'తేదీ: ' : 'On '}
                <EditableField template={t} fieldPath="swearingDate" value={d.swearingDate} className="font-bold" />
                {isTe ? ' వద్ద: ' : ' at '}
                <span className="font-bold uppercase">{swearingPlace}</span>
              </p>
              <div className="mt-8 border-t border-gray-400 w-48 pt-1 text-center text-xs font-bold uppercase text-gray-600">
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
    </div>
  );
};
