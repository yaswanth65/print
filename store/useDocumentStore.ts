import { create } from 'zustand';
import type { FormTemplateMeta, TemplateDef, AnyTemplateDef } from '@/lib/types';

export type TemplateType = 'rent_agreement' | 'affidavit' | 'sale_deed' | 'plot_agreement' | 'ssc_memo_affidavit' | 'cdma_death_correction' | 'lease_deed' | 'sbi_alias_general' | 'single_women_affidavit';
export type EditMode = 'form' | 'direct';

interface DocumentState {
  activeTemplate: TemplateType;
  editMode: EditMode;
  zoom: number;
  data: {
    rent_agreement: any;
    affidavit: any;
    sale_deed: any;
    plot_agreement: any;
    ssc_memo_affidavit: any;
    cdma_death_correction: any;
    lease_deed: any;
    sbi_alias_general: any;
    single_women_affidavit: any;
  };
  setActiveTemplate: (template: TemplateType) => void;
  setEditMode: (mode: EditMode) => void;
  setZoom: (zoom: number) => void;
  updateData: (template: TemplateType, newData: any) => void;
  updateField: (template: TemplateType, fieldPath: string, value: any) => void;

  // Uploaded (dynamic) form templates
  forms: FormTemplateMeta[];
  activeFormId: string | null;
  formDefs: Record<string, AnyTemplateDef>;
  formValues: Record<string, Record<string, string>>;
  setForms: (forms: FormTemplateMeta[]) => void;
  setActiveForm: (id: string | null) => void;
  setFormDef: (formId: string, def: AnyTemplateDef) => void;
  setFormValues: (formId: string, values: Record<string, string>) => void;
  setFormValue: (formId: string, key: string, value: string) => void;
}

const initialRentAgreement = {
  date: '2024-05-15',
  place: 'New Delhi',
  landlord: {
    name: 'Rajesh Kumar',
    age: '45',
    fatherName: 'Late Suresh Kumar',
    address: 'B-102, Safdarjung Enclave, New Delhi - 110029',
  },
  tenant: {
    name: 'Anjali Sharma',
    age: '28',
    fatherName: 'Prakash Sharma',
    address: 'Flat 405, Green Valley Apts, Sector 45, Gurgaon - 122003',
  },
  propertyAddress: 'C-34, First Floor, Vasant Vihar, New Delhi - 110057',
  rentAmount: '25,000',
  rentAmountWords: 'Twenty Five Thousand',
  securityDeposit: '50,000',
  securityDepositWords: 'Fifty Thousand',
  startDate: '2024-06-01',
  durationMonths: '11',
  noticePeriodDays: '30',
  purpose: 'Residential',
};

const initialAffidavit = {
  date: '2024-05-20',
  place: 'Mumbai',
  deponent: {
    name: 'Vikram Singh',
    age: '34',
    fatherName: 'Devendra Singh',
    address: 'A-21, Andheri West, Mumbai - 400053',
  },
  purpose: 'Address Proof for Passport Application',
  statements: [
    'That I am a citizen of India and residing at the above-mentioned address since January 2020.',
    'That my name is correctly spelt as "Vikram Singh" in all my educational certificates.',
    'That I am applying for a fresh passport and the information provided in the application is true and correct to the best of my knowledge.',
  ],
};

const initialSscMemoAffidavit = {
  name: 'K. SONA BAI',
  relation: 'D/o.',
  fatherName: 'SUBHASH',
  age: '25',
  address: 'H.No. 6-9-97, Namdev Wada, NIZAMABAD proper and district, Telangana',
  examination: 'Secondary School Certificate Public Examination',
  examMonth: 'MARCH',
  examYear: '2004',
  rollNo: '0657747',
  school: 'RAOJI SANGAM HIGH SCHOOL, NIZAMABAD',
  board: 'Board of Secondary Education, A.P. Hyderabad',
  lostDate: '26-02-2015',
  journeyMode: 'RTC Bus',
  journeyFrom: 'Armoor',
  journeyTo: 'Balkonda',
  declarationDate: '18-04-2015',
  declarationPlace: 'Armoor',
};

