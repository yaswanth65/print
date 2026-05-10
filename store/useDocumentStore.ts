import { create } from 'zustand';

export type TemplateType = 'rent_agreement' | 'affidavit';
export type EditMode = 'form' | 'direct';

interface DocumentState {
  activeTemplate: TemplateType;
  editMode: EditMode;
  zoom: number;
  data: {
    rent_agreement: any;
    affidavit: any;
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

export const useDocumentStore = create<DocumentState>((set) => ({
  activeTemplate: 'rent_agreement',
  editMode: 'form',
  zoom: 100,
  data: {
    rent_agreement: initialRentAgreement,
    affidavit: initialAffidavit,
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
      // Simple path resolution (e.g., 'landlord.name')
      const targetData = { ...state.data[template] };
      const keys = fieldPath.split('.');
      
      if (keys.length === 1) {
        targetData[keys[0]] = value;
      } else if (keys.length === 2) {
        targetData[keys[0]] = { ...targetData[keys[0]], [keys[1]]: value };
      }
      // Note: for deep nesting (>2) we'd need a more robust setter, but this suffices for our structure

      return {
        data: {
          ...state.data,
          [template]: targetData,
        }
      };
    }),
}));
