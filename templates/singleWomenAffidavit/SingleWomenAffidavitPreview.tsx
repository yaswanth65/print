import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './singleWomenAffidavit.module.css';

export const SingleWomenAffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.single_women_affidavit;
  const t = 'single_women_affidavit';

  const deponentName = formatTeluguValue(d.deponentName, language);
  const husbandName = formatTeluguValue(d.husbandName, language);
  const fatherName = formatTeluguValue(d.fatherName, language);
  const village = formatTeluguValue(d.village, language);
  const mandal = formatTeluguValue(d.mandal, language);
  const district = formatTeluguValue(d.district, language);
  const occupation = formatTeluguValue(d.occupation, language);
  const swearingPlace = formatTeluguValue(d.swearingPlace, language);

  return (
    <div className={styles['single-women-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['single-women-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['single-women-title']}>
            {isTe ? 'డిక్లరేషన్ ప్రమాణ పత్రము' : 'AFFIDAVIT FOR DECLARATION OF'}<br />
            <span className={styles['single-women-subtitle']}>
              {isTe ? '“ఒంటరి మహిళ / SINGLE WOMEN”' : '“ONTARI MAHILA / SINGLE WOMEN”'}
            </span>
          </h1>

          {isTe ? (
            <p className={styles['single-women-paragraph']}>
              నేను, <span className="font-bold uppercase">{deponentName}</span>, భర్త: <span className="font-bold uppercase">{husbandName}</span>, తండ్రి: <span className="font-bold uppercase">{fatherName}</span>, వయస్సు: సుమారు <span className="font-medium">{d.age}</span> సంవత్సరములు, వృత్తి: <span className="font-medium uppercase">{occupation}</span>, నివాసం ఇంటి నెం. <span className="font-medium">{d.hNo}</span>, <span className="font-bold uppercase">{village}</span> గ్రామము, <span className="font-bold uppercase">{mandal}</span> మండలము, <span className="font-medium">{district}</span> జిల్లా, తెలంగాణ రాష్ట్రము, ఆధార్ నెం. <span className="font-bold">{d.aadharNumber}</span>, ఇందుమూలముగా దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-
            </p>
          ) : (
            <p className={styles['single-women-paragraph']}>
              I, <EditableField template={t} fieldPath="deponentName" value={d.deponentName} className="font-bold uppercase" />,{' '}
              W/o <EditableField template={t} fieldPath="husbandName" value={d.husbandName} className="font-bold uppercase" />,{' '}
              D/o <EditableField template={t} fieldPath="fatherName" value={d.fatherName} className="font-bold uppercase" />, aged about{' '}
              <EditableField template={t} fieldPath="age" value={d.age} className="font-medium" /> Years, OCCU:{' '}
              <EditableField template={t} fieldPath="occupation" value={d.occupation} className="font-medium uppercase" />, Resident of H.No.{' '}
              <EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-medium" />,{' '}
              <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" /> Village,{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" /> Mandal,{' '}
              <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" /> District, Telangana State, Aadhar No.{' '}
              <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold" />, do hereby solemnly affirm and state on oath as under:-
            </p>
          )}

          {isTe ? (
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                1. నేను ఈ ప్రమాణ పత్రము చేయు దరఖాస్తుదారురాలను మరియు ఒంటరి మహిళను అని సత్యనిష్ఠతో తెలియజేయుచున్నాను.
              </p>
              <p>
                2. నా భర్త అయిన <span className="font-bold uppercase">{husbandName}</span> నన్ను విడిచిపెట్టి సుమారు <span className="font-bold">{d.separatedYears}</span> సంవత్సరములు గడచినవి. అప్పటి నుండి నేను నా స్వశక్తితో ఒంటరిగా జీవించుచున్నాను.
              </p>
              <p>
                3. నాకు ప్రభుత్వం నుండి ఎటువంటి పింఛను లేదా ఇతర నెలవారీ భృతి అందడం లేదు మరియు జీవనాధారము కొరకు ఒంటరి మహిళ పింఛను పథకము కొరకు దరఖాస్తు చేసుకొనుచున్నాను.
              </p>
              <p>
                4. ఈ అఫిడవిట్ నందు పేర్కొన్న అంశములన్నియు నా పూర్తి వ్యక్తిగత జ్ఞానము మరియు నమ్మకము మేరకు సత్యమైనవని ధృవీకరించుచున్నాను.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                1. I state that I am the deponent herein and a resident of above said address living as a single woman.
              </p>
              <p>
                2. I state that my husband <EditableField template={t} fieldPath="husbandName" value={d.husbandName} className="font-bold uppercase" /> separated from me around <EditableField template={t} fieldPath="separatedYears" value={d.separatedYears} className="font-bold" /> years ago and since then I am living independently without any support.
              </p>
              <p>
                3. I state that I do not possess any government job or pension and I am submitting this affidavit for the purpose of Ontari Mahila (Single Women) Pension Scheme.
              </p>
              <p>
                4. That the above facts stated are true and correct to the best of my knowledge and belief.
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
              <p className="text-[9pt] text-gray-600">{isTe ? 'దరఖాస్తుదారురాలు / సంతకము' : 'Applicant / Deponent'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