const initialSaleDeed = {
  day: '15',
  month: 'March',
  year: 'Two Thousand Twenty Four',
  seller: {
    name: 'Rajesh Kumar Verma',
    relation: 'son',
    fatherName: 'Mahendra Verma',
    age: '52',
    pan: 'AABCV1234K',
    caste: 'General',
    nationality: 'Indian',
    address: 'Flat No. 1204, Emerald Heights, Sector 62, Noida, Uttar Pradesh - 201309',
  },
  purchaser: {
    name: 'Arjun Reddy Narayan',
    fatherName: 'Suresh Narayan',
    age: '34',
    caste: 'General',
    nationality: 'Indian',
    pan: 'BCDPA4587L',
    address: 'Villa No. 18, Green Meadows, Gachibowli, Hyderabad, Telangana - 500032',
  },
  property: {
    landMeasurement: '0.5',
    landDecimal: '50',
    rsPlotNumber: '112',
    lrPlotNumber: '48',
    rsKhatianNumber: '45',
    lrKhatianNumber: '78',
    mouza: 'Mokila',
    jlNumber: '12',
    touziNumber: '2045',
    policeStation: 'Shankarpally',
    registrationSubDistrict: 'Shankarpally',
    district: 'Ranga Reddy',
  },
  previousOwner: {
    deceasedFatherName: 'Late Ram Prasad Verma',
    purchasedFromName: 'Suresh Patel',
    purchasedFromFatherName: 'Ganesh Patel',
    purchasedFromAddress: '45, Main Road, Shamshabad, Ranga Reddy District',
    saleDeedDate: '12th June 2010',
    registrationOffice: 'Office of the Sub-Registrar, Shankarpally',
    bookVolume: 'III',
    pagesFrom: '245',
    pagesTo: '250',
    deedNumber: '1124',
    deedYear: '2010',
  },
  fatherDeathDate: '15th August 2020',
  agreementDate: '10th January 2024',
  consideration: {
    amount: '48,00,000',
    amountWords: 'Forty Eight Lakhs',
    paymentMode: 'Bank Draft',
  },
  possessionDate: '15th March 2024',
  schedule: {
    landMeasurement: '0.5',
    landDecimal: '50',
    rsPlotNumber: '112',
    lrPlotNumber: '48',
    rsKhatianNumber: '45',
    lrKhatianNumber: '78',
    mouza: 'Mokila',
    jlNumber: '12',
    touziNumber: '2045',
    policeStation: 'Shankarpally',
    registrationSubDistrict: 'Shankarpally',
    district: 'Ranga Reddy',
    north: 'Plot No. 47',
    south: 'Open Land',
    east: '40 Feet Road',
    west: 'Plot No. 49',
  },
};

const initialPlotAgreement = {
  day: '15',
  month: 'March',
  year: '2024',
  place: 'Hyderabad',
  seller: {
    name: 'Rajesh Kumar Verma',
    fatherName: 'Mahendra Verma',
    age: '52',
    occupation: 'Business',
    address: 'Flat No. 1204, Emerald Heights, Sector 62, Noida, Uttar Pradesh - 201309',
    pan: 'AABCV1234K',
    aadhaar: 'XXXX-XXXX-4587',
  },
  purchaser: {
    name: 'Arjun Reddy Narayan',
    fatherName: 'Suresh Narayan',
    age: '34',
    occupation: 'Software Engineer',
    address: 'Villa No. 18, Green Meadows, Gachibowli, Hyderabad, Telangana - 500032',
    pan: 'BCDPA4587L',
    aadhaar: 'XXXX-XXXX-7821',
  },
  property: {
    plotNumber: '48',
    surveyNumber: '112/AA',
    layoutName: 'Green Valley County',
    village: 'Mokila',
    mandal: 'Shankarpally',
    district: 'Ranga Reddy',
    state: 'Telangana',
    extent: '400',
    extentUnit: 'Square Yards',
    propertyType: 'Residential Plot',
    approvalAuthority: 'HMDA',
    approvalNumber: 'HMDA/LP/2045/2024',
    north: 'Plot No. 47',
    south: 'Open Land',
    east: '40 Feet Road',
    west: 'Plot No. 49',
  },
  consideration: {
    total: '48,00,000',
    totalWords: 'Forty Eight Lakhs',
    advanceAmount: '5,00,000',
    secondInstallment: '15,00,000',
    finalBalance: '28,00,000',
  },
  recital1: 'the Seller is the sole, absolute, lawful, and peaceful owner and possessor of the immovable property more fully described in Schedule A hereunder (&ldquo;Scheduled Property&rdquo;), having acquired the same through lawful means and possessing valid title thereto.',
  recital2: 'the Seller represents that the Scheduled Property is free from all encumbrances, liens, mortgages, charges, litigation, acquisition proceedings, attachments, disputes, claims, notices, or third-party rights of whatsoever nature.',
  recital3: 'the Purchaser, after conducting independent due diligence and verification of title documents, approvals, layout permissions, and encumbrance status, has agreed to purchase the Scheduled Property from the Seller.',
  recital4: 'the Seller has agreed to sell and the Purchaser has agreed to purchase the Scheduled Property on the terms and conditions set forth herein.',
  agreementDate: '15th January 2024',
  executionDays: '60',
  defaultInterest: '12',
};

