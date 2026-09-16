import { useDocumentStore } from '@/store/useDocumentStore';
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { Camera, Upload, Plus, Trash2, X, CreditCard, Layers } from 'lucide-react';

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
  const { register, watch, reset } = useForm({
    defaultValues: data.rent_agreement
  });

  useEffect(() => {
    reset(data.rent_agreement);
  }, [data.rent_agreement, reset]);

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

// Sale Deed Form
const SaleDeedForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.sale_deed
  });

  useEffect(() => {
    reset(data.sale_deed);
  }, [data.sale_deed, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('sale_deed', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Document Details" />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Day" name="day" register={register} />
          <InputField label="Month" name="month" register={register} />
          <InputField label="Year" name="year" register={register} />
        </div>
        <InputField label="Agreement Date" name="agreementDate" register={register} />
        <InputField label="Father Death Date" name="fatherDeathDate" register={register} />
        <InputField label="Possession Date" name="possessionDate" register={register} />
      </div>

      <div>
        <SectionHeader number="02" title="Seller Information" />
        <InputField label="Full Name" name="seller.name" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Relation" name="seller.relation" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="seller.fatherName" register={register} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="seller.age" register={register} />
          <InputField label="PAN" name="seller.pan" register={register} />
          <InputField label="Caste" name="seller.caste" register={register} />
        </div>
        <InputField label="Nationality" name="seller.nationality" register={register} />
        <InputField label="Address" name="seller.address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="03" title="Purchaser Information" />
        <InputField label="Full Name" name="purchaser.name" register={register} />
        <InputField label="Father's Name" name="purchaser.fatherName" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="purchaser.age" register={register} />
          <InputField label="PAN" name="purchaser.pan" register={register} />
          <InputField label="Caste" name="purchaser.caste" register={register} />
        </div>
        <InputField label="Nationality" name="purchaser.nationality" register={register} />
        <InputField label="Address" name="purchaser.address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="04" title="Property Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Land Measurement" name="property.landMeasurement" register={register} />
          <InputField label="Land (Decimal)" name="property.landDecimal" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="R.S. Plot Number" name="property.rsPlotNumber" register={register} />
          <InputField label="L.R. Plot Number" name="property.lrPlotNumber" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="R.S. Khatian Number" name="property.rsKhatianNumber" register={register} />
          <InputField label="L.R. Khatian Number" name="property.lrKhatianNumber" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Mouza" name="property.mouza" register={register} />
          <InputField label="J.L. Number" name="property.jlNumber" register={register} />
          <InputField label="Touzi Number" name="property.touziNumber" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Police Station" name="property.policeStation" register={register} />
          <InputField label="Reg. Sub-District" name="property.registrationSubDistrict" register={register} />
          <InputField label="District" name="property.district" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="05" title="Previous Owner (Deceased Father)" />
        <InputField label="Deceased Father's Name" name="previousOwner.deceasedFatherName" register={register} />
        <InputField label="Purchased From Name" name="previousOwner.purchasedFromName" register={register} />
        <InputField label="Purchased From Father's Name" name="previousOwner.purchasedFromFatherName" register={register} />
        <InputField label="Purchased From Address" name="previousOwner.purchasedFromAddress" register={register} as="textarea" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Sale Deed Date" name="previousOwner.saleDeedDate" register={register} />
          <InputField label="Registration Office" name="previousOwner.registrationOffice" register={register} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <InputField label="Book/Vol" name="previousOwner.bookVolume" register={register} />
          <InputField label="Pages From" name="previousOwner.pagesFrom" register={register} />
          <InputField label="Pages To" name="previousOwner.pagesTo" register={register} />
          <InputField label="Deed No." name="previousOwner.deedNumber" register={register} />
        </div>
        <InputField label="Deed Year" name="previousOwner.deedYear" register={register} />
      </div>

      <div>
        <SectionHeader number="06" title="Consideration" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Amount (Rs)" name="consideration.amount" register={register} />
          <InputField label="Amount in Words" name="consideration.amountWords" register={register} />
        </div>
        <InputField label="Payment Mode" name="consideration.paymentMode" register={register} />
      </div>

      <div>
        <SectionHeader number="07" title="Schedule of Property" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Land Measurement" name="schedule.landMeasurement" register={register} />
          <InputField label="Land (Decimal)" name="schedule.landDecimal" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="R.S. Plot Number" name="schedule.rsPlotNumber" register={register} />
          <InputField label="L.R. Plot Number" name="schedule.lrPlotNumber" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="R.S. Khatian Number" name="schedule.rsKhatianNumber" register={register} />
          <InputField label="L.R. Khatian Number" name="schedule.lrKhatianNumber" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Mouza" name="schedule.mouza" register={register} />
          <InputField label="J.L. Number" name="schedule.jlNumber" register={register} />
          <InputField label="Touzi Number" name="schedule.touziNumber" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Police Station" name="schedule.policeStation" register={register} />
          <InputField label="Reg. Sub-District" name="schedule.registrationSubDistrict" register={register} />
          <InputField label="District" name="schedule.district" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="North Boundary" name="schedule.north" register={register} />
          <InputField label="South Boundary" name="schedule.south" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="East Boundary" name="schedule.east" register={register} />
          <InputField label="West Boundary" name="schedule.west" register={register} />
        </div>
      </div>
    </div>
  );
};

// Plot Agreement Form
const PlotAgreementForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.plot_agreement
  });

  useEffect(() => {
    reset(data.plot_agreement);
  }, [data.plot_agreement, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('plot_agreement', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Document Details" />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Day" name="day" register={register} />
          <InputField label="Month" name="month" register={register} />
          <InputField label="Year" name="year" register={register} />
        </div>
        <InputField label="Place" name="place" register={register} />
      </div>

      <div>
        <SectionHeader number="02" title="Seller Information" />
        <InputField label="Full Name" name="seller.name" register={register} />
        <InputField label="Father's Name" name="seller.fatherName" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="seller.age" register={register} />
          <div className="col-span-2">
            <InputField label="Occupation" name="seller.occupation" register={register} />
          </div>
        </div>
        <InputField label="Address" name="seller.address" register={register} as="textarea" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="PAN" name="seller.pan" register={register} />
          <InputField label="Aadhaar" name="seller.aadhaar" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="03" title="Purchaser Information" />
        <InputField label="Full Name" name="purchaser.name" register={register} />
        <InputField label="Father's Name" name="purchaser.fatherName" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="purchaser.age" register={register} />
          <div className="col-span-2">
            <InputField label="Occupation" name="purchaser.occupation" register={register} />
          </div>
        </div>
        <InputField label="Address" name="purchaser.address" register={register} as="textarea" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="PAN" name="purchaser.pan" register={register} />
          <InputField label="Aadhaar" name="purchaser.aadhaar" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="04" title="Recitals" />
        <InputField label="Recital 1" name="recital1" register={register} as="textarea" />
        <InputField label="Recital 2" name="recital2" register={register} as="textarea" />
        <InputField label="Recital 3" name="recital3" register={register} as="textarea" />
        <InputField label="Recital 4" name="recital4" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="05" title="Property Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Plot Number" name="property.plotNumber" register={register} />
          <InputField label="Survey Number" name="property.surveyNumber" register={register} />
        </div>
        <InputField label="Layout Name" name="property.layoutName" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Village" name="property.village" register={register} />
          <InputField label="Mandal" name="property.mandal" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="District" name="property.district" register={register} />
          <InputField label="State" name="property.state" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Extent" name="property.extent" register={register} />
          <InputField label="Extent Unit" name="property.extentUnit" register={register} />
        </div>
        <InputField label="Property Type" name="property.propertyType" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Approval Authority" name="property.approvalAuthority" register={register} />
          <InputField label="Approval Number" name="property.approvalNumber" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="06" title="Boundaries" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="North" name="property.north" register={register} />
          <InputField label="South" name="property.south" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="East" name="property.east" register={register} />
          <InputField label="West" name="property.west" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="07" title="Consideration" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Total (Rs)" name="consideration.total" register={register} />
          <InputField label="Total in Words" name="consideration.totalWords" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Advance Amount" name="consideration.advanceAmount" register={register} />
          <InputField label="2nd Installment" name="consideration.secondInstallment" register={register} />
          <InputField label="Final Balance" name="consideration.finalBalance" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="08" title="Terms" />
        <InputField label="Agreement Date" name="agreementDate" register={register} />
        <InputField label="Execution Days" name="executionDays" register={register} />
        <InputField label="Default Interest (% p.a.)" name="defaultInterest" register={register} />
      </div>
    </div>
  );
};

// Affidavit Form
const AffidavitForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.affidavit
  });

  useEffect(() => {
    reset(data.affidavit);
  }, [data.affidavit, reset]);

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

