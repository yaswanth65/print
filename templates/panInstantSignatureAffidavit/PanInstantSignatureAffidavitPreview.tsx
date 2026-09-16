import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './panInstantSignatureAffidavit.module.css';

export const PanInstantSignatureAffidavitPreview: React.FC = () => {
  const { data } = useDocumentStore();
  const d = data.pan_instant_signature_affidavit;
  const t = 'pan_instant_signature_affidavit';

  return (
    <div className={styles['pan-container']}>
      <div className="document-paper">
        <h1 className={styles['pan-title']}>AFFIDAVIT-CUM-DECLARATION</h1>

        <p className={styles['pan-paragraph']}>
          I, <EditableField template={t} fieldPath="name" value={d.name} className="font-bold uppercase" /> SON OF <EditableField template={t} fieldPath="fatherName" value={d.fatherName} className="font-bold uppercase" />, aged about <EditableField template={t} fieldPath="age" value={d.age} className="font-bold" /> Years, R/o.H.No.<EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-bold" />, <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" /> Village of <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" /> Mandal, Dist. <EditableField template={t} fieldPath="district" value={d.district} />, <EditableField template={t} fieldPath="state" value={d.state} />- <EditableField template={t} fieldPath="pincode" value={d.pincode} />, do hereby solemnly affirm and state on oath as follows:-
        </p>

        <p className={styles['pan-clause']}>
          1) I submit that I am holder of PAN Card No. <EditableField template={t} fieldPath="panNumber" value={d.panNumber} className="font-bold uppercase" /> and when I applied for Pan card, the concerned agent applied Instant Pan card, as such when I obtained Pan card, my signature in not affixed in my said pan card. And the Signature put by me in pan card copy is originally signed by me only. I am holder of Aadhar Card No. <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold uppercase" />.
        </p>

        <p className={styles['pan-clause']}>
          2) I submit that the Signature put by me on the Loan application form is same put by me on my said PAN Card copy, which are originally signed by me. The signature on this affidavit, PAN Card and loan application form are genuine one and are pertain to me only. Kindly treat my signature on this affidavit, Loan application are same as in PAN Card and do the needful to me please. I used to put my Signature as signed by me on this affidavit and in banks and others also.
        </p>

        <p className={styles['pan-paragraph']} style={{ marginTop: '24px' }}>
          Therefore I humbly request the kind authority to please accept this affidavit and do the needful to me please. That the contents of the affidavit are true and correct to the best of my knowledge and belief and that I am personally held responsible for any future complications.
        </p>

        <div className="text-right font-bold uppercase mt-4" style={{ paddingRight: '20%' }}>
          DEPONENT
        </div>

        <div className="mt-8">
          <div>Sworn and signed before me</div>
          <div>On <EditableField template={t} fieldPath="swornDate" value={d.swornDate} /> at <EditableField template={t} fieldPath="swornPlace" value={d.swornPlace} className="uppercase" />.</div>
        </div>

        <div className="text-right mt-10 font-bold uppercase" style={{ paddingRight: '15%' }}>
          (<EditableField template={t} fieldPath="name" value={d.name} />)
        </div>
      </div>
    </div>
  );
};
