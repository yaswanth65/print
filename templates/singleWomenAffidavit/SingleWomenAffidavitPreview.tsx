import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './singleWomenAffidavit.module.css';

export const SingleWomenAffidavitPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const d = data.single_women_affidavit;
  const t = 'single_women_affidavit';
  const isTe = language === 'te';

  return (
    <div className={styles['single-women-container']}>
      <div className="document-paper">
        <div>
          {/* Stamp Paper Top Space (Non-Judicial Stamp) */}
          <div className={`${styles['single-women-stamp']} print:hidden`}>
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 50 / 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          {/* Heading */}
          <h1 className={styles['single-women-title']}>
            {isTe ? 'ఒంటరి మహిళ డిక్లరేషన్ ప్రమాణ పత్రము' : 'AFFIDAVIT FOR DECLARATION OF'}
          </h1>
          <h2 className={styles['single-women-subtitle']}>
            {isTe ? '“ONTARI MAHILA / SINGLE WOMEN”' : '“ONTARI  MAHILA / SINGLE WOMEN”'}
          </h2>

          {/* Deponent Bio Introduction */}
          <p className={styles['single-women-paragraph-noindent']}>
            {isTe ? 'నేను, ' : 'I, '}
            <EditableField template={t} fieldPath="applicantName" value={d.applicantName} className="font-bold uppercase" />
            {', '}
            <EditableField template={t} fieldPath="relation" value={d.relation} className="font-medium uppercase" />
            {' '}
            <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />
            {isTe ? ', వయస్సు సుమారు: ' : ', aged about: '}
            <EditableField template={t} fieldPath="age" value={d.age} className="font-bold" />
            {isTe ? ' సంవత్సరములు, వృత్తి: ' : ' Years, OCCU: '}
            <EditableField template={t} fieldPath="occupation" value={d.occupation} className="font-bold uppercase" />
            {isTe ? ', నివాసం ఇంటి నెం. ' : ', Resident of H.No. '}
            <EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-bold" />
            {', '}
            <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" />
            {isTe ? ' గ్రామము, ' : ' Village of '}
            <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" />
            {isTe ? ' మండలము, జిల్లా ' : ' Mandal, District '}
            <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />
            {', '}
            <EditableField template={t} fieldPath="state" value={d.state} className="font-medium" />
            {isTe ? ', పిన్ కోడ్ నెం. ' : ', India, Pin Code No. '}
            <EditableField template={t} fieldPath="pincode" value={d.pincode} className="font-medium" />
            {isTe
              ? ', అను నేను దైవసాక్షిగా ప్రమాణం చేసి ఈ క్రింది విధంగా తెలియజేయుచున్నాను:-'
              : ', do hereby make oath and state as under:-'}
          </p>

          {/* Clause 1: Identity & Aadhaar */}
          <p className={styles['single-women-paragraph-noindent']}>
            {isTe ? (
              <>
                1. నేను ఈ ప్రమాణ పత్రము చేయు ప్రమాణకర్తను మరియు ఈ అఫిడవిట్ లోని వాస్తవాలన్నీ నాకు వ్యక్తిగతంగా తెలిసినవి. నేను ఆధార్ కార్డు సంఖ్య{' '}
                <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold tracking-wide" /> కలిగియున్నాను.
              </>
            ) : (
              <>
                I state that I am the deponent herein and as such I am well acquainted with the facts of this affidavit and I am holder of Aadhar Card No.{' '}
                <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold tracking-wide" />
              </>
            )}
          </p>

          {/* Clause 2: Marriage & Separation Statement */}
          <p className={styles['single-women-paragraph']}>
            {isTe ? (
              <>
                2. నా వివాహము{' '}
                <EditableField template={t} fieldPath="exHusbandName" value={d.exHusbandName} className="font-bold uppercase" />, తండ్రి{' '}
                <EditableField template={t} fieldPath="exHusbandFatherName" value={d.exHusbandFatherName} className="font-bold uppercase" />, నివాసం{' '}
                <EditableField template={t} fieldPath="exHusbandVillage" value={d.exHusbandVillage} className="font-bold uppercase" /> గ్రామము,{' '}
                <EditableField template={t} fieldPath="exHusbandMandal" value={d.exHusbandMandal} className="font-medium uppercase" /> మండలము, జిల్లా{' '}
                <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" /> వారితో తేదీ{' '}
                <EditableField template={t} fieldPath="marriageDate" value={d.marriageDate} className="font-medium" /> న జరిగినది. తదుపరి ఇరువర్గాల పెద్దల సమక్షంలో{' '}
                <EditableField template={t} fieldPath="divorceTime" value={d.divorceTime} className="font-medium" /> నాకు విడాకులు జరిగినవి. నాకు ఎటువంటి సంతానం లేదు. అప్పటి నుండి నేను ఎవరినీ పునర్వివాహం చేసుకోలేదు మరియు ఒంటరి మహిళగా జీవిస్తున్నాను.
              </>
            ) : (
              <>
                I state that my marriage solemnized with{' '}
                <EditableField template={t} fieldPath="exHusbandName" value={d.exHusbandName} className="font-bold uppercase" />, S/o.{' '}
                <EditableField template={t} fieldPath="exHusbandFatherName" value={d.exHusbandFatherName} className="font-bold uppercase" />, Resident of{' '}
                <EditableField template={t} fieldPath="exHusbandVillage" value={d.exHusbandVillage} className="font-bold uppercase" /> Village of{' '}
                <EditableField template={t} fieldPath="exHusbandMandal" value={d.exHusbandMandal} className="font-medium uppercase" /> Mandal, Dist.{' '}
                <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />, on{' '}
                <EditableField template={t} fieldPath="marriageDate" value={d.marriageDate} className="font-medium" /> and afterwards my Divorce also effect{' '}
                <EditableField template={t} fieldPath="divorceTime" value={d.divorceTime} className="font-medium" /> before the Caste elders of both parties., I state that I have no issues. and since then I have remarry to any body and I am living separately as <span className="font-bold uppercase">SINGLE WOMEN</span> only.,
              </>
            )}
          </p>

          {/* Clause 3: Request for Pension */}
          <p className={styles['single-women-paragraph']}>
            {isTe ? (
              <>
                3. కావున సంబంధిత అధికారులు నా <span className="font-bold uppercase">ఒంటరి మహిళ డిక్లరేషన్</span> ను అంగీకరించి, నా జీవనోపాధి కొరకు తెలంగాణ ప్రభుత్వ “<span className="font-bold">ఒంటరి మహిళ పెన్షన్</span>” మంజూరు చేయవలసిందిగా కోరుచున్నాను.
              </>
            ) : (
              <>
                Hence I am requesting the concerned authority accept my <span className="font-bold uppercase">SINGLE WOMAN DELCARATION</span> and sanction me Telangana Govt. “<span className="font-bold">Ontari Mahila</span>”/Single Woman Pension” for my live hood.
              </>
            )}
          </p>

          {/* Clause 4: Verification Knowledge */}
          <p className={styles['single-women-paragraph']}>
            {isTe
              ? '4. పై తెలిపిన విషయాలన్నీ నా వ్యక్తిగత జ్ఞానం మరియు నమ్మకం మేరకు పూర్తిగా నిజమైనవి మరియు సరైనవి.'
              : 'That the above content are true and correct to my personal knowledge and belief.'}
          </p>

          {/* Clause 5: Penal Undertaking */}
          <p className={styles['single-women-paragraph']}>
            {isTe
              ? '5. భవిష్యత్తులో నా ప్రకటన అసత్యమని లేదా తప్పు అని తేలినచో, అందుకు నేనే పూర్తి బాధ్యత వహిస్తానని మరియు చట్టప్రకారం శిక్షార్హురాలినని హామీ ఇస్తున్నాను.'
              : 'Further I undertake that in future if my Statement found false or incorrect then myself held responsible for the same and liable for prosecution U/s. 236 and 237 BNS Act and other acts applicable from time to time.,'}
          </p>

          {/* Clause 6: Financial Undertaking */}
          <p className={styles['single-women-paragraph']}>
            {isTe ? (
              <>
                6. భవిష్యత్తులో నా క్లెయిమ్ అసత్యమని తేలితే, తెలంగాణ ప్రభుత్వం నుండి “<span className="font-bold">ఒంటరి మహిళ పెన్షన్</span>” పథకం కింద నేను పొందిన మొత్తాన్ని తిరిగి ప్రభుత్వానికి చెల్లిస్తానని హామీ ఇస్తున్నాను.
              </>
            ) : (
              <>
                Further I undertake that, in future if my claim found false or incorrect, then myself reimburse the amount which was received to me from the Government of Telangana under “<span className="font-bold">ONTARI MAHILA PENSION</span>”
              </>
            )}
          </p>

          {/* Closing & Deponent */}
          <div className={styles['single-women-closing']}>
            <div>{isTe ? 'దయచేసి నా స్వయం ప్రకటనను అంగీకరించవలెను.' : 'Kindly accept my Self Declaration.'}</div>
            <div className="font-bold uppercase tracking-wider">{isTe ? 'ప్రమాణకర్త (DEPONENT)' : 'DEPONENT'}</div>
          </div>

          {/* Signatures & Witnesses */}
          <div className={styles['single-women-signatures']}>
            <div className={styles['witness-block']}>
              <div className="font-semibold mb-2">{isTe ? 'సాక్షులు (Witnesses):' : 'Witnesses:'}</div>
              <div className="mb-4">1.</div>
              <div>2.</div>
            </div>
            <div className={styles['deponent-block']}>
              <EditableField template={t} fieldPath="applicantName" value={d.applicantName} className="font-bold uppercase" />
            </div>
          </div>

          {/* Sworn Before */}
          <div className={styles['attestation-block']}>
            <div>{isTe ? 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది' : 'Sworn and signed before me'}</div>
            <div>
              {isTe ? 'తేదీ: ' : 'On '}
              <EditableField template={t} fieldPath="affidavitDate" value={d.affidavitDate} className="font-medium" />
              {isTe ? ' న ' : ' at '}
              <EditableField template={t} fieldPath="affidavitPlace" value={d.affidavitPlace} className="font-bold uppercase" />
              {isTe ? ' వద్ద.' : '.'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
