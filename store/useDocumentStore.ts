import { PaperFormatId } from '@/lib/paper-formats';
import { create } from 'zustand';

export type TemplateType = 'rent_agreement' | 'affidavit' | 'sale_deed' | 'plot_agreement' | 'ssc_memo_affidavit' | 'cdma_death_correction' | 'lease_deed' | 'sbi_alias_general' | 'single_women_affidavit' | 'cv_resume' | 'identity_card' | 'bob_gold_loan_indemnity' | 'pan_instant_signature_affidavit' | 'ai_scanned_document';
export type EditMode = 'form' | 'direct';

export type IdCardSide = 'front' | 'back' | 'both';

interface DocumentState {
  activeTemplate: TemplateType;
  editMode: EditMode;
  paperFormat: PaperFormatId;
  language: 'en' | 'te';
  zoom: number;
  idCardSide: IdCardSide;
  activeIdCardType: string;
  directContent: Record<string, string>;
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
    cv_resume: any;
    identity_card: any;
    bob_gold_loan_indemnity: any;
    pan_instant_signature_affidavit: any;
    ai_scanned_document: any;
  };
  setActiveTemplate: (template: TemplateType) => void;
  setEditMode: (mode: EditMode) => void;
  setPaperFormat: (format: PaperFormatId) => void;
  setLanguage: (lang: 'en' | 'te') => void;
  setZoom: (zoom: number) => void;
  setIdCardSide: (side: IdCardSide) => void;
  setActiveIdCardType: (type: string) => void;
  setDirectContent: (template: string, html: string) => void;
  updateData: (template: TemplateType, newData: any) => void;
  updateField: (template: TemplateType, fieldPath: string, value: any) => void;
  addStatement: (template: TemplateType, statement?: string) => void;
  removeStatement: (template: TemplateType, index: number) => void;
  updateStatement: (template: TemplateType, index: number, value: string) => void;
  resetSessionState: () => void;
  loadDocumentSnapshot: (template: TemplateType, snapshot: any) => void;
  addCvWorkExperience: () => void;
  removeCvWorkExperience: (index: number) => void;
  addCvWorkPoint: (workIndex: number, point?: string) => void;
  removeCvWorkPoint: (workIndex: number, pointIndex: number) => void;
  addCvEducation: () => void;
  removeCvEducation: (index: number) => void;
  addCvEducationDetail: (eduIndex: number, detail?: string) => void;
  removeCvEducationDetail: (eduIndex: number, detailIndex: number) => void;
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

