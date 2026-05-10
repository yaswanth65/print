import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';

export const RentAgreementPreview = () => {
  const { data } = useDocumentStore();
  const d = data.rent_agreement;
  const t = 'rent_agreement';

  return (
    <div className="font-serif text-justify text-[11pt] flex flex-col gap-8 w-full items-center">
      
      {/* PAGE 1 */}
      <div className="document-paper flex flex-col">
        {/* Stamp Paper Placeholder */}
        <div className="absolute top-12 right-12 w-32 h-32 border-4 border-slate-100 rounded-full flex flex-col items-center justify-center opacity-40 select-none border-dashed">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300">Revenue</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300">Stamp Area</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold uppercase tracking-tighter underline underline-offset-4">RENT AGREEMENT</h1>
        </div>
        
        <p className="mb-6 leading-relaxed">
          THIS RENT AGREEMENT is made and executed at <EditableField template={t} fieldPath="place" value={d.place} className="font-bold" /> on this <EditableField template={t} fieldPath="date" value={d.date} className="font-bold underline" /> by and between:
        </p>

        <p className="mb-6 leading-relaxed">
          <span className="font-bold"><EditableField template={t} fieldPath="landlord.name" value={d.landlord.name} /></span>, S/o <EditableField template={t} fieldPath="landlord.fatherName" value={d.landlord.fatherName} />, resident of <EditableField template={t} fieldPath="landlord.address" value={d.landlord.address} />, hereinafter called the <span className="font-bold">LESSOR</span> (which expression shall mean and include his heirs, legal representatives, successors and assigns) of the ONE PART.
        </p>

        <p className="mb-6 italic text-center text-slate-500">- AND -</p>

        <p className="mb-10 leading-relaxed">
          <span className="font-bold"><EditableField template={t} fieldPath="tenant.name" value={d.tenant.name} /></span>, S/o <EditableField template={t} fieldPath="tenant.fatherName" value={d.tenant.fatherName} />, resident of <EditableField template={t} fieldPath="tenant.address" value={d.tenant.address} />, hereinafter called the <span className="font-bold">LESSEE</span> (which expression shall mean and include his heirs, legal representatives, successors and assigns) of the OTHER PART.
        </p>

        <p className="mb-6 leading-relaxed">
          <span className="font-bold">WHEREAS</span> the Lessor is the absolute owner of the residential property situated at <span className="bg-yellow-50 px-1"><EditableField template={t} fieldPath="propertyAddress" value={d.propertyAddress} /></span> (hereinafter referred to as the "Demised Premises").
        </p>

        <p className="mb-6 leading-relaxed">
          <span className="font-bold uppercase">Now This Agreement Witnesseth As Under:</span>
        </p>

        <div className="space-y-4 text-sm mt-4">
          <p className="flex gap-4">
            <span className="font-bold">1.</span>
            <span>That the period of this lease shall be for a term of <span className="font-bold"><EditableField template={t} fieldPath="durationMonths" value={d.durationMonths} /> Months</span> commencing from <EditableField template={t} fieldPath="startDate" value={d.startDate} />.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">2.</span>
            <span>That the Lessee shall pay a monthly rent of <span className="font-bold">₹ <EditableField template={t} fieldPath="rentAmount" value={d.rentAmount} />/- (Rupees <EditableField template={t} fieldPath="rentAmountWords" value={d.rentAmountWords} /> only)</span> excluding electricity and water charges.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">3.</span>
            <span>That the Lessee has deposited an interest-free security amount of <span className="font-bold underline">₹ <EditableField template={t} fieldPath="securityDeposit" value={d.securityDeposit} />/-</span> with the Lessor.</span>
          </p>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="document-paper pb-32">
        <div className="space-y-4 text-sm">
          <p className="flex gap-4">
            <span className="font-bold">4.</span>
            <span>That either party can terminate this agreement by providing a notice of <span className="font-bold"><EditableField template={t} fieldPath="noticePeriodDays" value={d.noticePeriodDays} /></span> days in advance.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">5.</span>
            <span>That the electricity and water charges shall be paid by the Lessee as per consumption and the bills raised by the respective authorities.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">6.</span>
            <span>That the Lessee shall use the premises strictly for <span className="font-bold"><EditableField template={t} fieldPath="purpose" value={d.purpose} /></span> purposes and shall not use it for any illegal, immoral, or commercial activities.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">7.</span>
            <span>That the Lessee shall not sub-let, assign, or part with the possession of the premises in whole or part to anyone else.</span>
          </p>
          <p className="flex gap-4">
            <span className="font-bold">8.</span>
            <span>That the Lessee shall not make any major structural changes or additions without the written consent of the Lessor.</span>
          </p>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className="document-paper pb-32 flex flex-col justify-between">
        <div>
          <div className="space-y-4 text-sm">
            <p className="flex gap-4">
              <span className="font-bold">9.</span>
              <span>That the Lessee shall keep the property in good condition. Minor repairs up to Rs. 1,000 shall be borne by the Lessee, while major structural repairs shall be handled by the Lessor.</span>
            </p>
            <p className="flex gap-4">
              <span className="font-bold">10.</span>
              <span>That the Lessor or his authorized agents shall have the right to enter the premises for inspection at reasonable times with prior notice to the Lessee.</span>
            </p>
          </div>
          
          <p className="mt-12 leading-relaxed text-sm">
            <strong>IN WITNESS WHEREOF</strong>, both the LESSOR and LESSEE have mutually agreed and signed this agreement freely and without any force or coercion on this <EditableField template={t} fieldPath="date" value={d.date} className="font-bold" /> at <EditableField template={t} fieldPath="place" value={d.place} className="font-bold" />.
          </p>
        </div>

        <div className="mt-24">
          <div className="flex justify-between mt-12 mb-24">
            <div className="text-center w-64">
              <div className="border-b border-slate-400 w-full mb-2 h-12"></div>
              <p className="font-bold tracking-wider text-sm">LESSOR</p>
              <p className="text-xs text-slate-500 mt-1">(<EditableField template={t} fieldPath="landlord.name" value={d.landlord.name} />)</p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-slate-400 w-full mb-2 h-12"></div>
              <p className="font-bold tracking-wider text-sm">LESSEE</p>
              <p className="text-xs text-slate-500 mt-1">(<EditableField template={t} fieldPath="tenant.name" value={d.tenant.name} />)</p>
            </div>
          </div>

          <div className="mt-16 text-sm">
            <p className="font-bold mb-8">WITNESSES:</p>
            <div className="flex justify-between">
              <div className="w-1/2 pr-8">
                <p>1. Signature: ______________________</p>
                <div className="mt-4 space-y-2">
                  <p>Name: __________________________</p>
                  <p>Address: ________________________</p>
                </div>
              </div>
              <div className="w-1/2 pl-8">
                <p>2. Signature: ______________________</p>
                <div className="mt-4 space-y-2">
                  <p>Name: __________________________</p>
                  <p>Address: ________________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
