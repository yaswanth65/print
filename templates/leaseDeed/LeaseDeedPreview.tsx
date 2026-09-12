import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import styles from './leaseDeed.module.css';

export const LeaseDeedPreview: React.FC = () => {
  const { data } = useDocumentStore();
  const d = data.lease_deed;
  const t = 'lease_deed';

  return (
    <div className={styles['lease-container']}>
      {/* ================= PAGE 1 ================= */}
      <div className="document-paper">
        <div>
          {/* Stamp Paper Top Space (Non-Judicial Stamp) */}
          <div className={`${styles['lease-stamp-space']} print:border-transparent print:bg-transparent`}>
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold print:hidden">
              [ 100 Rs. Non-Judicial Stamp Paper Space ]
            </span>
          </div>

          <h1 className={styles['lease-title']}>
            LEASE AGREEMENT
          </h1>

          <p className={styles['lease-paragraph']}>
            This Lease Agreement is made and executed on this{' '}
            <EditableField template={t} fieldPath="agreementDay" value={d.agreementDay} className="font-bold" />
            <sup>th</sup> day of {d.agreementMonthYear || '2022'} but it w.e.f{' '}
            <EditableField template={t} fieldPath="wefDate" value={d.wefDate} className="font-bold" /> by and in between:
          </p>

          <p className={styles['lease-paragraph']}>
            <span className="font-bold">Sri. </span>
            <EditableField template={t} fieldPath="lessorName" value={d.lessorName} className="font-bold" />
            {' '}S/o. <EditableField template={t} fieldPath="lessorFatherName" value={d.lessorFatherName} className="font-bold" />,
            aged <EditableField template={t} fieldPath="lessorAge" value={d.lessorAge} className="font-medium" /> years,
            Occu: <EditableField template={t} fieldPath="lessorOccupation" value={d.lessorOccupation} className="font-medium" />,
            R/o. <EditableField template={t} fieldPath="lessorAddress" value={d.lessorAddress} className="font-medium" />,
            (Hereinafter called as <span className="font-bold">LESSOR/OWNER</span>) <span className="font-bold">of one part.</span>
          </p>

          <div className="text-center font-bold my-4 tracking-widest">
            AND
          </div>

          <p className={styles['lease-paragraph']}>
            <span className="font-bold">Sri. </span>
            <EditableField template={t} fieldPath="lesseeName" value={d.lesseeName} className="font-bold" />,
            S/o. <EditableField template={t} fieldPath="lesseeFatherName" value={d.lesseeFatherName} className="font-bold" />,
            aged: <EditableField template={t} fieldPath="lesseeAge" value={d.lesseeAge} className="font-medium" /> years,
            Occu: <EditableField template={t} fieldPath="lesseeOccupation" value={d.lesseeOccupation} className="font-medium" />,
            R/o. <EditableField template={t} fieldPath="lesseeAddress" value={d.lesseeAddress} className="font-medium" />,
            (Hereinafter called as <span className="font-bold">TENANT/LESSEE</span>)
          </p>

          <p className={styles['lease-paragraph']}>
            Whereas the Lessor is the absolute owner and possessor of the R.C.C Roofed Shop Room/Mulgie Bearing Door No.{' '}
            <EditableField template={t} fieldPath="doorNo" value={d.doorNo} className="font-bold" />,
            situated at <EditableField template={t} fieldPath="road" value={d.road} className="font-medium" />,
            near <EditableField template={t} fieldPath="landmark" value={d.landmark} className="font-medium" />,
            <EditableField template={t} fieldPath="village" value={d.village} className="font-bold" /> village of{' '}
            <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold" /> Mandal,
            Dist. <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" />.
          </p>

          <p className={styles['lease-paragraph']}>
            Whereas the Lessee approached to the Lessor and requested the Lessor to give his above said R.C.C Roofed Shop Room / Mulgie bearing Door No.{' '}
            <EditableField template={t} fieldPath="doorNo" value={d.doorNo} className="font-bold" />,
            situated at <EditableField template={t} fieldPath="road" value={d.road} className="font-medium" />,
            near <EditableField template={t} fieldPath="landmark" value={d.landmark} className="font-medium" />,
            <EditableField template={t} fieldPath="village" value={d.village} className="font-bold" /> village of{' '}
            <EditableField template={t} fieldPath="mandal" value={d.mandal} className="font-bold" />,
            Dist. <EditableField template={t} fieldPath="district" value={d.district} className="font-medium" /> on rent and the lessee agreed take the same on the following, terms and conditions set forth herein and the lessee accepted the same.
          </p>
        </div>

        <div className={styles['lease-contd']}>
          (Contd.P..2)
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="document-paper">
        <div>
          <div className={styles['lease-page-num']}>
            :: &nbsp; 2 &nbsp; ::
          </div>

          <h2 className={styles['lease-clause-heading']}>
            NOW THIS RENTAL AGREEMENT FURTHER WITNESSES:
          </h2>

          <p className={styles['lease-clause']}>
            <span className="font-bold">1)</span> That the Lessee/Tenant hereby agrees and undertakes to pay the Owner a monthly rent of Rs.{' '}
            <EditableField template={t} fieldPath="monthlyRent" value={d.monthlyRent} className="font-bold" />/- (Rupees{' '}
            <EditableField template={t} fieldPath="rentWords" value={d.rentWords} className="font-bold" /> only) for Five years, to the or before{' '}
            <EditableField template={t} fieldPath="rentDueDay" value={d.rentDueDay} className="font-medium" /> day of each calendar month. This rental agreement is further extended for{' '}
            <EditableField template={t} fieldPath="extensionYears" value={d.extensionYears} className="font-medium" /> years on same rent.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">2)</span> That the lease shall be for a period of{' '}
            <EditableField template={t} fieldPath="leasePeriod" value={d.leasePeriod} className="font-bold" /> commencing from{' '}
            <EditableField template={t} fieldPath="commencementDate" value={d.commencementDate} className="font-bold" /> and ended with{' '}
            <EditableField template={t} fieldPath="endDate" value={d.endDate} className="font-bold" /> and the lessee has put in possession of the said mulgie on{' '}
            <EditableField template={t} fieldPath="commencementDate" value={d.commencementDate} className="font-medium" />. This lease shall be extended for further period if agrees by the lessor. Otherwise the Lessee herein undertakes, agrees and declares that after expiry of this lease period of 1 year, the lessee himself bind to immediately vacate the mulgie and hand over the vacant possession of the Mulgie to the Lessor without any demand or claim or delay and the lessee will not demand any amount from owner in regard to vacate the said lease mulgie at any time and shall not approach the court of law.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">3)</span> That it is agreed between the parties that the Lessee shall pay the electricity charges as per consumption bills along with water cess, his trade licence fee, leaving G.P./ Municipal and other property taxes to be paid by the Lessor.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">4)</span> That the above said Mulgie obtained on rent by the lessee to carry out his business under the name and style of &apos;
            <EditableField template={t} fieldPath="businessName" value={d.businessName} className="font-bold uppercase" />&apos;{' '}
            <EditableField template={t} fieldPath="village" value={d.village} className="font-bold" /> and for which the said premises is given on rent.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">5)</span> That the Lessee is not entitled to let out the mulgie on lease to any other person or relatives on sub-lease without the permission of the lessor.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">6)</span> That the Lessee hereby undertakes to keep the mulgie in good and habitable condition during the tenure of the lease and the lessor has made the said leased premises decorated one with his own costs. So the lessee shall handover the possession of the said premises in as it is condition in which it was taken, otherwise the lessor has the right to collect the costs of damages or repairs of the said premises from the lessee and also the lessor or his representative (s) is/are entitled to inspect the mulgie all reasonable times.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">7)</span> That in case the lessee fails to pay the rent consecutively for three months or fails to comply anyone of the conditions of the Lease Agreement, the lessor shall be entitled to take legal action against the lessee with all the costs and consequences and shall recover the same or shall be entitled to evict the lessee from the mulgie without notice. That the lessor also give three months prior notice, if the lessor want to vacate the lessee from the leased premises. The lessee hereby agrees, undertakes and indemnities the lessor that he shall vacate the leased premises on the date mentioned in the notice without any demand or claim and delay.
          </p>
        </div>

        <div className={styles['lease-contd']}>
          (Contd.P..3)
        </div>
      </div>

      {/* ================= PAGE 3 ================= */}
      <div className="document-paper">
        <div>
          <div className={styles['lease-page-num']}>
            :: &nbsp; 3 &nbsp; ::
          </div>

          <p className={styles['lease-clause']}>
            <span className="font-bold">8)</span> That the Lessee is at liberty to white-wash or colour-wash the mulgie at his own expenses and the amount incurred will not be reimburse to him by the lessor.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">9)</span> That the Lessee shall not act in a manner by which the neighbouring possessors of mulgie shall raise any objection or they may be distributed by it. And the lessee shall not act in any way by which the property shall incur any loss or its value is affected.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">10)</span> That the lessee shall arrange all the things required for his business and the lessee is held responsible for all the matters of business transaction and the lessor is no way concern with the same.
          </p>

          <p className={styles['lease-clause']}>
            <span className="font-bold">11)</span> That the lessee shall give three months prior notice to the lessor if he intends to vacate the shop room and shall clear off all the dues to the lessor. The lessee paid Rs.{' '}
            <EditableField template={t} fieldPath="advanceAmount" value={d.advanceAmount} className="font-bold" />/- (Rupees{' '}
            <EditableField template={t} fieldPath="advanceWords" value={d.advanceWords} className="font-bold" /> only) advance to the lessor and the same shall be refundable to the lessee without any interest and after deduction of dues.
          </p>

          <p className="mb-6 text-justify">
            PROVIDED always and it is hereby understood and &quot;LESSEE&quot; wherever they occur shall mean and executors, administrators, assignees, legal representatives (S) etc.
          </p>

          <p className="mb-8 text-justify">
            IN WITNESS WHEREOF, the parties hereto have put their respective signatures to this Deed of Lease Agreement on the date aforementioned in token of acceptance thereof.
          </p>

          {/* Signatures and Witnesses Block */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-6">
            {/* Witnesses Column */}
            <div>
              <p className="font-bold underline tracking-wider mb-6">WITNESSES:</p>
              <div className="space-y-8">
                <div>
                  <span className="font-bold">1)</span>{' '}
                  <EditableField template={t} fieldPath="witness1" value={d.witness1} className="border-b border-gray-400 inline-block min-w-[200px]" />
                </div>
                <div>
                  <span className="font-bold">2)</span>{' '}
                  <EditableField template={t} fieldPath="witness2" value={d.witness2} className="border-b border-gray-400 inline-block min-w-[200px]" />
                </div>
              </div>
            </div>

            {/* Signatories Column */}
            <div className="text-right flex flex-col justify-between h-48">
              <div className="text-center w-56 ml-auto">
                <div className="border-b border-gray-800 pb-1 mb-1 font-bold">
                  <EditableField template={t} fieldPath="lessorName" value={d.lessorName} className="font-bold" />
                </div>
                <span className="text-[10pt] font-bold tracking-wider uppercase text-gray-700">LESSOR / OWNER</span>
              </div>

              <div className="text-center w-56 ml-auto mt-10">
                <div className="border-b border-gray-800 pb-1 mb-1 font-bold">
                  <EditableField template={t} fieldPath="lesseeName" value={d.lesseeName} className="font-bold" />
                </div>
                <span className="text-[10pt] font-bold tracking-wider uppercase text-gray-700">TENANT / LESSEE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[9pt] text-gray-400 pt-8 font-sans">
          Page 3 of 3
        </div>
      </div>
    </div>
  );
};