const initialCdmaDeathCorrection = {
  price: '₹1',
  district: 'Nizamabad',
  registrationUnitId: 'RU-1049',
  registrationNumber: 'REG-2023-8841',
  registrationYear: '2023',
  deathYear: '2023',
  locationType: 'Municipality', // 'Greater Municipality' | 'Municipality' | 'Municipal Corporation' | 'Gram Panchayat'
  gender: 'Male', // 'Male' | 'Female'
  updateDeceasedName: 'No', // 'Yes' | 'No'
  changedChildSurname: '',
  changedChildName: '',
  updateDateOfDeath: 'No', // 'Yes' | 'No'
  changedDateOfDeath: '',
  updateGender: 'No', // 'Yes' | 'No'
  changedGender: 'Male', // 'Male' | 'Female'
  updateFatherName: 'No', // 'Yes' | 'No'
  changedFatherSurname: '',
  changedFatherName: '',
  updateMotherName: 'No', // 'Yes' | 'No'
  changedMotherSurname: '',
  changedMotherName: '',
  updateDeathPlace: 'No', // 'Yes' | 'No'
  changedDeathPlace: '',
  updateDeathAddress: 'No', // 'Yes' | 'No'
  changedDeathAddressLine1: '',
  changedDeathAddressLine2: '',
  changedDeathAddressLine3: '',
  updatePermAddress: 'No', // 'Yes' | 'No'
  changedPermAddressLine1: '',
  changedPermAddressLine2: '',
  changedPermAddressLine3: '',
  informantName: 'K. Ramesh Babu',
  informantRelation: 'S/o', // 'S/o' | 'D/o' | 'w/o' | 'H/o' | 'M/o' | 'F/O' | 'C/o'
  informantAddress1: 'H.No. 4-12/1, Subhash Nagar',
  informantAddress2: 'Armoor Town',
  informantAddress3: 'Nizamabad Dist.',
  mobileNumber: '9848012345',
  emailId: 'ramesh.k@gmail.com',
  remarks: 'Correction in spelling of names as per school records',
  pincode: '503224',
  deliveryType: 'Manual / In Person', // 'Manual / In Person' | 'Post − Local' | 'Post − Nonlocal'
  purposeOfCertificate: 'Legal Heir & Pension Settlement',
  noOfCopies: '2',
};

const initialLeaseDeed = {
  agreementDay: '18',
  agreementMonthYear: 'October, 2022',
  wefDate: '01/10/2022',
  lessorName: 'RAMAGIRI KISHAN',
  lessorFatherName: 'RAMAGIRI RAGHUNATH',
  lessorAge: '54',
  lessorOccupation: 'Business',
  lessorAddress: 'H.No. 5-4/B/2, KALIGOTE Village of JAKRANPALLY Mandal, Dist. Nizamabad, Telangana State',
  lesseeName: 'SIDDAPALLI RAJESHWAR',
  lesseeFatherName: 'SIDDAPALLI BABANNA',
  lesseeAge: '42',
  lesseeOccupation: 'Business',
  lesseeAddress: 'H.No.  1-67/8, BABA NAGAR village of BHEEMGAL Mandal, Dist. Nizamabad, T.S',
  doorNo: '12-29/3',
  road: 'N.H.16 Road',
  landmark: 'Khandesh Complex',
  village: 'MAMIDIPALLY',
  mandal: 'ARMOOR',
  district: 'Nizamabad',
  monthlyRent: '11000',
  rentWords: 'Eleven Thousand',
  rentDueDay: '5th',
  extensionYears: 'four',
  leasePeriod: 'ONE YEAR',
  commencementDate: '01-10-2022',
  endDate: '31-09-2023',
  businessName: 'MAHALAXMI COLLECTIONS & KIDS WEAR',
  advanceAmount: '50,000',
  advanceWords: 'Fifty thousand',
  witness1: 'M. Gangadhar, R/o Armoor',
  witness2: 'P. Srinivas, R/o Mamidipally',
};

