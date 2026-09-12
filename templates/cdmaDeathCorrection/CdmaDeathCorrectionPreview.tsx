import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './cdmaDeathCorrection.module.css';

export const CdmaDeathCorrectionPreview: React.FC = () => {
  const { data, updateField } = useDocumentStore();
  const d = data.cdma_death_correction;
  const t = 'cdma_death_correction';

  const toggle = (field: string, val: string) => {
    updateField(t, field, val);
  };

  return (
    <div className={styles['cdma-document-container']}>
      <div className="document-paper">
        {/* Header */}
        <div className={styles['cdma-header-logo']}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/templates/cdma_logo.png" 
            alt="MeeSeva Logo" 
            className={styles['cdma-logo-img']}
          />
        </div>

        <div className={styles['cdma-price']}>
          Price: ₹1
        </div>

        <div className={styles['cdma-title']}>
          <h1>CDMA Death Corrections Application Form</h1>
        </div>

        {/* Section 1: Death Details */}
        <div style={{ marginBottom: '12px' }}>
          <h2 className={styles['cdma-section-title']}>Death Details:-</h2>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>District:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="district" value={d.district} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Registration Unit Id:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="registrationUnitId" value={d.registrationUnitId} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '36%' }}>
              <span className={styles['cdma-label']}>Registration Number:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="registrationNumber" value={d.registrationNumber} />
              </div>
            </div>
            <div style={{ width: '3%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '30%' }}>
              <span className={styles['cdma-label']}>Registration Year:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="registrationYear" value={d.registrationYear} />
              </div>
            </div>
            <div style={{ width: '3%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '28%' }}>
              <span className={styles['cdma-label']}>Death Year:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="deathYear" value={d.deathYear} />
              </div>
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Location:</span>
            {['Greater Municipality', 'Municipality', 'Municipal Corporation', 'Gram Panchayat'].map((loc) => (
              <label 
                key={loc}
                onClick={() => toggle('locationType', loc)}
                className={styles['cdma-checkbox-item']}
              >
                <span className={styles['cdma-checkbox-box']}>{d.locationType === loc ? '☑' : '☐'}</span>
                <span>{loc}</span>
              </label>
            ))}
          </div>

          <div className={styles['cdma-checkbox-group']} style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Gender:</span>
            {['Male', 'Female'].map((g) => (
              <label 
                key={g}
                onClick={() => toggle('gender', g)}
                className={styles['cdma-checkbox-item']}
              >
                <span className={styles['cdma-checkbox-box']}>{d.gender === g ? '☑' : '☐'}</span>
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Corrections Required */}
        <div style={{ marginBottom: '12px' }}>
          <h2 className={styles['cdma-section-title']}>Corrections Required in Death Certificate Details:-</h2>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Deceased Name:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateDeceasedName', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateDeceasedName === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Child Surname:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedChildSurname" value={d.changedChildSurname} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Child Name:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedChildName" value={d.changedChildName} />
              </div>
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Date of Death:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateDateOfDeath', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateDateOfDeath === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', width: '55%', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Changed Date of Death:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="changedDateOfDeath" value={d.changedDateOfDeath} />
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Gender:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateGender', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateGender === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Changed Gender:</span>
            {['Male', 'Female'].map((g) => (
              <label key={g} onClick={() => toggle('changedGender', g)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.changedGender === g ? '☑' : '☐'}</span>
                <span>{g}</span>
              </label>
            ))}
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Deceased Father Name:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateFatherName', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateFatherName === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Father Surname:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedFatherSurname" value={d.changedFatherSurname} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Father Name:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedFatherName" value={d.changedFatherName} />
              </div>
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Deceased Mother Name:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateMotherName', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateMotherName === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Mother Surname:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedMotherSurname" value={d.changedMotherSurname} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Changed Mother Name:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedMotherName" value={d.changedMotherName} />
              </div>
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Death Place:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateDeathPlace', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateDeathPlace === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', width: '55%', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Changed Death Place:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="changedDeathPlace" value={d.changedDeathPlace} />
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Address at the Time of Death:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updateDeathAddress', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updateDeathAddress === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 1 of Address at the Time of Death:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedDeathAddressLine1" value={d.changedDeathAddressLine1} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 2 of Address at the Time of Death:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedDeathAddressLine2" value={d.changedDeathAddressLine2} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 3 of Address at the Time of Death:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedDeathAddressLine3" value={d.changedDeathAddressLine3} />
              </div>
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Whether You Want to Update Permanent Address:</span>
            {['Yes', 'No'].map((ans) => (
              <label key={ans} onClick={() => toggle('updatePermAddress', ans)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.updatePermAddress === ans ? '☑' : '☐'}</span>
                <span>{ans}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 1 of Permanent Address:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedPermAddressLine1" value={d.changedPermAddressLine1} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 2 of Permanent Address:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedPermAddressLine2" value={d.changedPermAddressLine2} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Changed Line 3 of Permanent Address:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="changedPermAddressLine3" value={d.changedPermAddressLine3} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Informant Details */}
        <div style={{ marginBottom: '12px' }}>
          <h2 className={styles['cdma-section-title']}>Informant Details:-</h2>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Informant Name:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="informantName" value={d.informantName} />
            </div>
          </div>

          <div className={styles['cdma-checkbox-group']}>
            <span style={{ fontWeight: 'bold' }}>Informant Relation:</span>
            {['S/o', 'D/o', 'w/o', 'H/o', 'M/o', 'F/O', 'C/o'].map((rel) => (
              <label key={rel} onClick={() => toggle('informantRelation', rel)} className={styles['cdma-checkbox-item']}>
                <span className={styles['cdma-checkbox-box']}>{d.informantRelation === rel ? '☑' : '☐'}</span>
                <span>{rel}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Informant Address1:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="informantAddress1" value={d.informantAddress1} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Informant Address2:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="informantAddress2" value={d.informantAddress2} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Informant Address3:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="informantAddress3" value={d.informantAddress3} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Mobile Number:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="mobileNumber" value={d.mobileNumber} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '48%' }}>
              <span className={styles['cdma-label']}>Email ID:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="emailId" value={d.emailId} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span className={styles['cdma-label']}>Remarks:</span>
            <div className={styles['cdma-line']}>
              <EditableField template={t} fieldPath="remarks" value={d.remarks} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '8.5pt' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '38%' }}>
              <span className={styles['cdma-label']}>Pin code:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="pincode" value={d.pincode} />
              </div>
            </div>
            <div style={{ width: '4%' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', width: '58%', gap: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 'bold' }}>Delivery Type:</span>
              {['Manual / In Person', 'Post − Local', 'Post − Nonlocal'].map((del) => (
                <label key={del} onClick={() => toggle('deliveryType', del)} className={styles['cdma-checkbox-item']}>
                  <span className={styles['cdma-checkbox-box']}>{d.deliveryType === del ? '☑' : '☐'}</span>
                  <span>{del}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className={styles['cdma-label']}>Purpose of the Certificate</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="purposeOfCertificate" value={d.purposeOfCertificate} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', width: '40%' }}>
              <span className={styles['cdma-label']}>No of copies:</span>
              <div className={styles['cdma-line']}>
                <EditableField template={t} fieldPath="noOfCopies" value={d.noOfCopies} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Document List */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h2 className={styles['cdma-section-title']} style={{ marginBottom: 0 }}>Document List:-</h2>
            <div style={{ fontWeight: 'bold', fontSize: '9pt', paddingRight: '24px' }}>
              Applicant&apos;s Signature
            </div>
          </div>

          <ol className={styles['cdma-doc-list']}>
            <li>Application Form<span style={{ color: '#dc2626', fontWeight: 'bold' }}>*</span></li>
            <li>Original Death Certificate issued by the Registrar of Death</li>
            <li>In case of Medico Legal cases for death events, certificate from the concerned police authority is a must along with FIR and postmortem report</li>
            <li>Notary Affidavit on Rs.10/- Non-Judicial Stamped paper</li>
            <li>Available Documentary evidences like educational certificates, Election ID Card, Ration Card, Passport, Driving License and Marriage certificates</li>
            <li>A letter from the Hospital Authorities where the Death has occurred</li>
          </ol>
        </div>

        {/* Note */}
        <div className={styles['cdma-note']}>
          Note: Please upload Application Form and any one of Above Documents as a single file in pdf format
        </div>
      </div>
    </div>
  );
};
