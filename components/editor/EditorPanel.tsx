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

      <div className="p-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <p className="text-[10px] text-slate-400 text-center italic">Auto-saving local changes...</p>
      </div>
    </aside>
  );
};
