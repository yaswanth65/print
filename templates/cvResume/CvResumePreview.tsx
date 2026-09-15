'use client';

import React, { useRef } from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Camera, Upload } from 'lucide-react';
import styles from './cvResume.module.css';

export const CvResumePreview: React.FC = () => {
  const { data, updateField } = useDocumentStore();
  const d = data.cv_resume;
  const t = 'cv_resume';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('cv_resume', 'photo', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles['cv-container']}>
      <div className={styles['cv-page']}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        {/* HEADER SECTION */}
        <div className={styles['cv-header']}>
          {/* Photo with upload overlay */}
          <div
            className={styles['cv-photo-wrapper']}
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload profile photo"
          >
            {d.photo ? (
              <img src={d.photo} alt={d.fullName || 'Candidate'} className={styles['cv-photo']} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[9px]">Upload Photo</span>
              </div>
            )}
            <div className={styles['cv-photo-overlay'] + " print:hidden"}>
              <Upload className="w-4 h-4 mb-1" />
              <span>Change</span>
            </div>
          </div>

          {/* Name & Contact Info */}
          <div className={styles['cv-title-section']}>
            <h1 className={styles['cv-name']}>
              <EditableField template={t} fieldPath="fullName" value={d.fullName} />
            </h1>
            <div className={styles['cv-contact-table']}>
              <div className={styles['cv-contact-row']}>
                <span className={styles['cv-contact-label']}>Address:</span>
                <span className={styles['cv-contact-value']}>
                  <EditableField template={t} fieldPath="address" value={d.address} />
                </span>
              </div>
              <div className={styles['cv-contact-row']}>
                <span className={styles['cv-contact-label']}>Phone:</span>
                <span className={styles['cv-contact-value']}>
                  <EditableField template={t} fieldPath="phone" value={d.phone} />
                </span>
              </div>
              <div className={styles['cv-contact-row']}>
                <span className={styles['cv-contact-label']}>Email:</span>
                <span className={styles['cv-contact-value']}>
                  <EditableField template={t} fieldPath="email" value={d.email} />
                </span>
              </div>
              <div className={styles['cv-contact-row']}>
                <span className={styles['cv-contact-label']}>Website:</span>
                <span className={styles['cv-contact-value']}>
                  <EditableField template={t} fieldPath="website" value={d.website} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className={styles['cv-section']}>
          <div className={styles['cv-section-title']}>Summary</div>
          <p className={styles['cv-summary-text']}>
            <EditableField template={t} fieldPath="summary" value={d.summary} />
          </p>
        </div>

        {/* WORK EXPERIENCE */}
        <div className={styles['cv-section']}>
          <div className={styles['cv-section-title']}>Work Experience</div>
          {(d.workExperience || []).map((work: any, idx: number) => (
            <div key={idx} className={styles['cv-entry']}>
              <div className={styles['cv-entry-header']}>
                <div className={styles['cv-entry-title']}>
                  <EditableField template={t} fieldPath={"workExperience." + idx + ".role"} value={work.role} />
                  {', '}
                  <span className={styles['cv-entry-subtitle']}>
                    <EditableField template={t} fieldPath={"workExperience." + idx + ".company"} value={work.company} />
                  </span>
                </div>
                <div className={styles['cv-entry-date']}>
                  <EditableField template={t} fieldPath={"workExperience." + idx + ".duration"} value={work.duration} />
                </div>
              </div>
              <ul className={styles['cv-bullets']}>
                {(work.points || []).map((pt: string, pIdx: number) => (
                  <li key={pIdx}>
                    <EditableField
                      template={t}
                      fieldPath={"workExperience." + idx + ".points." + pIdx}
                      value={pt}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* EDUCATION */}
        <div className={styles['cv-section']}>
          <div className={styles['cv-section-title']}>Education</div>
          {(d.education || []).map((edu: any, idx: number) => (
            <div key={idx} className={styles['cv-entry']}>
              <div className={styles['cv-entry-header']}>
                <div className={styles['cv-entry-title']}>
                  <EditableField template={t} fieldPath={"education." + idx + ".degree"} value={edu.degree} />
                </div>
                <div className={styles['cv-entry-date']}>
                  <EditableField template={t} fieldPath={"education." + idx + ".duration"} value={edu.duration} />
                </div>
              </div>
              <div className={styles['cv-entry-institution']}>
                <EditableField template={t} fieldPath={"education." + idx + ".institution"} value={edu.institution} />
              </div>
              <ul className={styles['cv-bullets']}>
                {(edu.details || []).map((det: string, dIdx: number) => (
                  <li key={dIdx}>
                    <EditableField
                      template={t}
                      fieldPath={"education." + idx + ".details." + dIdx}
                      value={det}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ADDITIONAL INFORMATION */}
        <div className={styles['cv-section']}>
          <div className={styles['cv-section-title']}>Additional Information</div>
          <div className={styles['cv-info-row']}>
            <span className={styles['cv-info-label']}>• Technical Skills: </span>
            <EditableField template={t} fieldPath="additionalInfo.technicalSkills" value={d.additionalInfo?.technicalSkills} />
          </div>
          <div className={styles['cv-info-row']}>
            <span className={styles['cv-info-label']}>• Languages: </span>
            <EditableField template={t} fieldPath="additionalInfo.languages" value={d.additionalInfo?.languages} />
          </div>
          <div className={styles['cv-info-row']}>
            <span className={styles['cv-info-label']}>• Certifications: </span>
            <EditableField template={t} fieldPath="additionalInfo.certifications" value={d.additionalInfo?.certifications} />
          </div>
          <div className={styles['cv-info-row']}>
            <span className={styles['cv-info-label']}>• Awards/Activities: </span>
            <EditableField template={t} fieldPath="additionalInfo.awards" value={d.additionalInfo?.awards} />
          </div>
        </div>
      </div>
    </div>
  );
};
