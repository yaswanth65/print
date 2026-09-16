'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocumentStore, TemplateType } from '@/store/useDocumentStore';
import {
  FileText,
  ClipboardList,
  LogOut,
  Folder,
  LayoutGrid,
  List,
  Search,
  Bell,
  Plus,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  Pencil,
  ChevronRight,
  TrendingUp,
  DollarSign,
  User,
  Monitor,
  Printer,
  FileCheck,
  Building,
  ScrollText,
  Calendar,
  Phone,
  Layers,
  Sparkles,
  CreditCard,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Lock,
  Check
} from 'lucide-react';
import { getAllPricing, saveDocumentPrice, resetDocumentPrices, formatINR } from '@/lib/pricing';
import { getWorkOrders, createWorkOrder, updateWorkOrderStatus, getOperators, loginOperator, logoutOperator, getSession } from '@/app/actions/work-orders';

interface WorkOrder {
  id: string;
  wo_number: string;
  customer_name: string;
  customer_contact: string;
  document_type: string;
  wo_amount: number;
  amount_paid: number;
  amount_due: number;
  due_date: string | null;
  status: string;
  internal_notes?: string | null;
  created_by?: string | null;
  system_name?: string | null;
  created_at: Date | string | null;
}

const TEMPLATE_DOCUMENTS = [
  {
    id: 'identity_card' as TemplateType,
    name: 'Government Identity Card',
    category: 'Official ID / Passes',
    folder: 'ID Cards',
    pages: '1 Card (Front + Back)',
    lastModified: '15 Sep, 2026',
    icon: CreditCard,
    badge: 'Dual Upload',
    desc: 'Government of Telangana Panchayathraj Dept ID card with emblem, photo & CR80 specs.',
  },
  {
    id: 'cv_resume' as TemplateType,
    name: 'Curriculum Vitae (CV / Resume)',
    category: 'Employment & Career',
    folder: 'CV & Resume',
    pages: '1 Page',
    lastModified: '15 Sep, 2026',
    icon: User,
    badge: 'Photo Upload',
    desc: 'Professional engineering/general curriculum vitae with photo, work history & skills.',
  },
  {
    id: 'bob_gold_loan_indemnity' as TemplateType,
    name: 'BOB Gold Loan Appraisal Sheet Lost Indemnity Letter',
    category: 'Banking / Legal Affidavits',
    folder: 'Bank Affidavits',
    pages: '1 Page',
    lastModified: '16 Sep, 2026',
    icon: ScrollText,
    badge: 'Bank of Baroda',
    desc: 'Appendix IV lost / misplaced gold loan appraisal sheet borrower copy indemnity letter.',
  },
  {
    id: 'pan_instant_signature_affidavit' as TemplateType,
    name: 'PAN Card Instant Signature Loan Affidavit',
    category: 'Banking / Legal Affidavits',
    folder: 'Affidavits',
    pages: '1 Page',
    lastModified: '16 Sep, 2026',
    icon: ScrollText,
    badge: 'PAN / Loan',
    desc: 'Affidavit-cum-declaration for instant PAN card without signature matching loan application.',
  },
  {
    id: 'single_women_affidavit' as TemplateType,
    name: 'Single Women (Ontari Mahila) Affidavit',
    category: 'Welfare / Affidavits',
    folder: 'Affidavits',
    pages: '1 Page',
    lastModified: '13 Sep, 2026',
    icon: ScrollText,
    badge: 'Welfare Scheme',
    desc: 'Ontari Mahila (Single Women) scheme affidavit for government pension & social security.',
  },
  {
    id: 'sbi_alias_general' as TemplateType,
    name: 'SBI Alias Declaration Affidavit',
    category: 'Banking / Legal Affidavits',
    folder: 'Bank Affidavits',
    pages: '1 Page',
    lastModified: '14 Sep, 2026',
    icon: ScrollText,
    badge: 'SBI / Bank',
    desc: 'General alias affidavit declaring that multiple name variations belong to the same person.',
  },
  {
    id: 'ssc_memo_affidavit' as TemplateType,
    name: 'SSC Memo Lost Affidavit',
    category: 'Education / Affidavits',
    folder: 'Affidavits',
    pages: '1 Page',
    lastModified: '12 Sep, 2026',
    icon: ScrollText,
    badge: 'Education',
    desc: 'Sworn affidavit regarding the accidental loss of original Secondary School Certificate marks memo.',
  },
  {
    id: 'affidavit' as TemplateType,
    name: 'General Sworn Affidavit',
    category: 'Legal / Affidavits',
    folder: 'Affidavits',
    pages: '1 Page',
    lastModified: '08 Sep, 2026',
    icon: ScrollText,
    badge: 'Notary',
    desc: 'Universal notary sworn declaration for proof of date of birth, address, or identification.',
  },
  {
    id: 'lease_deed' as TemplateType,
    name: 'Lease Deed (Commercial / Mulgie)',
    category: 'Property & Agreements',
    folder: 'Property Deeds',
    pages: '2 Pages',
    lastModified: '14 Sep, 2026',
    icon: Building,
    badge: 'Legal / Stamp',
    desc: 'Commercial shop/mulgie lease agreement with comprehensive terms, deposit & signatures.',
  },
  {
    id: 'rent_agreement' as TemplateType,
    name: 'Residential Rent Agreement (Draft)',
    category: 'Property & Agreements',
    folder: 'Property Deeds',
    pages: '2 Pages',
    lastModified: '10 Sep, 2026',
    icon: Building,
    badge: 'Rental',
    desc: 'Standard 11-month residential tenancy agreement between landlord and tenant.',
  },
  {
    id: 'sale_deed' as TemplateType,
    name: 'Sale Deed (Immovable Property)',
    category: 'Property & Agreements',
    folder: 'Property Deeds',
    pages: '3 Pages',
    lastModified: '05 Sep, 2026',
    icon: Building,
    badge: 'Conveyance',
    desc: 'Conveyance sale deed for registered transfer of absolute ownership of immovable property.',
  },
  {
    id: 'plot_agreement' as TemplateType,
    name: 'Plot Sale Agreement',
    category: 'Property & Agreements',
    folder: 'Property Deeds',
    pages: '2 Pages',
    lastModified: '01 Sep, 2026',
    icon: Building,
    badge: 'Real Estate',
    desc: 'Agreement for sale of residential/commercial open plot with boundary specifications.',
  },
  {
    id: 'cdma_death_correction' as TemplateType,
    name: 'CDMA Death Corrections Application Form',
    category: 'Government / Municipal Forms',
    folder: 'Govt Forms',
    pages: '1 Page',
    lastModified: '15 Sep, 2026',
    icon: FileText,
    badge: 'Official CDMA',
    desc: 'Government municipal corporation application for corrections in death registration.',
  },
];

