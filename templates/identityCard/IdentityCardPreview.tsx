'use client';

import React, { useRef } from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Camera, Upload, QrCode, ShieldCheck } from 'lucide-react';
import styles from './identityCard.module.css';

export const IdentityCardPreview: React.FC = () => {
  const { data, updateField, idCardSide, activeIdCardType } = useDocumentStore();
  const d = data.identity_card;
  const t = 'identity_card';

  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backPhotoInputRef = useRef<HTMLInputElement>(null);

  // Active card profile
  const cardProfile = d.cards?.[activeIdCardType] || d.front || {};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('identity_card', `cards.${activeIdCardType}.photo`, base64);
        updateField('identity_card', 'photo', base64);
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
        updateField('identity_card', `cards.${activeIdCardType}.logo`, base64);
        updateField('identity_card', 'logo', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('identity_card', 'back.backPhoto', base64);
      }
    };
    reader.readAsDataURL(file);
  };

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
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.headerGovt`} value={cardProfile.headerGovt || 'GOVERNMENT OF TELANGANA STATE'} />
            </div>
            <div className={styles['id-header-dept']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.headerDept`} value={cardProfile.headerDept || 'PANCHAYATHRAJ DEPARTMENT'} />
            </div>
          </div>
        </div>

        {/* RED BANNER */}
        <div className={styles['id-red-strip']}>
          <EditableField template={t} fieldPath={`cards.${activeIdCardType}.cardTitle`} value={cardProfile.cardTitle || 'IDENTITY CARD'} />
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
          <div className={styles['id-photo-overlay'] + " print:hidden"}>
            <Upload className="w-4 h-4 mb-1" />
            <span>Upload</span>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className={styles['id-details']}>
          <div className={styles['id-row']}>
            <span className={styles['id-label']}>Name</span>
            <span className={styles['id-colon']}>:</span>
            <span className={styles['id-value']}>
              <EditableField template={t} fieldPath={`cards.${activeIdCardType}.name`} value={cardProfile.name || d.name} />
            </span>
          </div>

          {activeIdCardType === 'aadhaar' ? (
            <>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>DOB</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.aadhaar.dob" value={cardProfile.dob || '30/08/2004'} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Gender</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.aadhaar.gender" value={cardProfile.gender || 'MALE'} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Aadhaar No.</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.aadhaar.aadharNumber" value={cardProfile.aadharNumber || '6469 4213 5938'} />
                </span>
              </div>
            </>
          ) : activeIdCardType === 'pan' ? (
            <>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Father Name</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.pan.fatherName" value={cardProfile.fatherName || d.fatherName} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Date of Birth</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.pan.dob" value={cardProfile.dob || d.dob} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Permanent Acc.</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.pan.panNumber" value={cardProfile.panNumber || 'ABCDE1234F'} />
                </span>
              </div>
            </>
          ) : activeIdCardType === 'driving' ? (
            <>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>DL Number</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.driving.dlNumber" value={cardProfile.dlNumber || 'TS-16 20220008456'} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Valid Till</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.driving.validTill" value={cardProfile.validTill || '29/08/2044'} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Vehicle Class</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath="cards.driving.vehicleClass" value={cardProfile.vehicleClass || 'MCWG, LMV'} />
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Father Name</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath={`cards.${activeIdCardType}.fatherName`} value={cardProfile.fatherName || d.fatherName} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Date of Birth</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath={`cards.${activeIdCardType}.dob`} value={cardProfile.dob || d.dob} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Designation</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath={`cards.${activeIdCardType}.designation`} value={cardProfile.designation || d.designation} />
                </span>
              </div>
              <div className={styles['id-row']}>
                <span className={styles['id-label']}>Place of Working</span>
                <span className={styles['id-colon']}>:</span>
                <span className={styles['id-value']}>
                  <EditableField template={t} fieldPath={`cards.${activeIdCardType}.placeOfWorking`} value={cardProfile.placeOfWorking || d.placeOfWorking} />
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER AUTHORITY */}
      <div className={styles['id-footer']}>
        <div className={styles['id-authority']}>
          <EditableField template={t} fieldPath={`cards.${activeIdCardType}.authorityTitle`} value={cardProfile.authorityTitle || d.authorityTitle || 'Issuing Authority'} />
        </div>
      </div>
    </div>
  );

  const renderBack = () => (
    <div className={styles['id-card']}>
      {/* TOP HEADER FOR BACK */}
      <div className={styles['id-back-header']}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs uppercase tracking-wider">Official Identification Document</span>
        </div>
        <span className="text-[10px] text-slate-300">Side 2 of 2</span>
      </div>

      {/* BACK BODY */}
      <div className={styles['id-back-body']}>
        <div className={styles['id-back-content']}>
          <div className="mb-2">
            <span className="font-bold text-slate-800 text-[11px] block">Address / నివాస చిరునామా:</span>
            <p className="text-slate-600 text-xs leading-snug">
              <EditableField template={t} fieldPath="back.address" value={d.back?.address} />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
            <div>
              <span className="font-semibold text-slate-700">Blood Group: </span>
              <span className="font-bold text-red-700">
                <EditableField template={t} fieldPath="back.bloodGroup" value={d.back?.bloodGroup} />
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Emergency Contact: </span>
              <span className="font-medium text-slate-900">
                <EditableField template={t} fieldPath="back.emergencyContact" value={d.back?.emergencyContact} />
              </span>
            </div>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10.5px] text-slate-600 leading-relaxed mb-2 whitespace-pre-line">
            <EditableField template={t} fieldPath="back.instructions" value={d.back?.instructions} />
          </div>
        </div>

        {/* QR / BARCODE SECTION */}
        <div className={styles['id-qr-section']}>
          <div
            className={styles['id-qr-box']}
            onClick={() => backPhotoInputRef.current?.click()}
            title="Click to upload custom QR code / back stamp"
          >
            {d.back?.backPhoto ? (
              <img src={d.back.backPhoto} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-white p-1">
                <QrCode className="w-12 h-12 text-slate-800" />
                <span className="text-[8.5px] text-slate-500 font-mono mt-0.5">SCAN QR</span>
              </div>
            )}
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-1 text-center">
            <EditableField template={t} fieldPath="back.barcodeText" value={d.back?.barcodeText} />
          </div>
        </div>
      </div>

      {/* BACK FOOTER */}
      <div className={styles['id-back-footer']}>
        <EditableField template={t} fieldPath="back.issuingOffice" value={d.back?.issuingOffice} />
      </div>
    </div>
  );

  return (
    <div className={styles['id-container']}>
      {/* Hidden file inputs */}
      <input type="file" ref={photoInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      <input type="file" ref={logoInputRef} accept="image/*" className="hidden" onChange={handleLogoUpload} />
      <input type="file" ref={backPhotoInputRef} accept="image/*" className="hidden" onChange={handleBackPhotoUpload} />

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
