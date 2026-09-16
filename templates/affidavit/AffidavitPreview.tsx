import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './affidavit.module.css';

export const AffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.affidavit;
  const t = 'affidavit';

  const deponentName = formatTeluguValue(d.deponentName, language);
  const relativeName = formatTeluguValue(d.relativeName, language);
  const village = formatTeluguValue(d.village, language);
  const mandal = formatTeluguValue(d.mandal, language);
  const district = formatTeluguValue(d.district, language);
  const occupation = formatTeluguValue(d.occupation, language);
  const notaryPlace = formatTeluguValue(d.notaryPlace, language);

  return (
    <div className={styles['affidavit-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['affidavit-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['affidavit-title']}>
            {isTe ? 'ప్రమాణ పత్రము (అఫిడవిట్)' : 'AFFIDAVIT'}
          </h1>

          {isTe ? (
            <p className={styles['affidavit-paragraph']}>
              నేను, <span className="font-bold uppercase">{deponentName}</span>, {d.relation === 'S/o' ? 'తండ్రి' : d.relation === 'W/o' ? 'భర్త' : 'తండ్రి'}: <span className="font-bold uppercase">{relativeName}</span>, వయస్సు సుమారు <span className="font-medium">{d.age}</span> సంవత్సరములు, వృత్తి: <span className="font-medium uppercase">{occupation}</span>, నివాసం ఇంటి నెం. <span className="font-medium">{d.hNo}</span>, <span className="font-bold uppercase">{village}</span> గ్రామము, <span className="font-bold uppercase">{mandal}</span> మండలము, <span className="font-medium">{district}</span> జిల్లా, తెలంగాణ, ఆధార్ కార్డు నెం. <span className="font-bold">{d.aadharNumber}</span>, ఇందుమూలముగా దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-
            </p>
          ) : (
            <p className={styles['affidavit-paragraph']}>
              I, <EditableField template={t} fieldPath="deponentName" value={d.deponentName} className="font-bold uppercase" />,{' '}
              <EditableField template={t} fieldPath="relation" value={d.relation} />{' '}
              <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />, aged about{' '}
              <EditableField template={t} fieldPath="age" value={d.age} className="font-medium" /> Years, OCCU:{' '}
              <EditableField template={t} fieldPath="occupation" value={d.occupation} className="font-medium uppercase" />, Resident of H.No.{' '}
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
                1. నేను ఈ ప్రమాణ పత్రము చేయు ప్రమాణకర్తను మరియు పైన తెలిపిన చిరునామాలో స్థిర నివాసము కలిగియున్న వాస్తవ్యుడను అని తెలియజేయుచున్నాను.
              </p>
              <p>
                2. నా పేరు, పుట్టిన తేదీ మరియు సంబంధిత రికార్డుల ధృవీకరణ నిమిత్తము ఈ అఫిడవిట్‌ను సమర్పించుచున్నాను.
              </p>
              <p>
                3. పైన పేర్కొన్న అంశములన్నియు నా స్వంత జ్ఞానము మరియు నమ్మకము మేరకు సంపూర్ణ సత్యమైనవని, ఎటువంటి సమాచారము దాచబడలేదని ప్రమాణపూర్వకముగా ధృవీకరించుచున్నాను.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                1. I state that I am the deponent herein and a permanent resident of the above mentioned address.
              </p>
              <p>
                2. I state that I am submitting this sworn affidavit for the legal declaration and verification of my identity, name, and address.
              </p>
              <p>
                3. That the contents of this affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <div className="text-right pr-6 mb-10">
            <span className="font-bold tracking-wider">{isTe ? 'ప్రమాణకర్త (DEPONENT)' : 'DEPONENT'}</span>
          </div>

          <div className="border-t border-gray-300 pt-4 flex justify-between items-start">
            <div>
              <p className="font-bold mb-1">{isTe ? 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది' : 'Sworn and signed before me'}</p>
              <p className="text-[10pt]">
                {isTe ? 'తేదీ: ' : 'On '}
                <EditableField template={t} fieldPath="notaryDate" value={d.notaryDate} className="font-bold" />
                {isTe ? ' వద్ద: ' : ' at '}
                <span className="font-bold uppercase">{notaryPlace}</span>
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
