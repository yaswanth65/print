import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './sbiAliasGeneral.module.css';

export const SbiAliasGeneralPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.sbi_alias_general;
  const t = 'sbi_alias_general';

  const assumedName = formatTeluguValue(d.assumedName, language);
  const previousName = formatTeluguValue(d.previousName, language);
  const relativeName = formatTeluguValue(d.relativeName, language);
  const relation = formatTeluguValue(d.relation, language);
  const village = formatTeluguValue(d.village, language);
  const mandal = formatTeluguValue(d.mandal, language);
  const district = formatTeluguValue(d.district, language);
  const occupation = formatTeluguValue(d.occupation, language);
  const bankName = formatTeluguValue(d.bankName, language);
  const branchName = formatTeluguValue(d.branchName, language);
  const declarationPlace = formatTeluguValue(d.declarationPlace, language);

  return (
    <div className={styles['sbi-alias-container']}>
      <div className="document-paper">
        <div>
          {/* Stamp space */}
          <div className="${styles['sbi-alias-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          {/* Heading */}
          <div className={styles['sbi-alias-recipient']}>
            {isTe ? (
              <>
                మేనేజర్ గారి సమక్షములో, <span className="font-bold uppercase">{bankName}</span> బ్రాంచ్: <span className="font-bold uppercase">{branchName}</span>
              </>
            ) : (
              <>
                BEFORE THE MANAGER, <EditableField template={t} fieldPath="bankName" value={d.bankName} className="font-bold uppercase" /> BRANCH: <EditableField template={t} fieldPath="branchName" value={d.branchName} className="font-bold uppercase" />
              </>
            )}
          </div>

          <h1 className={styles['sbi-alias-title']}>
            {isTe
              ? 'ఖాతాదారుని పేరు మార్పు / ఏలియాస్ పేరు మరియు గుర్తింపు ధృవీకరణ ప్రమాణ పత్రము (అఫిడవిట్)'
              : 'AFFIDAVIT Cum DECLARATION IN REGARD TO ALIAS NAME AND GENUINITY OF ACCOUNT HOLDER'}
          </h1>

          {isTe ? (
            <p className={styles['sbi-alias-paragraph']}>
              నేను, <span className="font-bold uppercase">{assumedName}</span>, <span className="font-bold uppercase">{relation}</span> <span className="font-bold uppercase">{relativeName}</span>, (ఆధార్ కార్డు ప్రకారం పేరు) <span className="font-bold uppercase">{previousName}</span>, <span className="font-bold uppercase">{relation}</span> <span className="font-bold uppercase">{relativeName}</span>, ({d.previousDocType} ప్రకారం పేరు) వయస్సు సుమారు <span className="font-medium">{d.age}</span> సంవత్సరములు, వృత్తి: <span className="font-medium uppercase">{occupation}</span>, నివాసం ఇంటి నెం. <span className="font-medium">{d.hNo}</span>, <span className="font-bold uppercase">{village}</span> గ్రామము, <span className="font-bold uppercase">{mandal}</span> మండలము, <span className="font-medium">{district}</span> జిల్లా, తెలంగాణ, పిన్ కోడ్ నెం. <span className="font-medium">{d.pincode}</span>, ఇందుమూలముగా దైవసాక్షిగా ప్రమాణం చేసి తెలియజేయునది ఏమనగా:-
            </p>
          ) : (
            <p className={styles['sbi-alias-paragraph']}>
              I, <EditableField template={t} fieldPath="assumedName" value={d.assumedName} className="font-bold uppercase" />,{' '}
              <EditableField template={t} fieldPath="relation" value={d.relation} className="font-bold uppercase" />{' '}
              <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />, (assumed name/ as per aadhar card){' '}
              <EditableField template={t} fieldPath="previousName" value={d.previousName} className="font-bold uppercase" />,{' '}
              <EditableField template={t} fieldPath="relation" value={d.relation} className="font-bold uppercase" />{' '}
              <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />, (Previous Name / As Per <EditableField template={t} fieldPath="previousDocType" value={d.previousDocType} />) aged about{' '}
              <EditableField template={t} fieldPath="age" value={d.age} className="font-medium" /> Years, OCCU:{' '}
              <EditableField template={t} fieldPath="occupation" value={d.occupation} className="font-medium uppercase" />, Resident of H.No.{' '}
              <EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-medium" />,{' '}
              <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" /> Village of{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" /> Mandal, District{' '}
              <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />, Telangana, India, Pin Code No.{' '}
              <EditableField template={t} fieldPath="pincode" value={d.pincode} className="font-medium" />, do hereby solemnly affirm and state as below:-
            </p>
          )}

          {isTe ? (
            <>
              <p className="mb-4 text-justify leading-relaxed">
                1. పైన పేర్కొన్న రెండు పేర్లు కల వ్యక్తిని నేనేనని మరియు <span className="font-bold uppercase">{assumedName}</span> అలియాస్ <span className="font-bold uppercase">{previousName}</span> అను రెండు పేర్లు నావేనని, ఆ రెండు పేర్లతో పిలువబడుతున్నది ఒకే వ్యక్తి అనగా నేనేనని సత్యనిష్ఠతో తెలియజేయుచున్నాను.
              </p>
              <p className="mb-4 text-justify leading-relaxed">
                2. నేను <span className="font-bold">{d.aadharNumber}</span> నెంబరు గల ఆధార్ కార్డును <span className="font-bold uppercase">{assumedName}</span> పేరుతో కలిగియున్నాను. అలాగే <span className="font-bold">{d.previousDocType}</span> నెం. <span className="font-bold">{d.previousDocNumber}</span> నందు నా పేరు <span className="font-bold uppercase">{previousName}</span> గా నమోదు కాబడి ఉన్నది. పైన తెలిపిన రెండు పేర్లతో నన్ను పిలుస్తారని తెలియజేయుచున్నాను.
              </p>
              <p className="mb-4 text-justify leading-relaxed">
                3. పైన పేర్కొన్న పేర్లు రెండూ నాకే చెందినవని మరియు మా గ్రామములో ఈ పేర్లతో మరెవ్వరూ లేరని ఇందుమూలముగా స్పష్టం చేయుచున్నాను.
              </p>
              <p className="mb-4 text-justify leading-relaxed">
                4. దయచేసి ఏలియాస్ పేర్లకు సంబంధించిన నా ఈ ప్రకటనను ఆమోదించి, నా ఆధార్ కార్డు ప్రకారము బ్యాంక్ ఖాతాను జారీ / అప్‌డేట్ చేయవలసినదిగా కోరుచున్నాను.
              </p>
              <p className="mb-4 text-justify leading-relaxed">
                5. ఈ ప్రమాణ పత్రము నందు పేర్కొన్న అంశములన్నియు నా పూర్తి వ్యక్తిగత జ్ఞానము మరియు నమ్మకము మేరకు పూర్తిగా సత్యమైనవని, ఎటువంటి సమాచారము దాచబడలేదని లేదా తప్పుగా చెప్పబడలేదని ధృవీకరించుచున్నాను.
              </p>
              <p className="mb-6 text-justify leading-relaxed">
                భవిష్యత్తులో పైన పేర్కొన్న నా ప్రకటన అసత్యమని లేదా తప్పు అని రుజువైనచో, అందుకు నేనే సంపూర్ణ బాధ్యుడనని మరియు నాపై సెక్షన్ 199 మరియు 200 IPC మరియు ఇతర వర్తించే చట్టాల ప్రకారం చట్టపరమైన చర్యలు తీసుకునే పూర్తి హక్కు అధికారులకు ఉంటుందని ఒప్పుకొనుచున్నాను.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4 text-justify">
                1. I state that I am known with above Two names and are one and same person{' '}
                <span className="font-bold">
                  <EditableField template={t} fieldPath="assumedName" value={d.assumedName} className="font-bold uppercase" /> alias <EditableField template={t} fieldPath="previousName" value={d.previousName} className="font-bold uppercase" />
                </span>{' '}
                and both are my names only.
              </p>
              <p className="mb-4 text-justify">
                2. I am holder of Aadhar Card No. <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold" /> with the name of{' '}
                <EditableField template={t} fieldPath="assumedName" value={d.assumedName} className="font-bold uppercase" />, and whereas in{' '}
                <EditableField template={t} fieldPath="previousDocType" value={d.previousDocType} /> No. <EditableField template={t} fieldPath="previousDocNumber" value={d.previousDocNumber} className="font-bold" /> my name entered as{' '}
                <EditableField template={t} fieldPath="previousName" value={d.previousName} className="font-bold uppercase" />. I state that I have been known and called with above names.
              </p>
              <p className="mb-4 text-justify">
                3. I hereby declare that above said names pertain to me and that there is no other person in my village with above said names.
              </p>
              <p className="mb-4 text-justify">
                4. Kindly accept my declaration in regard to alias names and issue / update Bank account as per Aadhar card.
              </p>
              <p className="mb-4 text-justify">
                5. That the contents of the affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed or misrepresented.
              </p>
              <p className="mb-6 text-justify">
                Further I undertake that in future if my above statement is found false or incorrect, then myself held responsible for the same and the authority has full rights to proceed against me as per law under section 199 and 200 IPC and other applicable acts from time to time.
              </p>
            </>
          )}
        </div>

        <div>
          <div className="text-right pr-6 mb-10">
            <span className="font-bold tracking-wider">{isTe ? 'ప్రమాణకర్త (DEPONENT)' : 'DEPONENT'}</span>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-gray-300 pt-4">
            <div>
              <p className="font-bold mb-1">{isTe ? 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది' : 'Sworn and signed before me'}</p>
              <p className="text-[10pt]">
                {isTe ? 'తేదీ: ' : 'On '}
                <EditableField template={t} fieldPath="declarationDate" value={d.declarationDate} className="font-bold" />
                {isTe ? ' వద్ద: ' : ' at '}
                <span className="font-bold uppercase">{declarationPlace}</span>
              </p>
              <div className="mt-8 border-t border-gray-400 w-48 pt-1 text-center text-xs font-bold uppercase text-gray-600">
                {isTe ? 'న్యాయవాది / నోటరీ' : 'Advocate / Notary'}
              </div>
            </div>

            <div className="text-right space-y-4">
              <div>
                <p className="font-bold uppercase">{assumedName}</p>
                <p className="text-[9pt] text-gray-600">({isTe ? 'ఆధార్ కార్డు ప్రకారము పేరు' : 'Assumed name / as per Aadhar Card'})</p>
              </div>

              <div>
                <p className="font-bold uppercase">{previousName}</p>
                <p className="text-[9pt] text-gray-600">({isTe ? 'బ్యాంక్ రికార్డు ప్రకారము పేరు' : 'Previous name / as per bank account'})</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
