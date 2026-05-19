import { create } from 'zustand';

export type TemplateType = 'rent_agreement' | 'affidavit' | 'sale_deed' | 'plot_agreement';
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
  };
  setActiveTemplate: (template: TemplateType) => void;
  setEditMode: (mode: EditMode) => void;
  setZoom: (zoom: number) => void;
  updateData: (template: TemplateType, newData: any) => void;
  updateField: (template: TemplateType, fieldPath: string, value: any) => void;
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

export const useDocumentStore = create<DocumentState>((set) => ({
  activeTemplate: 'rent_agreement',
  editMode: 'form',
  zoom: 100,
  data: {
    rent_agreement: initialRentAgreement,
    affidavit: initialAffidavit,
    sale_deed: initialSaleDeed,
    plot_agreement: initialPlotAgreement,
  },
  setActiveTemplate: (template) => set({ activeTemplate: template }),
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
}));