// Categorized Submenu structure for quick search & navbar navigation
const NAVBAR_MENU_CATEGORIES = [
  {
    name: 'ID Cards & Badges',
    icon: CreditCard,
    items: [
      { id: 'identity_card' as TemplateType, label: 'Government Identity Card (TS Govt)', badge: 'CR80 / Dual' },
      { id: 'cv_resume' as TemplateType, label: 'Curriculum Vitae (CV / Resume)', badge: 'Photo & Skills' },
    ],
  },
  {
    name: 'Legal Affidavits',
    icon: ScrollText,
    items: [
      { id: 'bob_gold_loan_indemnity' as TemplateType, label: 'BOB Gold Loan Lost Appraisal Indemnity', badge: 'BOB' },
      { id: 'pan_instant_signature_affidavit' as TemplateType, label: 'PAN Card Instant Signature Loan Affidavit', badge: 'PAN' },
      { id: 'single_women_affidavit' as TemplateType, label: 'Single Women (Ontari Mahila) Affidavit', badge: 'Welfare' },
      { id: 'sbi_alias_general' as TemplateType, label: 'SBI Alias Declaration Affidavit', badge: 'Bank' },
      { id: 'ssc_memo_affidavit' as TemplateType, label: 'SSC Memo Lost Affidavit', badge: 'Education' },
      { id: 'affidavit' as TemplateType, label: 'General Sworn Affidavit', badge: 'Notary' },
    ],
  },
  {
    name: 'Property & Agreements',
    icon: Building,
    items: [
      { id: 'rent_agreement' as TemplateType, label: 'Residential Rent Agreement (Draft)', badge: 'Rental' },
      { id: 'lease_deed' as TemplateType, label: 'Commercial Lease Deed (Mulgie)', badge: 'Stamp' },
      { id: 'plot_agreement' as TemplateType, label: 'Plot Sale Agreement', badge: 'Real Estate' },
      { id: 'sale_deed' as TemplateType, label: 'Conveyance Sale Deed', badge: 'Deed' },
    ],
  },
  {
    name: 'Government & Municipal',
    icon: FileCheck,
    items: [
      { id: 'cdma_death_correction' as TemplateType, label: 'CDMA Death Corrections Form', badge: 'Municipal' },
    ],
  },
];

  // Exact 5 Operators requested (Using dummy UUIDs for static fallback to pass regex validation if DB fails)
  const OPERATORS_LIST = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Jagadeeshwar Dhondi', role: 'Senior Operator' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Pradhyumn Dhondi', role: 'Chief Operator' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Poshetty', role: 'Legal Documentation' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Vennela', role: 'Forms & DTP' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Manikanta', role: 'General Operator' },
  ];

const SYSTEMS_LIST = [
  'System 1',
  'System 2',
  'System 3',
  'System 4',
  'System 5',
];

