import { useDocumentStore } from '@/store/useDocumentStore';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

// Common Input Component
const InputField = ({ label, register, name, placeholder = '', type = 'text', as = 'input' }: any) => {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">{label}</label>
      {as === 'textarea' ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        />
      ) : (
        <input 
          type={type}
          {...register(name)} 
          placeholder={placeholder}
          className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        />
      )}
    </div>
  );
};

const SectionHeader = ({ number, title }: { number: string, title: string }) => (
  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px]">{number}</span>
    {title}
  </h3>
);

// Rent Agreement Form
const RentAgreementForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch } = useForm({
    defaultValues: data.rent_agreement
  });

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('rent_agreement', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Document Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Date" name="date" register={register} type="date" />
          <InputField label="Place" name="place" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="02" title="Landlord Information" />
        <InputField label="Full Name" name="landlord.name" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="landlord.age" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="landlord.fatherName" register={register} />
          </div>
        </div>
        <InputField label="Address" name="landlord.address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="03" title="Tenant Information" />
        <InputField label="Full Name" name="tenant.name" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="tenant.age" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="tenant.fatherName" register={register} />
          </div>
        </div>
        <InputField label="Address" name="tenant.address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="04" title="Terms & Conditions" />
        <InputField label="Property Address" name="propertyAddress" register={register} as="textarea" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Rent Amount (Rs)" name="rentAmount" register={register} />
          <InputField label="Rent in Words" name="rentAmountWords" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Security Deposit" name="securityDeposit" register={register} />
          <InputField label="Deposit in Words" name="securityDepositWords" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Start Date" name="startDate" register={register} type="date" />
          <InputField label="Duration (Months)" name="durationMonths" register={register} />
        </div>
         <div className="grid grid-cols-2 gap-3">
          <InputField label="Notice Period (Days)" name="noticePeriodDays" register={register} />
          <InputField label="Purpose" name="purpose" register={register} />
        </div>
      </div>
    </div>
  );
};

// Affidavit Form
const AffidavitForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch } = useForm({
    defaultValues: data.affidavit
  });

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('affidavit', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Document Details" />
        <InputField label="Purpose of Affidavit" name="purpose" register={register} placeholder="e.g., Address Proof" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Date" name="date" register={register} type="date" />
          <InputField label="Place" name="place" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="02" title="Deponent Information" />
        <InputField label="Full Name" name="deponent.name" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="deponent.age" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="deponent.fatherName" register={register} />
          </div>
        </div>
        <InputField label="Address" name="deponent.address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="03" title="Statements" />
        {data.affidavit.statements.map((_: string, index: number) => (
          <InputField 
            key={index}
            label={`Statement ${index + 1}`} 
            name={`statements.${index}`} 
            register={register} 
            as="textarea" 
          />
        ))}
      </div>
    </div>
  );
};

export const EditorPanel = () => {
  const { activeTemplate, editMode } = useDocumentStore();

  if (editMode === 'direct') {
    return (
      <aside className="w-full h-full bg-white flex flex-col items-center justify-center text-center text-slate-500 p-8">
        <div className="p-6 max-w-sm">
          <svg className="w-12 h-12 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Direct Edit Mode Active</h3>
          <p className="text-xs text-slate-500 leading-relaxed">You are directly editing the document on the right side. Form inputs are disabled in this mode to prevent conflicts.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full bg-white flex flex-col print:hidden flex-1 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Document Data</h2>
      </div>
      
      {activeTemplate === 'rent_agreement' && <RentAgreementForm />}
      {activeTemplate === 'affidavit' && <AffidavitForm />}

      <div className="p-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <p className="text-[10px] text-slate-400 text-center italic">Auto-saving local changes...</p>
      </div>
    </aside>
  );
};
