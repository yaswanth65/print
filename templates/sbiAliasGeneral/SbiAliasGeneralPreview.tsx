import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './sbiAliasGeneral.module.css';

export const SbiAliasGeneralPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.sbi_alias_general;
  const t = 'sbi_alias_general';

  return (
    <div className={styles['sbi-alias-container']}>
      <div className="document-paper">
        <div>
          {/* Stamp space */}
          <div className={`${styles['sbi-alias-stamp']} print:hidden`}>
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              [ 50 / 100 Rs. Non-Judicial Stamp Paper Space ]
            </span>
          </div>

          {/* Heading */}
          <div className={styles['sbi-alias-recipient']}>
            {isTe ? 'మేనేజర్ గారి సమక్షములో, ' : 'BEFORE THE MANAGER, '}<EditableField template={t} fieldPath="bankName" value={d.bankName} className="font-bold uppercase" /> BRANCH: <EditableField template={t} fieldPath="branchName" value={d.branchName} className="font-bold uppercase" />
          </div>

          <h1 className={styles['sbi-alias-title']}>
            {isTe ? 'ఖాతాదారుని పేరు మార్పు / ఏలియాస్ పేరు ధృవీకరణ ప్రమాణ పత్రము (అఫిడవిట్)' : 'AFFIDAVIT Cum DECLARATION IN REGARD TO ALIAS NAME AND GENUINITY OF ACCOUNT HOLDER'}
          </h1>

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
        </div>

        <div>
          <div className="text-right pr-6 mb-10">
            <span className="font-bold tracking-wider">DEPONENT</span>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-gray-300 pt-4">
            <div>
              <p className="font-bold mb-1">Sworn and signed before me</p>
              <p className="text-[10pt]">
                On <EditableField template={t} fieldPath="declarationDate" value={d.declarationDate} className="font-bold" /> at <EditableField template={t} fieldPath="declarationPlace" value={d.declarationPlace} className="font-bold uppercase" />
              </p>
              <div className="mt-8 border-t border-gray-400 w-48 pt-1 text-center text-xs font-bold uppercase text-gray-600">
                Advocate / Notary
              </div>
            </div>

            <div className="text-right space-y-4">
              <div>
                <p className="font-bold uppercase">
                  <EditableField template={t} fieldPath="assumedName" value={d.assumedName} className="font-bold uppercase" />
                </p>
                <p className="text-[9pt] text-gray-600">(Assumed name / as per Aadhar Card)</p>
              </div>

              <div>
                <p className="font-bold uppercase">
                  <EditableField template={t} fieldPath="previousName" value={d.previousName} className="font-bold uppercase" />
                </p>
                <p className="text-[9pt] text-gray-600">(Previous name / as per bank account)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
