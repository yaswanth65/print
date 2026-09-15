'use client';

import React, { useRef } from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Camera, Upload } from 'lucide-react';
import styles from './identityCard.module.css';

export const IdentityCardPreview: React.FC = () => {
  const { data, updateField } = useDocumentStore();
  const d = data.identity_card;
  const t = 'identity_card';

  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
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
        updateField('identity_card', 'logo', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles['id-container']}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />

      <div className={styles['id-card']}>
        {/* TOP BLUE HEADER */}
        <div>
          <div className={styles['id-header']}>
            {/* Government Emblem Logo */}
            <div
              className={styles['id-logo-box']}
              onClick={() => logoInputRef.current?.click()}
              title="Click to replace Government logo"
            >
              <img src={d.logo || '/assets/telangana_logo.png'} alt="Emblem" className={styles['id-logo-img']} />
            </div>

            {/* Header Text */}
            <div className={styles['id-header-text']}>
              <div className={styles['id-header-govt']}>
                <EditableField template={t} fieldPath="headerGovt" value={d.headerGovt} />
              </div>
              <div className={styles['id-header-dept']}>
                <EditableField template={t} fieldPath="headerDept" value={d.headerDept} />
              </div>
            </div>
          </div>

          {/* RED BANNER */}
          <div className={styles['id-red-strip']}>
            <EditableField template={t} fieldPath="cardTitle" value={d.cardTitle} />
          </div>
        </div>

        {/* CARD BODY */}
        <div className={styles['id-body']}>
          {/* PHOTO BOX */}
          <div
            className={styles['id-photo-box']}
            onClick={() => photoInputRef.current?.click()}
            title="Click to upload ID photo"
          >
            {d.photo ? (
              <img src={d.photo} alt={d.name || 'Official'} className={styles['id-photo-img']} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px]">Upload</span>
              </div>
            )}
            <div className={styles['id-photo-overlay'] + " print:hidden"}>
              <Upload className="w-4 h-4 mb-1" />
              <span>Change</span>
            </div>
          </div>

          {/* DETAILS */}
          <div className={styles['id-details']}>
            <div className={styles['id-row']}>
              <span className={styles['id-label']}>Name</span>
              <span className={styles['id-colon']}>:</span>
              <span className={styles['id-value']}>
                <EditableField template={t} fieldPath="name" value={d.name} />
              </span>
            </div>
            <div className={styles['id-row']}>
              <span className={styles['id-label']}>Father Name</span>
              <span className={styles['id-colon']}>:</span>
              <span className={styles['id-value']}>
                <EditableField template={t} fieldPath="fatherName" value={d.fatherName} />
              </span>
            </div>
            <div className={styles['id-row']}>
              <span className={styles['id-label']}>Date of Birth</span>
              <span className={styles['id-colon']}>:</span>
              <span className={styles['id-value']}>
                <EditableField template={t} fieldPath="dob" value={d.dob} />
              </span>
            </div>
            <div className={styles['id-row']}>
              <span className={styles['id-label']}>Designation</span>
              <span className={styles['id-colon']}>:</span>
              <span className={styles['id-value']}>
                <EditableField template={t} fieldPath="designation" value={d.designation} />
              </span>
            </div>
            <div className={styles['id-row']}>
              <span className={styles['id-label']}>Place of Working</span>
              <span className={styles['id-colon']}>:</span>
              <span className={styles['id-value']}>
                <EditableField template={t} fieldPath="placeOfWorking" value={d.placeOfWorking} />
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER AUTHORITY */}
        <div className={styles['id-footer']}>
          <div className={styles['id-authority']}>
            <EditableField template={t} fieldPath="authorityTitle" value={d.authorityTitle} />
          </div>
        </div>
      </div>
    </div>
  );
};