const initialCvResume = {
  photo: '/assets/default_cv_avatar.png',
  fullName: 'BENJAMIN SHAH',
  address: '123 Anywhere St., Any City',
  phone: '123-456-7890',
  email: 'hello@reallygreatsite.com',
  website: 'www.reallygreatsite.com',
  summary: 'Results-oriented Mechanical and Mechatronics Engineer seeking a challenging position to apply expertise in designing and implementing innovative solutions for complex engineering challenges. Proven track record of success in project management, problem-solving, and cross-functional collaboration. Adept at utilising cutting-edge technologies to optimise processes and enhance overall efficiency.',
  workExperience: [
    {
      role: 'Mechatronics Engineer',
      company: 'Borcelle Technologies',
      duration: 'Jan 2023 - Present',
      points: [
        'Led development of an advanced automation system, achieving a 15% increase in operational efficiency.',
        'Streamlined manufacturing processes, reducing production costs by 10%.',
        'Implemented preventive maintenance strategies, resulting in a 20% decrease in equipment downtime.'
      ]
    },
    {
      role: 'System Engineer',
      company: 'Arrowai Industries',
      duration: 'Feb 2021 - Dec 2022',
      points: [
        'Designed and optimised a robotic control system, realizing a 12% performance improvement.',
        'Coordinated testing and validation, ensuring compliance with industry standards.',
        'Provided technical expertise, contributing to a 15% reduction in system failures.'
      ]
    },
    {
      role: 'Junior Project Engineer',
      company: 'Salford & Co Manufacturing',
      duration: 'Mar 2020 - Jan 2021',
      points: [
        'Managed full lifecycle of a cutting-edge automation project, meeting all milestones.',
        'Conducted feasibility studies and risk assessments, mitigating potential project risks.',
        'Collaborated with clients, leading to a 25% increase in customer satisfaction.'
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Mechatronics Engineering with Honours',
      institution: 'University of Engineering Excellence',
      duration: 'Aug 2016 - Oct 2019',
      details: [
        'Major in Automotive Technology.',
        'Thesis on "Technological Advancements within the current Mechatronics Industry".'
      ]
    },
    {
      degree: 'Diploma in Mechanical Engineering',
      institution: 'Engineering University',
      duration: 'May 2014 - May 2016',
      details: [
        'Relevant coursework in Structural Design and Project Management.'
      ]
    }
  ],
  additionalInfo: {
    technicalSkills: 'Mechatronics System Integration, Automotive Engineering Technology, Project Management, Robotics and Automation, CAD for Mechatronics.',
    languages: 'English, Malay, Japan.',
    certifications: 'Professional Engineer (PE) License, Project Management Professional (PMP).',
    awards: 'Actively participated in the "Innovation for Tomorrow" community outreach program, promoting STEM education and inspiring local students.'
  }
};

const initialIdentityCard = {
  cardType: 'govt_id',
  front: {
    photo: '/assets/default_id_photo.png',
    logo: '/assets/telangana_logo.png',
    headerGovt: 'GOVERNMENT OF TELANGANA STATE',
    headerDept: 'PANCHAYATHRAJ DEPARTMENT',
    cardTitle: 'IDENTITY CARD',
    name: 'Pradhyumn Dhondi',
    fatherName: 'Jagadeeshwar Dhondi',
    dob: '30/08/2004',
    designation: 'Secretary',
    placeOfWorking: 'Armoor, 503224',
    authorityTitle: 'MPDO, Aloor',
  },
  back: {
    employeeId: '02738492',
    dateOfAppointment: '09/09/2026',
    panNo: 'COBPV4782D',
    aadharNo: '2939 2038 3232 9183',
    bloodGroup: 'B+',
    residentialAddress: 'H.No 2-39/43, Housing Board Colony, Vidyanagar, Armoor, 503224, Dist. Nizamabad, Telangana',
    mobileNumber: '+91 9966701124',
    signText: 'Sign. of the employee',
  },
  // Multi-card profiles
  cards: {
    govt_id: {
      name: 'Pradhyumn Dhondi',
      fatherName: 'Jagadeeshwar Dhondi',
      dob: '30/08/2004',
      designation: 'Secretary',
      placeOfWorking: 'Armoor, 503224',
      authorityTitle: 'MPDO, Aloor',
      photo: '/assets/default_id_photo.png',
      logo: '/assets/telangana_logo.png',
      headerGovt: 'GOVERNMENT OF TELANGANA STATE',
      headerDept: 'PANCHAYATHRAJ DEPARTMENT',
      cardTitle: 'IDENTITY CARD',
      address: 'H.No. 4-82, Main Road, Armoor, Nizamabad Dist - 503224',
      idNumber: 'TS/PRD/SEC/084',
    },
    aadhaar: {
      name: 'Pradhyumn Dhondi',
      dob: '30/08/2004',
      gender: 'MALE',
      aadharNumber: '6469 4213 5938',
      photo: '/assets/default_id_photo.png',
      logo: '/assets/telangana_logo.png',
      address: 'S/O Jagadeeshwar Dhondi, 4-82, Main Bazar, Armoor, Nizamabad, Telangana - 503224',
      headerGovt: 'GOVERNMENT OF INDIA',
      headerDept: 'UNIQUE IDENTIFICATION AUTHORITY OF INDIA',
      cardTitle: 'AADHAAR CARD',
    },
    pan: {
      name: 'PRADHYUMN DHONDI',
      fatherName: 'JAGADEESHWAR DHONDI',
      dob: '30/08/2004',
      panNumber: 'ABCDE1234F',
      photo: '/assets/default_id_photo.png',
      logo: '/assets/telangana_logo.png',
      headerGovt: 'INCOME TAX DEPARTMENT',
      headerDept: 'GOVT. OF INDIA',
      cardTitle: 'PERMANENT ACCOUNT NUMBER CARD',
    },
    voter: {
      name: 'Pradhyumn Dhondi',
      fatherName: 'Jagadeeshwar Dhondi',
      gender: 'MALE',
      epicNumber: 'TSZ1234567',
      photo: '/assets/default_id_photo.png',
      logo: '/assets/telangana_logo.png',
      headerGovt: 'ELECTION COMMISSION OF INDIA',
      headerDept: 'ELECTOR PHOTO IDENTITY CARD',
      cardTitle: 'VOTER ID CARD',
      address: 'H.No 4-82, Armoor, Nizamabad - 503224',
    },
    driving: {
      name: 'PRADHYUMN DHONDI',
      fatherName: 'JAGADEESHWAR DHONDI',
      dob: '30/08/2004',
      dlNumber: 'TS-16 20220008456',
      validTill: '29/08/2044',
      vehicleClass: 'MCWG, LMV',
      photo: '/assets/default_id_photo.png',
      logo: '/assets/telangana_logo.png',
      headerGovt: 'TELANGANA TRANSPORT DEPARTMENT',
      headerDept: 'UNION OF INDIA',
      cardTitle: 'DRIVING LICENCE',
      address: 'Armoor, Nizamabad, Telangana - 503224',
    }
  }
};


const initialBobGoldLoanIndemnity = {
  bankName: 'Bank of Baroda',
  branchName: 'Armoor Branch',
  district: 'Dist. Nizamabad',
  sanctionDate: '12-05-2024',
  accountNo: '12340100098765',
  loanAmount: '1,50,000',
  loanAmountWords: 'One Lakh Fifty Thousand',
  borrowerName: 'CHINTHA RAMESH',
  fatherName: 'CHINTHA SAYANNA',
  village: 'Govindpet',
  mandal: 'Armoor',
  durationMonths: '12',
  datedDay: '18',
  datedMonth: 'September',
  datedYear: '2026',
  witness1: '1. G. Suresh, Armoor',
  witness2: '2. M. Rajesh, Govindpet',
};

const initialPanInstantSignatureAffidavit = {
  name: 'BANDAMIDI AJAY',
  fatherName: 'BANDAMIDI SATHYAM',
  age: '30',
  hNo: '2-100',
  village: 'GOVINDPET',
  mandal: 'ARMOOR',
  district: 'Nizambad',
  state: 'Telangana State',
  pincode: '503224',
  panNumber: 'DRWPA3601K',
  aadharNumber: 'XXXX XXXX 6627',
  swornDate: '13-01-2026',
  swornPlace: 'ARMOOR',
};

export const useDocumentStore = create<DocumentState>((set) => ({
  activeTemplate: 'rent_agreement',
  editMode: 'form',
  paperFormat: 'a4',
  language: 'en',
  zoom: 100,
  idCardSide: 'both',
  activeIdCardType: 'govt_id',
  directContent: {},
  setPaperFormat: (format) => set({ paperFormat: format }),
  setLanguage: (lang) => set({ language: lang }),
  setIdCardSide: (side) => set({ idCardSide: side }),
  setActiveIdCardType: (type) => set({ activeIdCardType: type }),
  setDirectContent: (template, html) =>
    set((state) => ({
      directContent: {
        ...state.directContent,
        [template]: html,
      },
    })),
  addStatement: (template, statement = 'I state that the above declaration is true and verified.') =>
    set((state) => {
      const targetData = structuredClone(state.data[template]);
      if (!Array.isArray(targetData.statements)) {
        targetData.statements = [];
      }
      targetData.statements.push(statement);
      return {
        data: {
          ...state.data,
          [template]: targetData,
        },
      };
    }),
  removeStatement: (template, index) =>
    set((state) => {
      const targetData = structuredClone(state.data[template]);
      if (Array.isArray(targetData.statements)) {
        targetData.statements.splice(index, 1);
      }
      return {
        data: {
          ...state.data,
          [template]: targetData,
        },
      };
    }),
  updateStatement: (template, index, value) =>
    set((state) => {
      const targetData = structuredClone(state.data[template]);
      if (Array.isArray(targetData.statements) && targetData.statements[index] !== undefined) {
        targetData.statements[index] = value;
      }
      return {
        data: {
          ...state.data,
          [template]: targetData,
        },
      };
    }),
  loadDocumentSnapshot: (template, snapshot) =>
    set((state) => ({
      activeTemplate: template,
      data: {
        ...state.data,
        [template]: snapshot,
      },
    })),
  resetSessionState: () =>
    set({
      editMode: 'form',
      paperFormat: 'a4',
      language: 'en',
      zoom: 100,
      idCardSide: 'both',
      activeIdCardType: 'govt_id',
      directContent: {},
    }),
  addCvWorkExperience: () =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (!Array.isArray(cv.workExperience)) cv.workExperience = [];
      cv.workExperience.push({
        role: 'Job Role / Title',
        company: 'Organization Name',
        duration: 'Jan 2024 - Present',
        points: ['Accomplished key milestones and deliverables.'],
      });
      return { data: { ...state.data, cv_resume: cv } };
    }),
  removeCvWorkExperience: (index) =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (Array.isArray(cv.workExperience)) {
        cv.workExperience.splice(index, 1);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
  addCvWorkPoint: (workIndex, point = 'Contributed to project delivery.') =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (cv.workExperience && cv.workExperience[workIndex]) {
        if (!Array.isArray(cv.workExperience[workIndex].points)) {
          cv.workExperience[workIndex].points = [];
        }
        cv.workExperience[workIndex].points.push(point);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
  removeCvWorkPoint: (workIndex, pointIndex) =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (cv.workExperience && cv.workExperience[workIndex] && Array.isArray(cv.workExperience[workIndex].points)) {
        cv.workExperience[workIndex].points.splice(pointIndex, 1);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
  addCvEducation: () =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (!Array.isArray(cv.education)) cv.education = [];
      cv.education.push({
        degree: 'Degree / Certificate',
        institution: 'Institution / College',
        duration: '2020 - 2024',
        details: ['Passed with distinction / high GPA.'],
      });
      return { data: { ...state.data, cv_resume: cv } };
    }),
  removeCvEducation: (index) =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (Array.isArray(cv.education)) {
        cv.education.splice(index, 1);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
  addCvEducationDetail: (eduIndex, detail = 'Relevant academic coursework.') =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (cv.education && cv.education[eduIndex]) {
        if (!Array.isArray(cv.education[eduIndex].details)) {
          cv.education[eduIndex].details = [];
        }
        cv.education[eduIndex].details.push(detail);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
  removeCvEducationDetail: (eduIndex, detailIndex) =>
    set((state) => {
      const cv = structuredClone(state.data.cv_resume);
      if (cv.education && cv.education[eduIndex] && Array.isArray(cv.education[eduIndex].details)) {
        cv.education[eduIndex].details.splice(detailIndex, 1);
      }
      return { data: { ...state.data, cv_resume: cv } };
    }),
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
    cv_resume: initialCvResume,
    identity_card: initialIdentityCard,
    bob_gold_loan_indemnity: initialBobGoldLoanIndemnity,
    pan_instant_signature_affidavit: initialPanInstantSignatureAffidavit,
    ai_scanned_document: {},
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
