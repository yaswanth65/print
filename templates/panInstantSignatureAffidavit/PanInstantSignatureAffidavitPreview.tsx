import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './panInstantSignatureAffidavit.module.css';

export const PanInstantSignatureAffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const d = data.pan_instant_signature_affidavit || {};
  const t = 'pan_instant_signature_affidavit';
  const isTe = language === 'te';

  return (
    <div className={styles['pan-container']}>
      <div className="document-paper">
        {/* TOP STAMP SPACE */}
        <div className={`${styles['pan-stamp-space']} print:hidden`}>
          <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
            {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
          </span>
        </div>

        {/* TITLE */}
        <h1 className={styles['pan-title']}>
          {isTe ? 'ప్రమాణ పత్రము మరియు స్వీయ ప్రకటన (AFFIDAVIT-CUM-DECLARATION)' : 'AFFIDAVIT-CUM-DECLARATION'}
        </h1>

        {/* DEPONENT BIO INTRO */}
        <p className={styles['pan-paragraph']}>
          {isTe ? (
            <>
              నేను, <EditableField template={t} fieldPath="name" value={d.name || 'BANDAMIDI AJAY'} className="font-bold uppercase" />, తండ్రి{' '}
              <EditableField template={t} fieldPath="fatherName" value={d.fatherName || 'BANDAMIDI SATHYAM'} className="font-bold uppercase" />, వయస్సు సుమారు{' '}
              <EditableField template={t} fieldPath="age" value={d.age || '30'} className="font-bold" /> సంవత్సరములు, నివాసం ఇంటి నెం.{' '}
              <EditableField template={t} fieldPath="hNo" value={d.hNo || '2-100'} className="font-bold" />,{' '}
              <EditableField template={t} fieldPath="village" value={d.village || 'GOVINDPET'} className="font-bold uppercase" /> గ్రామము,{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal || 'ARMOOR'} className="font-bold uppercase" /> మండలము, జిల్లా నిజామాబాద్, తెలంగాణ రాష్ట్రం -{' '}
              <EditableField template={t} fieldPath="pincode" value={d.pincode || '503224'} className="font-bold" />, అను నేను దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది విధంగా తెలియజేయుచున్నాను:-
            </>
          ) : (
            <>
              I, <EditableField template={t} fieldPath="name" value={d.name || 'BANDAMIDI AJAY'} className="font-bold uppercase" /> SON OF{' '}
              <EditableField template={t} fieldPath="fatherName" value={d.fatherName || 'BANDAMIDI SATHYAM'} className="font-bold uppercase" />, aged about{' '}
              <EditableField template={t} fieldPath="age" value={d.age || '30'} className="font-bold" /> Years, R/o.H.No.{' '}
              <EditableField template={t} fieldPath="hNo" value={d.hNo || '2-100'} className="font-bold" />,{' '}
              <EditableField template={t} fieldPath="village" value={d.village || 'GOVINDPET'} className="font-bold uppercase" /> Village of{' '}
              <EditableField template={t} fieldPath="mandal" value={d.mandal || 'ARMOOR'} className="font-bold uppercase" /> Mandal, Dist. Nizambad, Telangana State-{' '}
              <EditableField template={t} fieldPath="pincode" value={d.pincode || '503224'} className="font-bold" />, do hereby solemnly affirm and state on oath as follows:-
            </>
          )}
        </p>

        {/* CLAUSE 1: PAN NUMBER & INSTANT PAN REASON */}
        <p className={styles['pan-clause']}>
          {isTe ? (
            <>
              1) నేను పాన్ కార్డు సంఖ్య <EditableField template={t} fieldPath="panNumber" value={d.panNumber || 'DRWPA3601K'} className="font-bold uppercase" /> కలిగియున్నాను. నేను పాన్ కార్డు కొరకు దరఖాస్తు చేసిన సమయంలో సంబంధిత ఏజెంట్ ఇన్‌స్టంట్ పాన్ (Instant PAN) కార్డు దరఖాస్తు చేసినందున, నాకు వచ్చిన పాన్ కార్డు పై నా సంతకం ముద్రించబడలేదు. తదుపరి పాన్ కార్డు కాపీ పై నా ద్వారా స్వయంగా చేయబడిన సంతకం నా నిజమైన సంతకమేనని తెలియజేయుచున్నాను. నేను ఆధార్ కార్డు సంఖ్య <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber || 'XXXX XXXX 6627'} className="font-bold" /> కలిగియున్నాను.
            </>
          ) : (
            <>
              1) I submit that I am holder of PAN Card No. <EditableField template={t} fieldPath="panNumber" value={d.panNumber || 'DRWPA3601K'} className="font-bold uppercase" /> and when I applied for Pan card, the concerned agent applied Instant Pan card, as such when I obtained Pan card, my signature in not affixed in my said pan card. And the Signature put by me in pan card copy is originally signed by me only. I am holder of Aadhar Card No. <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber || 'XXXX XXXX 6627'} className="font-bold" />.
            </>
          )}
        </p>

        {/* CLAUSE 2: SIGNATURE VERIFICATION ON LOAN FORM */}
        <p className={styles['pan-clause']}>
          {isTe ? (
            <>
              2) లోన్ దరఖాస్తు పత్రము (Loan application form) పై నేను చేసిన సంతకము మరియు నా పాన్ కార్డు కాపీ పై నేను స్వయంగా చేసిన సంతకము రెండూ ఒక్కటేనని మరియు నా స్వంత సంతకాలేనని తెలియజేయుచున్నాను. ఈ అఫిడవిట్, పాన్ కార్డు మరియు లోన్ అప్లికేషన్ లలోని సంతకాలు పూర్తి ప్రామాణికమైనవి మరియు నాకు సంబంధించినవి మాత్రమే. కావున నా లోన్ దరఖాస్తు మరియు పాన్ కార్డు లలోని సంతకమును సమానంగా పరిగణించి నా లోన్ ప్రక్రియను పూర్తి చేయవలసిందిగా కోరుచున్నాను. నేను బ్యాంకులలో మరియు ఇతర అధికారిక పనులలో ఎల్లప్పుడూ ఇదే విధంగా సంతకం చేయుదును.
            </>
          ) : (
            <>
              2) I submit that the Signature put by me on the Loan application form is same put by me on my said PAN Card copy, which are originally signed by me. The signature on this affidavit, PAN Card and loan application form are genuine one and are pertain to me only. Kindly treat my signature on this affidavit, Loan application are same as in PAN Card and do the needful to me please. I used to put my Signature as signed by me on this affidavit and in banks and others also.
            </>
          )}
        </p>

        {/* CLOSING / REQUEST */}
        <p className={styles['pan-paragraph']}>
          {isTe ? (
            <>
              కావున సంబంధిత గౌరవనీయ అధికారులు నా ఈ అఫిడవిట్ ను దయతో ఆమోదించి తగిన చర్యలు తీసుకోవలసిందిగా విజ్ఞప్తి చేయుచున్నాను. ఈ అఫిడవిట్ లోని విషయాలన్నీ నా స్వంత జ్ఞానం మరియు నమ్మకం మేరకు పూర్తిగా నిజమైనవి మరియు సరైనవని ప్రమాణం చేయుచున్నాను. భవిష్యత్తులో ఎటువంటి ఇబ్బందులు తలెత్తినా అందుకు నేనే వ్యక్తిగతంగా బాధ్యత వహిస్తాను.
            </>
          ) : (
            <>
              Therefore I humbly request the kind authority to please accept this affidavit and do the needful to me please. That the contents of the affidavit are true and correct to the best of my knowledge and belief and that I am personally held responsible for any future complications.
            </>
          )}
        </p>

        <div className="text-right font-bold uppercase tracking-wider mt-6 mb-8">
          {isTe ? 'ప్రమాణకర్త (DEPONENT)' : 'DEPONENT'}
        </div>

        {/* NOTARY ATTESTATION & SIGNATURE */}
        <div className={styles['pan-closing']}>
          <div className={styles['pan-notary']}>
            <div className="font-bold">{isTe ? 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది' : 'Sworn and signed before me'}</div>
            <div>
              {isTe ? 'తేదీ: ' : 'On '}
              <EditableField template={t} fieldPath="swornDate" value={d.swornDate || '13-01-2026'} className="font-bold" />
              {isTe ? ' న ' : ' at '}
              <EditableField template={t} fieldPath="swornPlace" value={d.swornPlace || 'ARMOOR'} className="font-bold uppercase" />
              {isTe ? ' వద్ద.' : '.'}
            </div>
          </div>

          <div className={styles['pan-deponent']}>
            <div className="h-12"></div>
            <div className="font-bold uppercase">
              (<EditableField template={t} fieldPath="name" value={d.name || 'BANDAMIDI AJAY'} />)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