// SSC Memo Lost Affidavit Form
const SscMemoAffidavitForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.ssc_memo_affidavit
  });

  useEffect(() => {
    reset(data.ssc_memo_affidavit);
  }, [data.ssc_memo_affidavit, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('ssc_memo_affidavit', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Deponent Information" />
        <InputField label="Full Name" name="name" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Relation" name="relation" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="fatherName" register={register} />
          </div>
        </div>
        <InputField label="Age" name="age" register={register} />
        <InputField label="Residential Address" name="address" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="02" title="Examination Details" />
        <InputField label="Examination Name" name="examination" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Month" name="examMonth" register={register} />
          <InputField label="Year" name="examYear" register={register} />
        </div>
        <InputField label="Roll No." name="rollNo" register={register} />
        <InputField label="School / Institute" name="school" register={register} />
      </div>

      <div>
        <SectionHeader number="03" title="Loss Details" />
        <InputField label="Issuing Board" name="board" register={register} />
        <InputField label="Date of Loss" name="lostDate" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Journey Mode" name="journeyMode" register={register} />
          <InputField label="From" name="journeyFrom" register={register} />
          <InputField label="To" name="journeyTo" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="04" title="Notary Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Declaration / Oath Date" name="declarationDate" register={register} />
          <InputField label="Place of Oath" name="declarationPlace" register={register} />
        </div>
      </div>
    </div>
  );
};

// CDMA Death Correction Form
const CdmaDeathCorrectionForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.cdma_death_correction
  });

  useEffect(() => {
    reset(data.cdma_death_correction);
  }, [data.cdma_death_correction, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('cdma_death_correction', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Death Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="District" name="district" register={register} />
          <InputField label="Reg. Unit ID" name="registrationUnitId" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Registration Number" name="registrationNumber" register={register} />
          <InputField label="Reg. Year" name="registrationYear" register={register} />
          <InputField label="Death Year" name="deathYear" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Location Type" name="locationType" register={register} />
          <InputField label="Gender" name="gender" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="02" title="Name &amp; Date of Death Corrections" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Update Deceased Name (Yes/No)" name="updateDeceasedName" register={register} />
          <InputField label="Update Date of Death (Yes/No)" name="updateDateOfDeath" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Changed Child Surname" name="changedChildSurname" register={register} />
          <InputField label="Changed Child Name" name="changedChildName" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Changed Date of Death" name="changedDateOfDeath" register={register} />
          <InputField label="Changed Gender" name="changedGender" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="03" title="Parents &amp; Place Corrections" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Update Father Name (Yes/No)" name="updateFatherName" register={register} />
          <InputField label="Update Mother Name (Yes/No)" name="updateMotherName" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Changed Father Surname" name="changedFatherSurname" register={register} />
          <InputField label="Changed Father Name" name="changedFatherName" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Changed Mother Surname" name="changedMotherSurname" register={register} />
          <InputField label="Changed Mother Name" name="changedMotherName" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Update Death Place (Yes/No)" name="updateDeathPlace" register={register} />
          <InputField label="Changed Death Place" name="changedDeathPlace" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="04" title="Address Corrections" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Update Address at Death (Yes/No)" name="updateDeathAddress" register={register} />
          <InputField label="Update Perm. Address (Yes/No)" name="updatePermAddress" register={register} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Address at Death</span>
          <InputField label="Line 1" name="changedDeathAddressLine1" register={register} />
          <InputField label="Line 2" name="changedDeathAddressLine2" register={register} />
          <InputField label="Line 3" name="changedDeathAddressLine3" register={register} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Permanent Address</span>
          <InputField label="Line 1" name="changedPermAddressLine1" register={register} />
          <InputField label="Line 2" name="changedPermAddressLine2" register={register} />
          <InputField label="Line 3" name="changedPermAddressLine3" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="05" title="Informant Details" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Informant Name" name="informantName" register={register} />
          <InputField label="Relation (e.g. S/o, D/o)" name="informantRelation" register={register} />
        </div>
        <InputField label="Address Line 1" name="informantAddress1" register={register} />
        <InputField label="Address Line 2" name="informantAddress2" register={register} />
        <InputField label="Address Line 3" name="informantAddress3" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Mobile" name="mobileNumber" register={register} />
          <InputField label="Email ID" name="emailId" register={register} />
          <InputField label="PIN Code" name="pincode" register={register} />
        </div>
        <InputField label="Remarks" name="remarks" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Delivery Type" name="deliveryType" register={register} />
          <InputField label="No of Copies" name="noOfCopies" register={register} />
        </div>
        <InputField label="Purpose of Certificate" name="purposeOfCertificate" register={register} />
      </div>
    </div>
  );
};

// Lease Deed Form
const LeaseDeedForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.lease_deed
  });

  useEffect(() => {
    reset(data.lease_deed);
  }, [data.lease_deed, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('lease_deed', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Agreement Date &amp; Effective Date" />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Day" name="agreementDay" register={register} />
          <InputField label="Month & Year" name="agreementMonthYear" register={register} />
          <InputField label="w.e.f Date" name="wefDate" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="02" title="Lessor (Owner) Information" />
        <InputField label="Full Name" name="lessorName" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="lessorAge" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="lessorFatherName" register={register} />
          </div>
        </div>
        <InputField label="Occupation" name="lessorOccupation" register={register} />
        <InputField label="Residential Address" name="lessorAddress" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="03" title="Lessee (Tenant) Information" />
        <InputField label="Full Name" name="lesseeName" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Age" name="lesseeAge" register={register} />
          <div className="col-span-2">
            <InputField label="Father's Name" name="lesseeFatherName" register={register} />
          </div>
        </div>
        <InputField label="Occupation" name="lesseeOccupation" register={register} />
        <InputField label="Residential Address" name="lesseeAddress" register={register} as="textarea" />
      </div>

      <div>
        <SectionHeader number="04" title="Leased Property (Shop Room / Mulgie)" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Door No." name="doorNo" register={register} />
          <InputField label="Road / Location" name="road" register={register} />
        </div>
        <InputField label="Landmark" name="landmark" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Village" name="village" register={register} />
          <InputField label="Mandal" name="mandal" register={register} />
          <InputField label="District" name="district" register={register} />
        </div>
        <InputField label="Business Name" name="businessName" register={register} />
      </div>

      <div>
        <SectionHeader number="05" title="Rent &amp; Financial Terms" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Monthly Rent (Rs)" name="monthlyRent" register={register} />
          <InputField label="Rent in Words" name="rentWords" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Rent Due Day (e.g. 5th)" name="rentDueDay" register={register} />
          <InputField label="Extension Years (e.g. four)" name="extensionYears" register={register} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Lease Period" name="leasePeriod" register={register} />
          <InputField label="Start Date" name="commencementDate" register={register} />
          <InputField label="End Date" name="endDate" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Advance Amount (Rs)" name="advanceAmount" register={register} />
          <InputField label="Advance in Words" name="advanceWords" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="06" title="Witnesses" />
        <InputField label="Witness 1" name="witness1" register={register} />
        <InputField label="Witness 2" name="witness2" register={register} />
      </div>
    </div>
  );
};

// SBI Alias General Form
const SbiAliasGeneralForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.sbi_alias_general
  });

  useEffect(() => {
    reset(data.sbi_alias_general);
  }, [data.sbi_alias_general, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('sbi_alias_general', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Bank &amp; Branch" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Bank Name" name="bankName" register={register} />
          <InputField label="Branch" name="branchName" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="02" title="Names &amp; Relation" />
        <InputField label="Assumed Name (Aadhar)" name="assumedName" register={register} />
        <InputField label="Previous Name (Bank/Other)" name="previousName" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Relation (e.g. SON OF, WIFE OF)" name="relation" register={register} />
          <InputField label="Father / Husband Name" name="relativeName" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="03" title="Documents &amp; Numbers" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Previous Doc Type" name="previousDocType" register={register} placeholder="e.g. Patta Pass Book, Pan Card" />
          <InputField label="Previous Doc Number" name="previousDocNumber" register={register} />
        </div>
        <InputField label="Aadhar Card Number" name="aadharNumber" register={register} />
      </div>

      <div>
        <SectionHeader number="04" title="Personal Details &amp; Address" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Age" name="age" register={register} />
          <InputField label="Occupation" name="occupation" register={register} />
        </div>
        <InputField label="House Number" name="hNo" register={register} />
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Village" name="village" register={register} />
          <InputField label="Mandal" name="mandal" register={register} />
          <InputField label="District" name="district" register={register} />
        </div>
        <InputField label="Pin Code" name="pincode" register={register} />
      </div>

      <div>
        <SectionHeader number="05" title="Oath / Declaration" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Date" name="declarationDate" register={register} />
          <InputField label="Place" name="declarationPlace" register={register} />
        </div>
      </div>
    </div>
  );
};

// Single Women Ontari Mahila Affidavit Form
const SingleWomenAffidavitForm = () => {
  const { data, updateData } = useDocumentStore();
  const { register, watch, reset } = useForm({
    defaultValues: data.single_women_affidavit,
  });

  useEffect(() => {
    reset(data.single_women_affidavit);
  }, [data.single_women_affidavit, reset]);

  const formValues = watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    updateData('single_women_affidavit', JSON.parse(formValuesString));
  }, [formValuesString, updateData]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      <div>
        <SectionHeader number="01" title="Applicant (Ontari Mahila) Info" />
        <InputField label="Applicant Name" name="applicantName" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Relation (e.g. DAUGHTER OF, WIFE OF)" name="relation" register={register} />
          <InputField label="Father / Relative Name" name="relativeName" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Age" name="age" register={register} />
          <InputField label="Occupation" name="occupation" register={register} />
        </div>
        <InputField label="Aadhaar Card Number" name="aadharNumber" register={register} />
      </div>

      <div>
        <SectionHeader number="02" title="Residential Address" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="H.No" name="hNo" register={register} />
          <InputField label="Village / Locality" name="village" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Mandal" name="mandal" register={register} />
          <InputField label="District" name="district" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="State" name="state" register={register} />
          <InputField label="Pin Code" name="pincode" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="03" title="Ex-Husband & Separation Details" />
        <InputField label="Ex-Husband Name" name="exHusbandName" register={register} />
        <InputField label="Ex-Husband's Father Name" name="exHusbandFatherName" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Ex-Husband Village" name="exHusbandVillage" register={register} />
          <InputField label="Ex-Husband Mandal" name="exHusbandMandal" register={register} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Marriage Date (e.g. 23.11.2005)" name="marriageDate" register={register} />
          <InputField label="Divorce Duration (e.g. 14 years long back ago)" name="divorceTime" register={register} />
        </div>
      </div>

      <div>
        <SectionHeader number="04" title="Sworn Date & Place" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Date (e.g. 26/06/2026)" name="affidavitDate" register={register} />
          <InputField label="Place (e.g. ARMOOR)" name="affidavitPlace" register={register} />
        </div>
      </div>
    </div>
  );
};


