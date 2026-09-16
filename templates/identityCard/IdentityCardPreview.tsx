'use client';

import React, { useRef } from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Camera, Upload } from 'lucide-react';
import styles from './identityCard.module.css';

export const IdentityCardPreview: React.FC = () => {
  const { data, updateField, idCardSide, activeIdCardType, language } = useDocumentStore();
  const d = data.identity_card || {};
  const t = 'identity_card';
  const isTe = language === 'te';

  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const cardProfile = (d.cards && d.cards[activeIdCardType]) || d.front || {};
  const backData = d.back || {};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('identity_card', 'photo', base64);
        if (d.cards && d.cards[activeIdCardType]) {
          const cardsClone = structuredClone(d.cards);
          cardsClone[activeIdCardType].photo = base64;
          updateField('identity_card', 'cards', cardsClone);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('identity_card', 'logo', base64);
        if (d.cards && d.cards[activeIdCardType]) {
          const cardsClone = structuredClone(d.cards);
          cardsClone[activeIdCardType].logo = base64;
          updateField('identity_card', 'cards', cardsClone);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // FRONT VIEW
  const renderFront = () => (
    <div className={styles['id-card']}>
      {/* TOP HEADER */}
      <div>
        <div className={styles['id-header']}>
          <div
            className={styles['id-logo-box']}
            onClick={() => logoInputRef.current?.click()}
            title="Click to replace Emblem/Logo"
          >
            <img src={cardProfile.logo || d.logo || '/assets/telangana_logo.png'} alt="Emblem" className={styles['id-logo-img']} />
          </div>

          <div className={styles['id-header-text']}>
            <div className={styles['id-header-govt']}>
              <EditableField
                template={t}
                fieldPath={`cards.${activeIdCardType}.headerGovt`}
                value={isTe ? 'తెలంగాణ ప్రభుత్వము' : (cardProfile.headerGovt || 'GOVERNMENT OF TELANGANA STATE')}
              />
            </div>
            <div className={styles['id-header-dept']}>
              <EditableField
                template={t}
                fieldPath={`cards.${activeIdCardType}.headerDept`}
                value={isTe ? 'పంచాయతీరాజ్ శాఖ' : (cardProfile.headerDept || 'PANCHAYATHRAJ DEPARTMENT')}
              />
            </div>
          </div>
        </div>

        {/* RED BANNER */}
        <div className={styles['id-red-strip']}>
          <EditableField
            template={t}
            fieldPath={`cards.${activeIdCardType}.cardTitle`}
            value={isTe ? 'గుర్తింపు కార్డు' : (cardProfile.cardTitle || 'IDENTITY CARD')}
          />
        </div>
      </div>

      {/* CARD BODY */}
      <div className={styles['id-body']}>
        {/* PHOTO BOX */}
        <div
          className={styles['id-photo-box']}
          onClick={() => photoInputRef.current?.click()}
          title="Click to upload cardholder photo"
        >
          {cardProfile.photo || d.photo ? (
            <img src={cardProfile.photo || d.photo} alt="Photo" className={styles['id-photo-img']} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[9px]">Photo</span>
            </div>
          )}
          <div className={styles['id-photo-overlay'] + ' print:hidden'}>
            <Upload className="w-4 h-4 mb-1" />
            <span>Upload</span>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className={styles['id-details']}>
          <div className={styles['id-row']}>
            <span className={styles['id-label']}>{isTe ? 'పేరు' : 'Name'}</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.name`} value={cardProfile.name || d.name} />
            </span>
          </div>

          <div className={styles['id-row']}>
            <span className={styles['id-label']}>{isTe ? 'తండ్రి పేరు' : 'Father Name'}</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.fatherName`} value={cardProfile.fatherName || d.fatherName} />
            </span>
          </div>
          <div className={styles['id-row']}>
            <span className={styles['id-label']}>{isTe ? 'పుట్టిన తేదీ' : 'Date of Birth'}</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.dob`} value={cardProfile.dob || d.dob} />
            </span>
          </div>
          <div className={styles['id-row']}>
            <span className={styles['id-label']}>{isTe ? 'హోదా' : 'Designation'}</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.designation`} value={cardProfile.designation || d.designation} />
            </span>
          </div>
          <div className={styles['id-row']}>
            <span className={styles['id-label']}>{isTe ? 'పనిచేయు స్థలం' : 'Place of Working'}</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.placeOfWorking`} value={cardProfile.placeOfWorking || d.placeOfWorking} />
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER AUTHORITY */}
      <div className={styles['id-footer']}>
        <div className={styles['id-authority']}>
          <EditableField
            template={t}
            fieldPath={`cards.${activeIdCardType}.authorityTitle`}
            value={isTe ? 'ఎం.పి.డి.ఓ / జారీ అధికారి' : (cardProfile.authorityTitle || d.authorityTitle || 'MPDO, Aloor')}
          />
        </div>
      </div>
    </div>
  );

  // BACK VIEW - EXACT USER SCREENSHOT FORMAT
  const renderBack = () => (
    <div className={styles['id-card-back-custom']}>
      {/* 7 ROWS OF LABELS (DARK BLUE) & VALUES (BOLD RED) */}
      <div className={styles['id-back-grid']}>
        {/* Row 1: Employee ID */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Employee ID' : 'Employee ID'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.employeeId" value={backData.employeeId || '02738492'} />
          </span>
        </div>

        {/* Row 2: Date of Appointment */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Date of Appointment' : 'Date of Appointment'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.dateOfAppointment" value={backData.dateOfAppointment || '09/09/2026'} />
          </span>
        </div>

        {/* Row 3: Pan No. */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Pan No.' : 'Pan No.'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.panNo" value={backData.panNo || 'COBPV4782D'} />
          </span>
        </div>

        {/* Row 4: Aadhar No. */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Aadhar No.' : 'Aadhar No.'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.aadharNo" value={backData.aadharNo || '2939 2038 3232 9183'} />
          </span>
        </div>

        {/* Row 5: Blood Group */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Blood Group' : 'Blood Group'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.bloodGroup" value={backData.bloodGroup || 'B+'} />
          </span>
        </div>

        {/* Row 6: Residential Address */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Residential Address' : 'Residential Address'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField
              template={t}
              fieldPath="back.residentialAddress"
              value={backData.residentialAddress || 'H.No 2-39/43, Housing Board Colony, Vidyanagar, Armoor, 503224, Dist. Nizamabad, Telangana'}
            />
          </span>
        </div>

        {/* Row 7: Mobile Number */}
        <div className={styles['id-back-row']}>
          <span className={styles['id-back-label']}>
            {isTe ? 'Mobile Number' : 'Mobile Number'}
          </span>
          <span className={styles['id-back-colon']}>:</span>
          <span className={styles['id-back-val']}>
            <EditableField template={t} fieldPath="back.mobileNumber" value={backData.mobileNumber || '+91 9966701124'} />
          </span>
        </div>
      </div>

      {/* BOTTOM RIGHT: SIGNATURE OF EMPLOYEE */}
      <div className={styles['id-back-sign-area']}>
        <div className={styles['id-back-sign-space']}></div>
        <div className={styles['id-back-sign-text']}>
          <EditableField
            template={t}
            fieldPath="back.signText"
            value={backData.signText || 'Sign. of the employee'}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles['id-container']}>
      {/* Hidden file inputs */}
      <input type="file" ref={photoInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      <input type="file" ref={logoInputRef} accept="image/*" className="hidden" onChange={handleLogoUpload} />

      {/* RENDER ACCORDING TO idCardSide */}
      {idCardSide === 'front' && renderFront()}
      {idCardSide === 'back' && renderBack()}
      {idCardSide === 'both' && (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center print:hidden">Front Side</div>
            {renderFront()}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center print:hidden">Back Side</div>
            {renderBack()}
          </div>
        </div>
      )}
    </div>
  );
};