const initialSbiAliasGeneral = {
  bankName: 'STATE BANK OF INDIA',
  branchName: 'ARMOOR',
  assumedName: 'Sri. CHINTALAPALLY GANGAREDDY',
  previousName: 'CHINTLAPALLY PEDDA GANGAREDDY',
  relation: 'SON OF',
  relativeName: 'CHINTALAPALLY BOJANNA',
  previousDocType: 'Patta Pass Book', // e.g. 'Patta Pass Book' | 'Pan Card' | 'Bank Account'
  previousDocNumber: 'T11010090078',
  aadharNumber: '6017 8940 6754',
  age: '34',
  occupation: 'HOME MAKER',
  hNo: '2-22',
  village: 'MAGGIDI',
  mandal: 'ARMOOR',
  district: 'Nizamabad',
  pincode: '503224',
  declarationDate: '01/09/2026',
  declarationPlace: 'Armoor',
};

const initialSingleWomenAffidavit = {
  applicantName: 'VEMULA SHOBA',
  relation: 'DAUGHTER OF',
  relativeName: 'VEMULA REDDANNA',
  age: '41',
  occupation: 'Labour',
  hNo: '7-21',
  village: 'ANKSAPOOR',
  mandal: 'VELPOOR',
  district: 'Nizamabad',
  state: 'Telangana',
  pincode: '503311',
  aadharNumber: '6469 4213 5938',
  exHusbandName: 'BODASU NARSAIAH',
  exHusbandFatherName: 'POSHETTY',
  exHusbandVillage: 'SIKINDRAPUR',
  exHusbandMandal: 'JAKRANPALLY',
  marriageDate: '23.11.2005',
  divorceTime: '14 years long back ago',
  affidavitDate: '26/06/2026',
  affidavitPlace: 'ARMOOR',
};

export const useDocumentStore = create<DocumentState>((set) => ({
  activeTemplate: 'rent_agreement',
  editMode: 'form',
  zoom: 100,
  data: {
    rent_agreement: initialRentAgreement,
    affidavit: initialAffidavit,
    sale_deed: initialSaleDeed,
    plot_agreement: initialPlotAgreement,
    ssc_memo_affidavit: initialSscMemoAffidavit,
    cdma_death_correction: initialCdmaDeathCorrection,
    lease_deed: initialLeaseDeed,
    sbi_alias_general: initialSbiAliasGeneral,
    single_women_affidavit: initialSingleWomenAffidavit,
  },
  forms: [],
  activeFormId: null,
  formDefs: {},
  formValues: {},
  setActiveTemplate: (template) => set({ activeTemplate: template, activeFormId: null }),
  setEditMode: (mode) => set({ editMode: mode }),
  setZoom: (zoom) => set({ zoom }),
  updateData: (template, newData) =>
    set((state) => ({
      data: {
        ...state.data,
        [template]: newData,
      },
    })),
  updateField: (template, fieldPath, value) => 
    set((state) => {
      const keys = fieldPath.split('.');
      const targetData = structuredClone(state.data[template]);

      const setDeep = (obj: any, path: string[], nextValue: any) => {
        const [head, ...rest] = path;
        if (!head) return;
        if (rest.length === 0) {
          obj[head] = nextValue;
          return;
        }
        if (typeof obj[head] !== 'object' || obj[head] === null) {
          obj[head] = {};
        }
        setDeep(obj[head], rest, nextValue);
      };

      setDeep(targetData, keys, value);

      return {
        data: {
          ...state.data,
          [template]: targetData,
        }
      };
    }),
  setForms: (forms) => set({ forms }),
  setActiveForm: (activeFormId) => set({ activeFormId }),
  setFormDef: (formId, def) =>
    set((state) => ({
      formDefs: { ...state.formDefs, [formId]: def },
    })),
  setFormValues: (formId, values) =>
    set((state) => ({
      formValues: { ...state.formValues, [formId]: values },
    })),
  setFormValue: (formId, key, value) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [formId]: {
          ...(state.formValues[formId] ?? {}),
          [key]: value,
        },
      },
    })),
}));