// CV / Resume Form
const CvResumeForm = () => {
  const {
    data,
    updateData,
    updateField,
    addCvWorkExperience,
    removeCvWorkExperience,
    addCvWorkPoint,
    removeCvWorkPoint,
    addCvEducation,
    removeCvEducation,
    addCvEducationDetail,
    removeCvEducationDetail,
  } = useDocumentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, watch, reset } = useForm({
    defaultValues: data.cv_resume,
  });

  useEffect(() => {
    reset(data.cv_resume);
  }, [data.cv_resume, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      updateData('cv_resume', { ...data.cv_resume, ...value });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateData, data.cv_resume]);

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

  const cv = data.cv_resume || {};
  const workExperience = cv.workExperience || [];
  const education = cv.education || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* PHOTO */}
      <div>
        <SectionHeader number="01" title="Candidate Photo" />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="w-16 h-18 rounded border border-slate-300 overflow-hidden bg-white flex-shrink-0">
            {cv.photo ? (
              <img src={cv.photo} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Camera className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#2C75FF] hover:bg-blue-600 text-white rounded text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload / Replace Photo
            </button>
            <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, JPEG</p>
          </div>
        </div>
      </div>

      {/* CONTACT & HEADER */}
      <div>
        <SectionHeader number="02" title="Contact & Header" />
        <InputField label="Full Name" name="fullName" register={register} />
        <InputField label="Address" name="address" register={register} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Phone" name="phone" register={register} />
          <InputField label="Email" name="email" register={register} />
        </div>
        <InputField label="Website / Portfolio" name="website" register={register} />
      </div>

      {/* SUMMARY */}
      <div>
        <SectionHeader number="03" title="Professional Summary" />
        <InputField label="Summary" name="summary" as="textarea" register={register} />
      </div>

      {/* WORK EXPERIENCE (ADD / REMOVE CONTENT) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader number="04" title="Work Experience" />
          <button
            type="button"
            onClick={addCvWorkExperience}
            className="px-2.5 py-1 bg-blue-50 text-[#2C75FF] hover:bg-blue-100 rounded text-xs font-medium border border-blue-200 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Position
          </button>
        </div>

        <div className="space-y-4">
          {workExperience.map((work: any, wIdx: number) => (
            <div key={wIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Position #{wIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCvWorkExperience(wIdx)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs flex items-center gap-1"
                  title="Remove Position"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Job Title</label>
                  <input
                    type="text"
                    value={work.role || ''}
                    onChange={(e) => {
                      const updated = structuredClone(workExperience);
                      updated[wIdx].role = e.target.value;
                      updateField('cv_resume', 'workExperience', updated);
                    }}
                    placeholder="e.g. Senior Engineer"
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={work.company || ''}
                    onChange={(e) => {
                      const updated = structuredClone(workExperience);
                      updated[wIdx].company = e.target.value;
                      updateField('cv_resume', 'workExperience', updated);
                    }}
                    placeholder="e.g. Google"
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                <input
                  type="text"
                  value={work.duration || ''}
                  onChange={(e) => {
                    const updated = structuredClone(workExperience);
                    updated[wIdx].duration = e.target.value;
                    updateField('cv_resume', 'workExperience', updated);
                  }}
                  placeholder="e.g. Jan 2023 - Present"
                  className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                />
              </div>

              {/* Bullets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Key Achievements / Bullets</label>
                  <button
                    type="button"
                    onClick={() => addCvWorkPoint(wIdx)}
                    className="text-[11px] text-[#2C75FF] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(work.points || []).map((pt: string, pIdx: number) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const updated = structuredClone(workExperience);
                          updated[wIdx].points[pIdx] = e.target.value;
                          updateField('cv_resume', 'workExperience', updated);
                        }}
                        placeholder="Bullet point accomplishment..."
                        className="flex-1 border border-slate-300 rounded p-1.5 text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeCvWorkPoint(wIdx, pIdx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete bullet"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDUCATION (ADD / REMOVE CONTENT) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader number="05" title="Education" />
          <button
            type="button"
            onClick={addCvEducation}
            className="px-2.5 py-1 bg-blue-50 text-[#2C75FF] hover:bg-blue-100 rounded text-xs font-medium border border-blue-200 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu: any, eIdx: number) => (
            <div key={eIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Education #{eIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCvEducation(eIdx)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs flex items-center gap-1"
                  title="Remove Education"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const updated = structuredClone(education);
                      updated[eIdx].degree = e.target.value;
                      updateField('cv_resume', 'education', updated);
                    }}
                    placeholder="e.g. B.Tech Mechanical"
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const updated = structuredClone(education);
                      updated[eIdx].institution = e.target.value;
                      updateField('cv_resume', 'education', updated);
                    }}
                    placeholder="e.g. JNTU Hyderabad"
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                <input
                  type="text"
                  value={edu.duration || ''}
                  onChange={(e) => {
                    const updated = structuredClone(education);
                    updated[eIdx].duration = e.target.value;
                    updateField('cv_resume', 'education', updated);
                  }}
                  placeholder="e.g. 2016 - 2020"
                  className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                />
              </div>

              {/* Details */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Details / Marks</label>
                  <button
                    type="button"
                    onClick={() => addCvEducationDetail(eIdx)}
                    className="text-[11px] text-[#2C75FF] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Detail
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(edu.details || []).map((det: string, dIdx: number) => (
                    <div key={dIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={det}
                        onChange={(e) => {
                          const updated = structuredClone(education);
                          updated[eIdx].details[dIdx] = e.target.value;
                          updateField('cv_resume', 'education', updated);
                        }}
                        placeholder="Academic detail or GPA..."
                        className="flex-1 border border-slate-300 rounded p-1.5 text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeCvEducationDetail(eIdx, dIdx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete detail"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS & EXTRA */}
      <div>
        <SectionHeader number="06" title="Skills & Additional Information" />
        <InputField label="Technical Skills" name="additionalInfo.technicalSkills" as="textarea" register={register} />
        <InputField label="Languages" name="additionalInfo.languages" register={register} />
        <InputField label="Certifications" name="additionalInfo.certifications" register={register} />
        <InputField label="Awards & Activities" name="additionalInfo.awards" as="textarea" register={register} />
      </div>
    </div>
  );
};

// Government Identity Card Form
const IdentityCardForm = () => {
  const {
    data,
    updateData,
    updateField,
    activeIdCardType,
    setActiveIdCardType,
    idCardSide,
    setIdCardSide,
  } = useDocumentStore();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const idCardData = data.identity_card || {};
  const currentCard = (idCardData.cards && idCardData.cards[activeIdCardType]) || idCardData.front || {};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateField('identity_card', 'photo', base64);
        if (idCardData.cards && idCardData.cards[activeIdCardType]) {
          const cardsClone = structuredClone(idCardData.cards);
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
        if (idCardData.cards && idCardData.cards[activeIdCardType]) {
          const cardsClone = structuredClone(idCardData.cards);
          cardsClone[activeIdCardType].logo = base64;
          updateField('identity_card', 'cards', cardsClone);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const cardTypes = [
    { id: 'govt_id', label: 'Telangana Govt ID' },
    { id: 'aadhaar', label: 'Aadhaar Card' },
    { id: 'pan', label: 'PAN Card' },
    { id: 'voter', label: 'Voter ID' },
    { id: 'driving', label: 'Driving Licence' },
  ];

  const updateCardProperty = (field: string, val: string) => {
    updateField('identity_card', field, val);
    if (idCardData.cards && idCardData.cards[activeIdCardType]) {
      const cardsClone = structuredClone(idCardData.cards);
      cardsClone[activeIdCardType][field] = val;
      updateField('identity_card', 'cards', cardsClone);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* CARD TYPE SELECTOR */}
      <div>
        <SectionHeader number="01" title="Card Type & Format" />
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Select Card Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {cardTypes.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIdCardType(c.id)}
                  className={`p-2 text-xs font-medium rounded-lg border text-left transition-all ${
                    activeIdCardType === c.id
                      ? 'bg-blue-50 border-[#2C75FF] text-[#2C75FF] font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Print / Export Side</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['front', 'back', 'both'] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setIdCardSide(side)}
                  className={`py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${
                    idCardSide === side
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {side === 'both' ? 'Both (Side-by-Side)' : side}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CARD PHOTOS & EMBLEM */}
      <div>
        <SectionHeader number="02" title="Photos & Government Emblem" />
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

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 rounded border border-slate-300 overflow-hidden bg-white flex-shrink-0">
                {currentCard.photo || idCardData.photo ? (
                  <img
                    src={currentCard.photo || idCardData.photo}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Cardholder Photo</div>
                <div className="text-[11px] text-slate-500">Official photo portrait</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#2C75FF] hover:bg-blue-600 text-white rounded text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-slate-300 overflow-hidden bg-white p-1 flex-shrink-0">
                {currentCard.logo || idCardData.logo ? (
                  <img
                    src={currentCard.logo || idCardData.logo}
                    alt="Emblem"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Emblem / Govt Logo</div>
                <div className="text-[11px] text-slate-500">Official dept emblem</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
          </div>
        </div>
      </div>

      {/* FRONT SIDE DETAILS */}
      <div>
        <SectionHeader number="03" title="Front Side Details" />
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Header (Government)</label>
            <input
              type="text"
              value={currentCard.headerGovt || idCardData.headerGovt || ''}
              onChange={(e) => updateCardProperty('headerGovt', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Department Name</label>
            <input
              type="text"
              value={currentCard.headerDept || idCardData.headerDept || ''}
              onChange={(e) => updateCardProperty('headerDept', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Card Title</label>
            <input
              type="text"
              value={currentCard.cardTitle || idCardData.cardTitle || ''}
              onChange={(e) => updateCardProperty('cardTitle', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={currentCard.name || idCardData.name || ''}
              onChange={(e) => updateCardProperty('name', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Father's Name / Relative</label>
            <input
              type="text"
              value={currentCard.fatherName || idCardData.fatherName || ''}
              onChange={(e) => updateCardProperty('fatherName', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Date of Birth</label>
              <input
                type="text"
                value={currentCard.dob || idCardData.dob || ''}
                onChange={(e) => updateCardProperty('dob', e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Designation / ID No</label>
              <input
                type="text"
                value={currentCard.designation || currentCard.aadharNumber || currentCard.panNumber || idCardData.designation || ''}
                onChange={(e) => updateCardProperty('designation', e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Place of Working / Issue</label>
            <input
              type="text"
              value={currentCard.placeOfWorking || idCardData.placeOfWorking || ''}
              onChange={(e) => updateCardProperty('placeOfWorking', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Issuing Authority Signature</label>
            <input
              type="text"
              value={currentCard.authorityTitle || idCardData.authorityTitle || ''}
              onChange={(e) => updateCardProperty('authorityTitle', e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
        </div>
      </div>

      {/* BACK SIDE DETAILS - EXACT USER SCREENSHOT SPECIFICATIONS */}
      <div>
        <SectionHeader number="04" title="Back Side Details (Official Pass)" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Employee ID</label>
              <input
                type="text"
                value={idCardData.back?.employeeId || '02738492'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.employeeId = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Date of Appointment</label>
              <input
                type="text"
                value={idCardData.back?.dateOfAppointment || '09/09/2026'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.dateOfAppointment = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Pan No.</label>
              <input
                type="text"
                value={idCardData.back?.panNo || 'COBPV4782D'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.panNo = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Aadhar No.</label>
              <input
                type="text"
                value={idCardData.back?.aadharNo || '2939 2038 3232 9183'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.aadharNo = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Blood Group</label>
              <input
                type="text"
                value={idCardData.back?.bloodGroup || 'B+'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.bloodGroup = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Mobile Number</label>
              <input
                type="text"
                value={idCardData.back?.mobileNumber || '+91 9966701124'}
                onChange={(e) => {
                  const backObj = structuredClone(idCardData.back || {});
                  backObj.mobileNumber = e.target.value;
                  updateField('identity_card', 'back', backObj);
                }}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-blue-900 uppercase mb-1">Residential Address</label>
            <textarea
              rows={2}
              value={idCardData.back?.residentialAddress || 'H.No 2-39/43, Housing Board Colony, Vidyanagar, Armoor, 503224, Dist. Nizamabad, Telangana'}
              onChange={(e) => {
                const backObj = structuredClone(idCardData.back || {});
                backObj.residentialAddress = e.target.value;
                updateField('identity_card', 'back', backObj);
              }}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-bold text-red-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Signature Area Label</label>
            <input
              type="text"
              value={idCardData.back?.signText || 'Sign. of the employee'}
              onChange={(e) => {
                const backObj = structuredClone(idCardData.back || {});
                backObj.signText = e.target.value;
                updateField('identity_card', 'back', backObj);
              }}
              className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditorPanel = () => {
  const { activeTemplate } = useDocumentStore();

  return (
    <aside className="h-full bg-white flex flex-col print:hidden flex-1 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Document Data</h2>
      </div>
      
      {activeTemplate === 'rent_agreement' && <RentAgreementForm />}
      {activeTemplate === 'affidavit' && <AffidavitForm />}
      {activeTemplate === 'sale_deed' && <SaleDeedForm />}
      {activeTemplate === 'plot_agreement' && <PlotAgreementForm />}
      {activeTemplate === 'ssc_memo_affidavit' && <SscMemoAffidavitForm />}
      {activeTemplate === 'cdma_death_correction' && <CdmaDeathCorrectionForm />}
      {activeTemplate === 'lease_deed' && <LeaseDeedForm />}
      {activeTemplate === 'sbi_alias_general' && <SbiAliasGeneralForm />}
      {activeTemplate === 'single_women_affidavit' && <SingleWomenAffidavitForm />}
      {activeTemplate === 'cv_resume' && <CvResumeForm />}
      {activeTemplate === 'identity_card' && <IdentityCardForm />}

      <div className="p-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <p className="text-[10px] text-slate-400 text-center italic">Auto-saving local changes...</p>
      </div>
    </aside>
  );
};
