export interface DocumentPricingItem {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  description: string;
}

export const DEFAULT_DOCUMENT_PRICING: Record<string, DocumentPricingItem> = {
  identity_card: {
    id: 'identity_card',
    name: 'Government Identity Card',
    category: 'Official ID / Passes',
    defaultPrice: 100,
    description: 'PVC / Photo Identity Card with front & back printing',
  },
  cv_resume: {
    id: 'cv_resume',
    name: 'Curriculum Vitae (CV / Resume)',
    category: 'Employment & Career',
    defaultPrice: 60,
    description: 'Professional Resume with photo & career formatting',
  },
  bob_gold_loan_indemnity: {
    id: 'bob_gold_loan_indemnity',
    name: 'BOB Gold Loan Lost Appraisal Indemnity',
    category: 'Banking / Legal Affidavits',
    defaultPrice: 150,
    description: 'Bank of Baroda lost appraisal sheet indemnity letter',
  },
  pan_instant_signature_affidavit: {
    id: 'pan_instant_signature_affidavit',
    name: 'PAN Card Instant Signature Loan Affidavit',
    category: 'Banking / Legal Affidavits',
    defaultPrice: 150,
    description: 'Instant PAN signature verification affidavit',
  },
  single_women_affidavit: {
    id: 'single_women_affidavit',
    name: 'Single Women (Ontari Mahila) Affidavit',
    category: 'Welfare / Affidavits',
    defaultPrice: 100,
    description: 'Ontari Mahila pension scheme notary declaration',
  },
  sbi_alias_general: {
    id: 'sbi_alias_general',
    name: 'SBI Alias Declaration Affidavit',
    category: 'Banking / Legal Affidavits',
    defaultPrice: 150,
    description: 'Bank name mismatch & alias name sworn affidavit',
  },
  ssc_memo_affidavit: {
    id: 'ssc_memo_affidavit',
    name: 'SSC Memo Lost Affidavit',
    category: 'Education / Affidavits',
    defaultPrice: 150,
    description: 'Lost 10th marks memo duplicate issue affidavit',
  },
  affidavit: {
    id: 'affidavit',
    name: 'General Sworn Affidavit',
    category: 'Legal / Affidavits',
    defaultPrice: 100,
    description: 'Standard notary sworn affidavit for name/dob/address',
  },
  rent_agreement: {
    id: 'rent_agreement',
    name: 'Residential Rent Agreement',
    category: 'Property & Agreements',
    defaultPrice: 300,
    description: '11-month residential tenancy legal agreement',
  },
  lease_deed: {
    id: 'lease_deed',
    name: 'Commercial Lease Deed',
    category: 'Property & Agreements',
    defaultPrice: 500,
    description: 'Commercial shop / mulgie lease deed agreement',
  },
  sale_deed: {
    id: 'sale_deed',
    name: 'Conveyance Sale Deed',
    category: 'Property & Agreements',
    defaultPrice: 1000,
    description: 'Immovable property absolute sale deed draft',
  },
  plot_agreement: {
    id: 'plot_agreement',
    name: 'Plot Sale Agreement',
    category: 'Property & Agreements',
    defaultPrice: 500,
    description: 'Residential / open layout plot purchase agreement',
  },
  cdma_death_correction: {
    id: 'cdma_death_correction',
    name: 'CDMA Death Corrections Application Form',
    category: 'Government / Municipal Forms',
    defaultPrice: 100,
    description: 'Municipal corporation death registry correction petition',
  },
};

const STORAGE_KEY = 'vx_custom_pricing_v1';

export function getAllPricing(): DocumentPricingItem[] {
  if (typeof window === 'undefined') {
    return Object.values(DEFAULT_DOCUMENT_PRICING);
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const overrides = JSON.parse(stored);
      return Object.values(DEFAULT_DOCUMENT_PRICING).map((item) => ({
        ...item,
        defaultPrice: overrides[item.id] !== undefined ? overrides[item.id] : item.defaultPrice,
      }));
    }
  } catch (e) {
    console.error('Failed to read custom pricing from localStorage:', e);
  }
  return Object.values(DEFAULT_DOCUMENT_PRICING);
}

export function getDocumentPrice(docId: string): number {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const overrides = JSON.parse(stored);
        if (overrides[docId] !== undefined) {
          return Number(overrides[docId]);
        }
      }
    } catch {}
  }
  return DEFAULT_DOCUMENT_PRICING[docId]?.defaultPrice ?? 100;
}

export function saveDocumentPrice(docId: string, newPrice: number): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const overrides = stored ? JSON.parse(stored) : {};
    overrides[docId] = Math.max(0, Number(newPrice) || 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save document price:', e);
  }
}

export function resetDocumentPrices(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
