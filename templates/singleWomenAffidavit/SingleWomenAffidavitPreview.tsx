import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './singleWomenAffidavit.module.css';

export const SingleWomenAffidavitPreview: React.FC = () => {
  const { data } = useDocumentStore();
  const d = data.single_women_affidavit;
  const t = 'single_women_affidavit';

  return (
    <div className={styles['single-women-container']}>
      <div className="document-paper">
        <div>
          {/* Stamp Paper Top Space (Non-Judicial Stamp) */}
          

          {/* Heading */}
          <h1 className={styles['single-women-title']}>
            AFFIDAVIT FOR DECLARATION OF
          </h1>
          <h2 className={styles['single-women-subtitle']}>
            “ONTARI &nbsp;MAHILA / SINGLE WOMEN’’
          </h2>

          {/* Deponent Bio Introduction */}
          <p className={styles['single-women-paragraph-noindent']}>
            I, <EditableField template={t} fieldPath="applicantName" value={d.applicantName} className="font-bold uppercase" />
            {', '}
            <EditableField template={t} fieldPath="relation" value={d.relation} className="font-medium uppercase" />
            {' '}
            <EditableField template={t} fieldPath="relativeName" value={d.relativeName} className="font-bold uppercase" />, aged about:{' '}
            <EditableField template={t} fieldPath="age" value={d.age} className="font-bold" /> Years, OCCU:{' '}
            <EditableField template={t} fieldPath="occupation" value={d.occupation} className="font-bold uppercase" />, Resident of H.No.{' '}
            <EditableField template={t} fieldPath="hNo" value={d.hNo} className="font-bold" />,{' '}
            <EditableField template={t} fieldPath="village" value={d.village} className="font-bold uppercase" /> Village of{' '}
            <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold uppercase" /> Mandal, District{' '}
            <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />,{' '}
            <EditableField template={t} fieldPath="state" value={d.state} className="font-medium" />, India, Pin Code No.{' '}
            <EditableField template={t} fieldPath="pincode" value={d.pincode} className="font-medium" />, do hereby make oath and state as under:-
          </p>

          {/* Clause 1: Identity & Aadhaar */}
          <p className={styles['single-women-paragraph-noindent']}>
            I state that I am the deponent herein and as such I am well acquainted with the facts of this affidavit and I am holder of Aadhar Card No.{' '}
            <EditableField template={t} fieldPath="aadharNumber" value={d.aadharNumber} className="font-bold tracking-wide" />
          </p>

          {/* Clause 2: Marriage & Separation Statement */}
          <p className={styles['single-women-paragraph']}>
            I state that my marriage solemnized with{' '}
            <EditableField template={t} fieldPath="exHusbandName" value={d.exHusbandName} className="font-bold uppercase" />, S/o.{' '}
            <EditableField template={t} fieldPath="exHusbandFatherName" value={d.exHusbandFatherName} className="font-bold uppercase" />, Resident of{' '}
            <EditableField template={t} fieldPath="exHusbandVillage" value={d.exHusbandVillage} className="font-bold uppercase" /> Village of{' '}
            <EditableField template={t} fieldPath="exHusbandMandal" value={d.exHusbandMandal} className="font-medium uppercase" /> Mandal, Dist.{' '}
            <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />, on{' '}
            <EditableField template={t} fieldPath="marriageDate" value={d.marriageDate} className="font-medium" /> and afterwards my Divorce also effect{' '}
            <EditableField template={t} fieldPath="divorceTime" value={d.divorceTime} className="font-medium" /> before the Caste elders of both parties., I state that I have no issues. and since then I have remarry to any body and I am living separately as <span className="font-bold uppercase">SINGLE WOMEN</span> only.,
          </p>

          {/* Clause 3: Request for Pension */}
          <p className={styles['single-women-paragraph']}>
            Hence I am requesting the concerned authority accept my <span className="font-bold uppercase">SINGLE WOMAN DELCARATION</span> and sanction me Telangana Govt. “<span className="font-bold">Ontari Mahila</span>”/Single Woman Pension” for my live hood.
          </p>

          {/* Clause 4: Verification Knowledge */}
          <p className={styles['single-women-paragraph']}>
            That the above content are true and correct to my personal knowledge and belief.
          </p>

          {/* Clause 5: Penal Undertaking */}
          <p className={styles['single-women-paragraph']}>
            Further I undertake that in future if my Statement found false or incorrect then myself held responsible for the same and liable for prosecution U/s. 236 and 237 BNS Act and other acts applicable from time to time.,
          </p>

          {/* Clause 6: Financial Undertaking */}
          <p className={styles['single-women-paragraph']}>
            Further I undertake that, in future if my claim found false or incorrect, then myself reimburse the amount which was received to me from the Government of Telangana under “<span className="font-bold">ONTARI MAHILA PENSION</span>”
          </p>

          {/* Closing & Deponent */}
          <div className={styles['single-women-closing']}>
            <div>Kindly accept my Self Declaration.</div>
            <div className="font-bold uppercase tracking-wider">DEPONENT</div>
          </div>

          {/* Signatures & Witnesses */}
          <div className={styles['single-women-signatures']}>
            <div className={styles['witness-block']}>
              <div className="font-semibold mb-2">Witnesses:</div>
              <div className="mb-4">1.</div>
              <div>2.</div>
            </div>
            <div className={styles['deponent-block']}>
              <EditableField template={t} fieldPath="applicantName" value={d.applicantName} className="font-bold uppercase" />
            </div>
          </div>

          {/* Sworn Before */}
          <div className={styles['attestation-block']}>
            <div>Sworn and signed before me</div>
            <div>
              On <EditableField template={t} fieldPath="affidavitDate" value={d.affidavitDate} className="font-medium" /> at <EditableField template={t} fieldPath="affidavitPlace" value={d.affidavitPlace} className="font-bold uppercase" />.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