export default function RootDashboard() {
  const router = useRouter();
  const { setActiveTemplate, resetSessionState } = useDocumentStore();

  // Auth / Session State
  const [currentOperator, setCurrentOperator] = useState<{ id: string; name: string; system: string; role?: string } | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('System 1');
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Operators from the database (getOperators). Falls back to the static
  // catalogue only when the DB is unavailable/empty.
  const [dbOperators, setDbOperators] = useState<Array<{ id: string; name: string; role: string | null; system_name: string | null }>>([]);
  const [operatorsLoadError, setOperatorsLoadError] = useState('');
  const operatorsList = dbOperators.length > 0 ? dbOperators : OPERATORS_LIST;

  // Switch User Modal State
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [switchTargetSystem, setSwitchTargetSystem] = useState('System 1');
  const [switchTargetOperatorId, setSwitchTargetOperatorId] = useState('');
  const [switchPin, setSwitchPin] = useState('');
  const [switchError, setSwitchError] = useState('');
  const [switchLoading, setSwitchLoading] = useState(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'files' | 'orders' | 'history' | 'pricing'>('files');

  // History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyOperatorFilter, setHistoryOperatorFilter] = useState('All');

  // Pricing State
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [pricingSearch, setPricingSearch] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceVal, setEditingPriceVal] = useState<number>(100);

  // Files View Controls
  const [fileViewMode, setFileViewMode] = useState<'list' | 'grid'>('list');
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');

  // Navbar Quick Menu & Search State
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [navMenuSearch, setNavMenuSearch] = useState('');
  const navMenuRef = useRef<HTMLDivElement>(null);

  // Work Orders State
  const [workOrdersList, setWorkOrdersList] = useState<WorkOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('All Status');
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    completedOrders: 0,
    amountCollected: 0,
    amountPending: 0,
  });

  // New Work Order Modal
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customer_name: '',
    customer_contact: '',
    document_type: 'cdma_death_correction',
    wo_amount: 150,
    amount_paid: 150,
    due_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    internal_notes: '',
  });

  // Initialize Session from httpOnly cookie (server-verified)
  useEffect(() => {
    (async () => {
      try {
        const [sessionRes, opsRes] = await Promise.all([getSession(), getOperators()]);
        if (sessionRes.authenticated && sessionRes.data) {
          setCurrentOperator(sessionRes.data);
          setSelectedSystem(sessionRes.data.system || 'System 1');
        }
        if (opsRes.success && opsRes.data) {
          const ops = opsRes.data as any[];
          setDbOperators(ops);
          // Pre-select first operator if none selected yet
          setSelectedOperatorId((prev) => {
            if (prev || ops.length === 0) return prev;
            return ops[0].id;
          });
        } else {
          setOperatorsLoadError(opsRes.error || 'Could not load operators');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsAuthLoaded(true);
      }
    })();
  }, []);

  // Close nav menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setIsNavMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      if (historySearch) params.set('search', historySearch);
      if (historyOperatorFilter !== 'All') params.set('operator', historyOperatorFilter);
      const res = await fetch('/api/history?' + params.toString());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHistoryList(json.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    } else if (activeTab === 'pricing') {
      setPricingList(getAllPricing());
    }
  }, [activeTab, historyOperatorFilter]);

  const handleOpenHistoricalDocument = (item: any) => {
    try {
      const snap = typeof item.document_data === 'string' ? JSON.parse(item.document_data) : item.document_data;
      const { loadDocumentSnapshot, setActiveTemplate } = useDocumentStore.getState();
      if (loadDocumentSnapshot && item.document_type) {
        // Find the correct template ID from the document_type name string if it's the friendly name
        const docObj = TEMPLATE_DOCUMENTS.find(d => d.name === item.document_type || d.id === item.document_type);
        const templateId = docObj ? docObj.id : item.document_type;
        
        loadDocumentSnapshot(templateId as any, snap);
        setActiveTemplate(templateId as any);
      }
      router.push('/operator');
    } catch (e) {
      router.push('/operator');
    }
  };

  const handleSaveDocPrice = (docId: string, val: number) => {
    saveDocumentPrice(docId, val);
    setPricingList(getAllPricing());
    setEditingPriceId(null);
  };

  const handleResetAllPrices = () => {
    if (confirm('Reset all document prices to default rates?')) {
      resetDocumentPrices();
      setPricingList(getAllPricing());
    }
  };

  // Fetch Work Orders from Neon Database
  const loadOrders = React.useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await getWorkOrders({
        search: ordersSearch,
        status: ordersStatusFilter,
      });
      if (res.success && res.data) {
        setWorkOrdersList(res.data as WorkOrder[]);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setOrdersLoading(false);
    }
  }, [ordersSearch, ordersStatusFilter]);

  useEffect(() => {
    const canLoad = activeTab === 'orders' || currentOperator;
    if (!canLoad) return;
    // Debounce when the user is typing a search query; fire immediately
    // when only filters or tab change.
    const delay = ordersSearch.trim() ? 350 : 0;
    const t = setTimeout(() => { loadOrders(); }, delay);
    return () => clearTimeout(t);
  }, [activeTab, ordersStatusFilter, ordersSearch, currentOperator, loadOrders]);

  // Login handler (server-side PIN verification + signed session cookie)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = operatorsList.find((o) => o.id === selectedOperatorId) || operatorsList[0];
    if (!op) {
      setLoginError('No operators available. Please contact your administrator.');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await loginOperator({ operatorId: op.id, system: selectedSystem, pin });
      if (res.success && res.data) {
        setCurrentOperator(res.data);
        setPin('');
      } else {
        setLoginError(res.error || 'Failed to sign in');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Failed to sign in');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logoutOperator().catch(() => {});
    setCurrentOperator(null);
    setIsSwitchUserOpen(false);
    setSwitchPin('');
    setSwitchError('');
    resetSessionState();
  };

  // Switch User handler (re-authenticates with the target operator's PIN)
  const handleSwitchUserConfirm = async () => {
    const op = operatorsList.find((o) => o.id === switchTargetOperatorId);
    if (!op) {
      setSwitchError('Select an operator');
      return;
    }
    setSwitchLoading(true);
    setSwitchError('');
    try {
      const res = await loginOperator({ operatorId: op.id, system: switchTargetSystem, pin: switchPin });
      if (res.success && res.data) {
        resetSessionState();
        setCurrentOperator(res.data);
        setSelectedSystem(res.data.system);
        setIsSwitchUserOpen(false);
        setSwitchPin('');
        setSwitchError('');
      } else {
        setSwitchError(res.error || 'Failed to switch');
      }
    } catch (err: any) {
      setSwitchError(err.message || 'Failed to switch');
    } finally {
      setSwitchLoading(false);
    }
  };

  // Open Template in Simulator / Operator Workspace
  const handleOpenDocument = (templateId: TemplateType) => {
    setActiveTemplate(templateId);
    router.push('/operator');
  };

  // Submit New Work Order
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customer_name || !newOrderForm.customer_contact) {
      alert('Please enter customer name and phone number');
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const docObj = TEMPLATE_DOCUMENTS.find(d => d.id === newOrderForm.document_type);
      const res = await createWorkOrder({
        customer_name: newOrderForm.customer_name,
        customer_contact: newOrderForm.customer_contact,
        document_type: docObj?.name || newOrderForm.document_type,
        wo_amount: Number(newOrderForm.wo_amount) || 0,
        amount_paid: Number(newOrderForm.amount_paid) || 0,
        due_date: newOrderForm.due_date,
        status: newOrderForm.status,
        internal_notes: newOrderForm.internal_notes,
        created_by: currentOperator?.name || 'Operator',
        system_name: currentOperator?.system || 'System 1',
      });

      if (res.success) {
        setIsNewOrderOpen(false);
        setNewOrderForm({
          customer_name: '',
          customer_contact: '',
          document_type: 'cdma_death_correction',
          wo_amount: 150,
          amount_paid: 150,
          due_date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          internal_notes: '',
        });
        loadOrders();
      } else {
        alert(res.error || 'Failed to save work order');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating work order');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await updateWorkOrderStatus(id, newStatus);
    if (res.success) {
      loadOrders();
    }
  };

  // Filtered Documents in All Files View
  const filteredDocs = TEMPLATE_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
      doc.category.toLowerCase().includes(fileSearch.toLowerCase()) ||
      doc.folder.toLowerCase().includes(fileSearch.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const uniqueFolders = ['All', ...Array.from(new Set(TEMPLATE_DOCUMENTS.map((d) => d.folder)))];

  if (!isAuthLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C75FF]"></div>
      </div>
    );
  }

  // 1. LOGIN SCREEN OVERLAY IF NOT AUTHENTICATED
  if (!currentOperator) {
    return (
      <div className="min-h-screen w-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E5E5] shadow-lg p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#2C75FF] text-white flex items-center justify-center text-2xl font-black tracking-tight shadow-md mb-3">
              VX
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Varma Xerox</h1>
            <p className="text-sm text-[#525252] mt-1">Multi-Terminal Operator Portal & Workstation Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* WORKSTATION / SYSTEM SELECTION */}
            <div>
              <label className="block text-xs font-bold text-[#525252] uppercase tracking-wider mb-2">
                Select Workstation / System (1 - 5)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SYSTEMS_LIST.map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setSelectedSystem(sys)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      selectedSystem === sys
                        ? 'bg-[#2C75FF] text-white border-[#2C75FF] shadow-sm ring-2 ring-blue-200'
                        : 'bg-[#F7F7F7] text-[#0A0A0A] border-[#E5E5E5] hover:border-slate-300'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>

            {/* OPERATOR SELECTION FROM DATABASE */}
            <div>
              <label className="block text-xs font-bold text-[#525252] uppercase tracking-wider mb-2">
                Select Operator ({operatorsList.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[290px] overflow-y-auto pr-1">
                {operatorsList.length === 0 && (
                  <div className="col-span-2 p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-700">
                    {operatorsLoadError || 'No operators found. Please contact the administrator.'}
                  </div>
                )}
                {operatorsList.map((op) => (
                  <div
                    key={op.id}
                    onClick={() => setSelectedOperatorId(op.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOperatorId === op.id
                        ? 'border-[#2C75FF] bg-blue-50/70 shadow-sm ring-1 ring-[#2C75FF]'
                        : 'border-[#E5E5E5] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        selectedOperatorId === op.id
                          ? 'bg-[#2C75FF] text-white'
                          : 'bg-[#EFEEFA] text-[#2C75FF]'
                      }`}
                    >
                      {op.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#0A0A0A] truncate">{op.name}</div>
                      <div className="text-[10px] text-[#525252] truncate">{op.role || 'Operator'}</div>
                    </div>
                    {selectedOperatorId === op.id && (
                      <Check className="w-4 h-4 text-[#2C75FF] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PIN ENTRY BYPASSED */}

            {loginError && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !selectedOperatorId}
              className="w-full py-3.5 px-4 bg-[#2C75FF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loginLoading ? (
                <span>Verifying PIN...</span>
              ) : (
                <>
                  <span>Launch Terminal on {selectedSystem}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center text-xs text-[#525252] flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Central Database connected to Neon PostgreSQL
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD LAYOUT (AUTHENTICATED)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAFA] text-[#0A0A0A] font-sans antialiased">
      {/* LEFT SIDEBAR (66px) */}
      <aside className="w-[66px] bg-white border-r border-[#E5E5E5] flex flex-col items-center justify-between py-5 flex-shrink-0 z-20 shadow-xs">
        {/* Brand Logo */}
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-10 h-10 rounded-xl bg-[#2C75FF] text-white flex items-center justify-center font-black text-base shadow-sm tracking-tight cursor-pointer"
            title="Varma Xerox"
            onClick={() => setActiveTab('files')}
          >
            VX
          </div>

          {/* Navigation Icons */}
          <nav className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveTab('files')}
              title="All Documents & Files"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'files'
                  ? 'bg-blue-50 text-[#2C75FF]'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              title="Work Orders & Billing"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-50 text-[#2C75FF]'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('history')}
              title="Print & Document Save History"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-[#2C75FF]'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-slate-100'
              }`}
            >
              <Clock className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              title="Document Pricing Library"
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeTab === 'pricing'
                  ? 'bg-blue-50 text-[#2C75FF]'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveTemplate('identity_card');
                router.push('/operator');
              }}
              title="Open Varma Xerox Print Simulator"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[#525252] hover:text-[#2C75FF] hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Printer className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* User & Switch / Logout */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setIsSwitchUserOpen(true)}
            title="Switch User / Terminal"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#525252] hover:text-[#2C75FF] hover:bg-blue-50 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#525252] hover:text-[#FB3748] hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div
            className="w-9 h-9 rounded-full bg-[#EFEEFA] text-[#2C75FF] flex items-center justify-center font-bold text-xs border border-blue-100 shadow-sm cursor-pointer"
            title={`${currentOperator.name} (${currentOperator.system})`}
            onClick={() => setIsSwitchUserOpen(true)}
          >
            {currentOperator.name.charAt(0)}
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER BAR (78px) WITH SEARCH + CATEGORY MENU & SUBMENUS */}
        <header className="h-[78px] bg-white border-b border-[#E5E5E5] px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-10 shadow-xs">
          {/* Left: Terminal & Active View */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-800">
                  {activeTab === 'files' ? 'Documents & Templates' : activeTab === 'orders' ? 'Work Orders' : activeTab === 'history' ? 'History' : 'Price Library'}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mt-1">
                {currentOperator.name}
              </h2>
            </div>

            {/* QUICK CATEGORY MENU & SUBMENUS POPOVER */}
            <div className="relative ml-4" ref={navMenuRef}>
              <button
                type="button"
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Layers className="w-4 h-4 text-[#2C75FF]" />
                <span className="hidden sm:inline">Templates Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNavMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isNavMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Search inside menu */}
                  <div className="relative mb-2.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={navMenuSearch}
                      onChange={(e) => setNavMenuSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C75FF] focus:bg-white"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                    {NAVBAR_MENU_CATEGORIES.map((cat) => {
                      const CatIcon = cat.icon;
                      const matchingItems = cat.items.filter((item) =>
                        item.label.toLowerCase().includes(navMenuSearch.toLowerCase())
                      );
                      if (matchingItems.length === 0) return null;

                      return (
                        <div key={cat.name}>
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <CatIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{cat.name}</span>
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {matchingItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setIsNavMenuOpen(false);
                                  handleOpenDocument(item.id);
                                }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 cursor-pointer text-xs transition-colors group"
                              >
                                <span className="text-slate-800 font-medium group-hover:text-[#2C75FF] truncate mr-2">
                                  {item.label}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold group-hover:bg-blue-100 group-hover:text-[#2C75FF] flex-shrink-0">
                                  {item.badge}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="w-10 h-10 rounded-xl border border-[#E5E5E5] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-xl border border-[#E5E5E5] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div
              onClick={() => setIsSwitchUserOpen(true)}
              className="w-10 h-10 ml-1 rounded-full bg-[#2C75FF] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm hover:bg-blue-600 transition-colors"
              title="Click to Switch User"
            >
              {currentOperator.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE VIEW */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* TAB 1: ALL FILES / DOCUMENTS VIEW */}
          {activeTab === 'files' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Folder Pills & Search Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                  {uniqueFolders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        selectedFolder === folder
                          ? 'bg-[#0A0A0A] text-white shadow-xs'
                          : 'bg-white text-[#525252] border border-[#E5E5E5] hover:border-slate-300'
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-[#525252] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search templates & categories..."
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#2C75FF] shadow-xs"
                    />
                  </div>

                  {/* List / Grid Toggle */}
                  <div className="flex items-center p-0.5 bg-[#E9EAEB] rounded-lg border border-[#E5E5E5]">
                    <button
                      onClick={() => setFileViewMode('list')}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        fileViewMode === 'list' ? 'bg-white text-[#0A0A0A] shadow-xs' : 'text-[#525252]'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFileViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        fileViewMode === 'grid' ? 'bg-white text-[#0A0A0A] shadow-xs' : 'text-[#525252]'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST VIEW */}
              {fileViewMode === 'list' && (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#525252] font-semibold">
                      <tr>
                        <th className="py-3.5 px-5">Document Name</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Pages / Format</th>
                        <th className="py-3.5 px-4">Last Updated</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      {filteredDocs.map((doc) => {
                        const Icon = doc.icon;
                        return (
                          <tr
                            key={doc.id}
                            onClick={() => handleOpenDocument(doc.id)}
                            className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#EFEEFA] text-[#2C75FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2C75FF] group-hover:text-white transition-colors">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-semibold text-[#0A0A0A] text-sm group-hover:text-[#2C75FF] transition-colors">
                                    {doc.name}
                                  </div>
                                  <div className="text-[11px] text-[#525252]">{doc.desc}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#525252]">
                              <span className="px-2.5 py-1 rounded-full bg-[#F7F7F7] text-[#0A0A0A] font-semibold border border-[#EBEBEB]">
                                {doc.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#525252] font-medium">{doc.pages}</td>
                            <td className="py-3.5 px-4 text-[#525252]">{doc.lastModified}</td>
                            <td className="py-3.5 px-5 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDocument(doc.id);
                                }}
                                className="px-3 py-1.5 bg-white border border-[#E5E5E5] text-[#2C75FF] font-semibold rounded-lg text-xs hover:bg-[#2C75FF] hover:text-white hover:border-[#2C75FF] transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <span>Open Simulator</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* GRID VIEW */}
              {fileViewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDocs.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleOpenDocument(doc.id)}
                        className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs hover:shadow-md hover:border-[#2C75FF]/40 cursor-pointer transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EFEEFA] text-[#2C75FF] flex items-center justify-center group-hover:bg-[#2C75FF] group-hover:text-white transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7F7F7] text-[#525252] border border-[#EBEBEB]">
                              {doc.badge}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-[#0A0A0A] group-hover:text-[#2C75FF] transition-colors leading-snug">
                            {doc.name}
                          </h3>
                          <p className="text-xs text-[#525252] mt-1.5 line-clamp-2">
                            {doc.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#EBEBEB] flex items-center justify-between text-xs">
                          <span className="text-[#525252] font-medium">{doc.pages}</span>
                          <span className="text-[#2C75FF] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Open in Simulator &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORK ORDERS DASHBOARD */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* 4 KPI METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                  <div className="relative">
                    <div className="text-sm font-semibold text-slate-700 mb-4">Total Work Orders</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{metrics.totalOrders}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Till date</div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                        + 8.70%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50/30 to-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                  <div className="relative">
                    <div className="text-sm font-semibold text-slate-700 mb-4">WO Completed</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{metrics.completedOrders}</div>
                        <div className="text-[11px] text-slate-500 mt-1">from last week</div>
                      </div>
                      <div className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100">
                        - 1.06%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50/30 to-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                  <div className="relative">
                    <div className="text-sm font-semibold text-slate-700 mb-4">WO Amount Collected</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">₹{metrics.amountCollected}</div>
                        <div className="text-[11px] text-slate-500 mt-1">from last week</div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                        + 3.56%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50/30 to-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                  <div className="relative">
                    <div className="text-sm font-semibold text-slate-700 mb-4">QO Amount Pending</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">₹{metrics.amountPending}</div>
                        <div className="text-[11px] text-slate-500 mt-1">from last week</div>
                      </div>
                      <div className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100">
                        - 2.08%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDERS LIST & TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-slate-100 gap-4">
                  <h3 className="text-base font-bold text-slate-900">Work Orders List</h3>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search customer, contact, etc"
                        value={ordersSearch}
                        onChange={(e) => setOrdersSearch(e.target.value)}
                        className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    
                    <select
                      value={ordersStatusFilter}
                      onChange={(e) => setOrdersStatusFilter(e.target.value)}
                      className="py-1.5 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancel">Cancel</option>
                    </select>

                    <button className="py-1.5 px-3 text-sm rounded-lg border border-slate-200 bg-white flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                      May 31, 2026
                      <Clock className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setIsNewOrderOpen(true)}
                      className="py-1.5 px-4 text-sm font-semibold rounded-lg bg-[#2C75FF] text-white hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      New Work Order
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-200 text-slate-900 font-semibold">
                      <tr>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Work Order ID</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Customer Name</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Customer Contact</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Document Type</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">WO Amount</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Amount Paid</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Amount Due</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Due Date</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workOrdersList.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-12 text-slate-500">
                            {ordersLoading ? 'Loading work orders...' : 'No work orders found'}
                          </td>
                        </tr>
                      ) : (
                        workOrdersList.map((wo) => {
                          let badgeClass = 'bg-slate-50 text-slate-600 border-slate-200';
                          
                          if (wo.status === 'Completed' || wo.status === 'Confirmed') {
                            badgeClass = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                          } else if (wo.status === 'Pending' || wo.status === 'In Progress') {
                            badgeClass = 'text-amber-600 bg-amber-50 border-amber-100';
                          } else if (wo.status === 'Cancel' || wo.status === 'Cancelled') {
                            badgeClass = 'text-red-600 bg-red-50 border-red-100';
                          }
                          
                          return (
                            <tr key={wo.id} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-medium text-slate-700">{wo.wo_number}</td>
                              <td className="py-3 px-4 text-slate-600">{wo.customer_name}</td>
                              <td className="py-3 px-4 text-slate-500">{wo.customer_contact}</td>
                              <td className="py-3 px-4 text-slate-500">{wo.document_type}</td>
                              <td className="py-3 px-4 text-slate-700 font-medium">₹{wo.wo_amount}</td>
                              <td className="py-3 px-4 text-slate-700">₹{wo.amount_paid}</td>
                              <td className="py-3 px-4 text-slate-700 font-medium">₹{wo.amount_due}</td>
                              <td className="py-3 px-4 text-slate-500">
                                {wo.due_date ? wo.due_date.replace(/-/g, '/') : ''}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeClass}`}>
                                  {wo.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button className="text-slate-400 hover:text-slate-700 cursor-pointer" title="View details">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-slate-400 hover:text-slate-700 cursor-pointer" title="Edit status">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT HISTORY VIEW */}
          {activeTab === 'history' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2C75FF]" />
                      <span>Print & Document Save History</span>
                    </h3>
                    <p className="text-xs text-[#525252]">Comprehensive audit log of all printed and saved customer documents</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-[#525252] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search customer, phone, doc..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadHistory()}
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#2C75FF]"
                      />
                    </div>

                    <select
                      value={historyOperatorFilter}
                      onChange={(e) => setHistoryOperatorFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#0A0A0A] font-semibold focus:outline-none"
                    >
                      <option value="All">All Operators</option>
                      {operatorsList.map((op) => (
                        <option key={op.id} value={op.name}>
                          {op.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={loadHistory}
                      className="p-2 rounded-lg border border-[#E5E5E5] hover:bg-slate-50 text-[#525252] transition-colors cursor-pointer"
                      title="Refresh History"
                    >
                      <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#EBEBEB]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB] text-[#525252] font-semibold">
                      <tr>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Document Type</th>
                        <th className="py-3 px-4">Operator / Terminal</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Action Status</th>
                        <th className="py-3 px-4 text-right">Re-open</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      {historyList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-[#525252]">
                            {historyLoading ? 'Loading history records...' : 'No historical print/save records found'}
                          </td>
                        </tr>
                      ) : (
                        historyList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {item.created_at ? new Date(item.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#0A0A0A]">{item.customer_name}</div>
                              <div className="text-[11px] text-[#525252] font-mono">{item.customer_contact}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800">{item.document_name || item.document_type}</span>
                            </td>
                            <td className="py-3 px-4 text-[#525252]">
                              <div>{item.operator_name}</div>
                              <div className="text-[10px] text-slate-400">{item.system_name}</div>
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-600">
                              ₹{item.amount || 0}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  item.status === 'Printed'
                                    ? 'bg-blue-50 text-[#2C75FF] border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {item.status || 'Saved'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleOpenHistoricalDocument(item)}
                                className="px-3 py-1 bg-slate-100 hover:bg-[#2C75FF] hover:text-white rounded-lg text-slate-700 font-semibold transition text-[11px] cursor-pointer"
                              >
                                Load in Editor
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING LIBRARY VIEW */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Price Library</h3>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search document name..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-200 text-slate-900 font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-6 font-semibold">Document Name</th>
                        <th className="py-3 px-6 font-semibold w-32">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(pricingList.length > 0 ? pricingList : getAllPricing()).map((item) => {
                        const isEditing = editingPriceId === item.id;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-3 px-6 text-slate-500 font-medium">
                              {item.name}
                            </td>
                            <td className="py-3 px-6">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={editingPriceVal}
                                    onChange={(e) => setEditingPriceVal(Number(e.target.value))}
                                    className="w-16 px-1 py-0.5 text-sm border border-blue-400 rounded"
                                    autoFocus
                                    onBlur={() => handleSaveDocPrice(item.id, editingPriceVal)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveDocPrice(item.id, editingPriceVal);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="cursor-pointer font-semibold text-slate-700" 
                                  onClick={() => {
                                    setEditingPriceId(item.id);
                                    setEditingPriceVal(item.defaultPrice);
                                  }}
                                >
                                  {formatINR(item.defaultPrice)}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600 bg-white">
                  <div>Total Costing Items: {pricingList.length || getAllPricing().length}</div>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-1 border border-slate-200 rounded text-slate-400 cursor-pointer hover:bg-slate-50">&lt;</button>
                    <button className="px-3 py-1 border border-blue-200 bg-blue-50 text-blue-600 rounded font-medium cursor-pointer">1</button>
                    <button className="px-3 py-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">2</button>
                    <button className="px-3 py-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">3</button>
                    <button className="px-3 py-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">4</button>
                    <button className="px-3 py-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">5</button>
                    <button className="px-2 py-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">&gt;</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Show per Page:</span>
                    <select className="border border-slate-200 rounded p-1 text-slate-700 focus:outline-none bg-white">
                      <option>10</option>
                      <option>20</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SWITCH USER / WORKSTATION MODAL */}
      {isSwitchUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2C75FF] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Switch Operator</h3>
                  <p className="text-xs text-slate-500">Re-authenticate with the target operator&apos;s PIN</p>
                </div>
              </div>
              <button
                onClick={() => setIsSwitchUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Select Workstation
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {SYSTEMS_LIST.map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setSwitchTargetSystem(sys)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        switchTargetSystem === sys
                          ? 'bg-[#2C75FF] text-white border-[#2C75FF]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {sys.replace('System ', 'Sys ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Select Operator
                </label>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {operatorsList.map((op) => (
                    <div
                      key={op.id}
                      onClick={() => setSwitchTargetOperatorId(op.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        switchTargetOperatorId === op.id
                          ? 'border-[#2C75FF] bg-blue-50/70 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2C75FF] flex items-center justify-center font-bold text-xs">
                          {op.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-800">{op.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{op.role || 'Operator'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Operator PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  value={switchPin}
                  onChange={(e) => setSwitchPin(e.target.value)}
                  placeholder="Enter target operator PIN to continue"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2C75FF]"
                />
              </div>

              {switchError && (
                <div className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600">
                  {switchError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSwitchUserOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSwitchUserConfirm}
                  disabled={switchLoading || !switchPin}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2C75FF] hover:bg-blue-600 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {switchLoading ? 'Verifying...' : `Switch to ${switchTargetSystem}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW WORK ORDER MODAL */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Customer Work Order</h3>
              <button
                onClick={() => setIsNewOrderOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customer_name}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_name: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customer_contact}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_contact: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Document Type</label>
                <select
                  value={newOrderForm.document_type}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, document_type: e.target.value })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {TEMPLATE_DOCUMENTS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={newOrderForm.wo_amount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, wo_amount: Number(e.target.value) })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={newOrderForm.amount_paid}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, amount_paid: Number(e.target.value) })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newOrderForm.due_date}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, due_date: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newOrderForm.internal_notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, internal_notes: e.target.value })}
                  placeholder="Special instructions for printing, stamps, or document format..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2C75FF] hover:bg-blue-600 rounded-xl shadow-xs"
                >
                  {isSubmittingOrder ? 'Saving...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
