'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
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
  Sparkles
} from 'lucide-react';
import { getWorkOrders, createWorkOrder, updateWorkOrderStatus } from '@/app/actions/work-orders';

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
    id: 'single_women_affidavit' as TemplateType,
    name: 'Single Women (Ontari Mahila) Affidavit',
    category: 'Welfare / Affidavits',
    folder: 'Govt Forms',
    pages: '1 Page',
    lastModified: '13 Sep, 2026',
    icon: FileCheck,
    badge: 'Welfare Scheme',
    desc: 'Ontari Mahila (Single Women) scheme affidavit for government pension & social security.',
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
];

const OPERATORS_LIST = [
  { id: '1', name: 'Ravi Kumar', system: 'System 1', role: 'Chief Operator' },
  { id: '2', name: 'Suresh Varma', system: 'System 2', role: 'Senior Operator' },
  { id: '3', name: 'Anil Reddy', system: 'System 3', role: 'Legal Documentation' },
  { id: '4', name: 'Priya Sharma', system: 'System 4', role: 'Forms & DTP' },
  { id: '5', name: 'Kalyan Babu', system: 'System 5', role: 'General Operator' },
];

export default function RootDashboard() {
  const router = useRouter();
  const { setActiveTemplate } = useDocumentStore();

  // Auth / Session State
  const [currentOperator, setCurrentOperator] = useState<{ id: string; name: string; system: string } | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('System 1');
  const [selectedOperatorId, setSelectedOperatorId] = useState('1');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'files' | 'orders'>('files');

  // Files View Controls
  const [fileViewMode, setFileViewMode] = useState<'list' | 'grid'>('list');
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');

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

  // Modal / Drawer State
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

  // Initialize Session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('varma_xerox_session');
      if (saved) {
        setCurrentOperator(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  // Fetch Work Orders
  const loadOrders = async () => {
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
  };

  useEffect(() => {
    if (activeTab === 'orders' || currentOperator) {
      loadOrders();
    }
  }, [activeTab, ordersStatusFilter]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const op = OPERATORS_LIST.find((o) => o.id === selectedOperatorId) || OPERATORS_LIST[0];
    const session = {
      id: op.id,
      name: op.name,
      system: selectedSystem,
    };
    setCurrentOperator(session);
    localStorage.setItem('varma_xerox_session', JSON.stringify(session));
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('varma_xerox_session');
    setCurrentOperator(null);
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

  // Filtered Documents
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
      <div className="min-h-screen w-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2C75FF] text-white flex items-center justify-center text-2xl font-bold tracking-tight shadow-md mb-3">
              VX
            </div>
            <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight">Varma Xerox</h1>
            <p className="text-sm text-[#525252] mt-1">Multi-Terminal Operator Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wider mb-2">
                Workstation / Terminal
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {['System 1', 'System 2', 'System 3', 'System 4', 'System 5'].map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setSelectedSystem(sys)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      selectedSystem === sys
                        ? 'bg-[#2C75FF] text-white border-[#2C75FF] shadow-sm'
                        : 'bg-[#F7F7F7] text-[#0A0A0A] border-[#E5E5E5] hover:border-slate-300'
                    }`}
                  >
                    {sys.replace('System ', 'Sys ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wider mb-2">
                Select Operator
              </label>
              <div className="space-y-2">
                {OPERATORS_LIST.map((op) => (
                  <div
                    key={op.id}
                    onClick={() => setSelectedOperatorId(op.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOperatorId === op.id
                        ? 'border-[#2C75FF] bg-blue-50/50 shadow-sm'
                        : 'border-[#E5E5E5] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        selectedOperatorId === op.id
                          ? 'bg-[#2C75FF] text-white'
                          : 'bg-[#EFEEFA] text-[#2C75FF]'
                      }`}>
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#0A0A0A]">{op.name}</div>
                        <div className="text-xs text-[#525252]">{op.role}</div>
                      </div>
                    </div>
                    <div className="text-xs px-2.5 py-1 rounded-full bg-[#F7F7F7] text-[#525252] font-medium border border-[#EBEBEB]">
                      {op.system}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2C75FF] hover:bg-blue-600 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
            >
              Sign In to {selectedSystem}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center text-xs text-[#525252]">
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
      <aside className="w-[66px] bg-white border-r border-[#E5E5E5] flex flex-col items-center justify-between py-5 flex-shrink-0 z-20">
        {/* Brand Logo */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-[#2C75FF] text-white flex items-center justify-center font-bold text-base shadow-sm tracking-tight cursor-pointer" title="Varma Xerox">
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

            <Link
              href="/operator"
              title="Launch Varma Xerox Print Simulator"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[#525252] hover:text-[#2C75FF] hover:bg-blue-50 transition-all"
            >
              <Printer className="w-5 h-5" />
            </Link>
          </nav>
        </div>

        {/* User & Logout */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#525252] hover:text-[#FB3748] hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div
            className="w-9 h-9 rounded-full bg-[#EFEEFA] text-[#2C75FF] flex items-center justify-center font-semibold text-xs border border-blue-100 shadow-sm"
            title={`${currentOperator.name} (${currentOperator.system})`}
          >
            {currentOperator.name.charAt(0)}
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER BAR (78px) */}
        <header className="h-[78px] bg-white border-b border-[#E5E5E5] px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xs font-semibold text-[#525252] uppercase tracking-wider flex items-center gap-2">
              <span>Varma Xerox Terminal</span>
              <span>/</span>
              <span className="text-[#2C75FF] font-medium">{currentOperator.system}</span>
            </div>
            <h2 className="text-xl font-semibold text-[#0A0A0A] tracking-tight mt-0.5">
              {activeTab === 'files' ? 'Documents & Templates' : 'Work Orders Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="px-4 py-2.5 bg-[#2C75FF] hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Work Order</span>
            </button>

            <Link
              href="/operator"
              className="px-4 py-2.5 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#0A0A0A] text-sm font-medium rounded-xl border border-[#E5E5E5] transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#525252]" />
              <span>Open Print Simulator</span>
            </Link>

            <div className="h-6 w-px bg-[#E5E5E5] mx-1"></div>

            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-[#EFEEFA] text-[#2C75FF] font-semibold text-xs flex items-center justify-center border border-blue-100">
                {currentOperator.name.charAt(0)}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-semibold text-[#0A0A0A]">{currentOperator.name}</div>
                <div className="text-[11px] text-[#525252]">{currentOperator.system}</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE VIEW */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
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
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        selectedFolder === folder
                          ? 'bg-[#0A0A0A] text-white shadow-sm'
                          : 'bg-white text-[#525252] border border-[#E5E5E5] hover:border-slate-300'
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-[#525252] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#2C75FF]"
                    />
                  </div>

                  {/* List / Grid Toggle */}
                  <div className="flex items-center p-0.5 bg-[#E9EAEB] rounded-lg border border-[#E5E5E5]">
                    <button
                      onClick={() => setFileViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${
                        fileViewMode === 'list' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#525252]'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFileViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all ${
                        fileViewMode === 'grid' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#525252]'
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
                <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#525252] font-semibold">
                      <tr>
                        <th className="py-3.5 px-5">Document Name</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Pages</th>
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
                                  <div className="font-medium text-[#0A0A0A] text-sm group-hover:text-[#2C75FF] transition-colors">
                                    {doc.name}
                                  </div>
                                  <div className="text-[11px] text-[#525252]">{doc.desc}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#525252]">
                              <span className="px-2.5 py-1 rounded-full bg-[#F7F7F7] text-[#0A0A0A] font-medium border border-[#EBEBEB]">
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
                                className="px-3 py-1.5 bg-white border border-[#E5E5E5] text-[#2C75FF] font-medium rounded-lg text-xs hover:bg-[#2C75FF] hover:text-white hover:border-[#2C75FF] transition-all inline-flex items-center gap-1.5 shadow-sm"
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
                        className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm hover:shadow-md hover:border-[#2C75FF]/40 cursor-pointer transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EFEEFA] text-[#2C75FF] flex items-center justify-center group-hover:bg-[#2C75FF] group-hover:text-white transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#525252] border border-[#EBEBEB]">
                              {doc.badge}
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm text-[#0A0A0A] group-hover:text-[#2C75FF] transition-colors leading-snug">
                            {doc.name}
                          </h3>
                          <p className="text-xs text-[#525252] mt-1.5 line-clamp-2">
                            {doc.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#EBEBEB] flex items-center justify-between text-xs">
                          <span className="text-[#525252]">{doc.pages}</span>
                          <span className="text-[#2C75FF] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#525252] mb-1 font-medium">
                    <span>Total Work Orders</span>
                    <ClipboardList className="w-4 h-4 text-[#2C75FF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0A0A]">{metrics.totalOrders}</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live synced with Neon DB
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#525252] mb-1 font-medium">
                    <span>WO Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0A0A]">{metrics.completedOrders}</div>
                  <div className="text-[11px] text-[#525252] mt-1">
                    {metrics.totalOrders > 0
                      ? Math.round((metrics.completedOrders / metrics.totalOrders) * 100)
                      : 0}
                    % completion rate
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#525252] mb-1 font-medium">
                    <span>Amount Collected</span>
                    <DollarSign className="w-4 h-4 text-[#2C75FF]" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">₹{metrics.amountCollected.toLocaleString()}</div>
                  <div className="text-[11px] text-[#525252] mt-1">Received at counter</div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#525252] mb-1 font-medium">
                    <span>Amount Pending</span>
                    <AlertCircle className="w-4 h-4 text-[#FB3748]" />
                  </div>
                  <div className="text-2xl font-bold text-[#FB3748]">₹{metrics.amountPending.toLocaleString()}</div>
                  <div className="text-[11px] text-[#525252] mt-1">Due for collection</div>
                </div>
              </div>

              {/* FILTER & SEARCH ROW */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {['All Status', 'Confirmed', 'Pending', 'In Progress'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrdersStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        ordersStatusFilter === status
                          ? 'bg-[#0A0A0A] text-white shadow-sm'
                          : 'bg-white text-[#525252] border border-[#E5E5E5] hover:border-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-[#525252] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search customer, phone, WO#..."
                      value={ordersSearch}
                      onChange={(e) => setOrdersSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') loadOrders();
                      }}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#2C75FF]"
                    />
                  </div>
                  <button
                    onClick={loadOrders}
                    className="px-3 py-1.5 bg-white border border-[#E5E5E5] hover:border-slate-300 text-xs font-medium rounded-lg shadow-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* WORK ORDERS TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#525252] font-semibold">
                    <tr>
                      <th className="py-3.5 px-5">WO Number</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Document Type</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Paid / Due</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Operator / Terminal</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB]">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#525252]">
                          Loading work orders from Neon DB...
                        </td>
                      </tr>
                    ) : workOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#525252]">
                          No work orders found. Click &quot;New Work Order&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      workOrdersList.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-[#0A0A0A]">
                            {order.wo_number}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#0A0A0A]">{order.customer_name}</div>
                            <div className="text-[11px] text-[#525252]">{order.customer_contact}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#0A0A0A] font-medium max-w-[200px] truncate" title={order.document_type}>
                            {order.document_type}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#0A0A0A]">
                            ₹{order.wo_amount}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-emerald-600 font-medium">₹{order.amount_paid} paid</div>
                            {order.amount_due > 0 ? (
                              <div className="text-[#FB3748] text-[11px]">₹{order.amount_due} due</div>
                            ) : (
                              <div className="text-slate-400 text-[11px]">Clear</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-block ${
                                order.status === 'Confirmed' || order.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : order.status === 'In Progress'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#525252]">
                            <div className="text-xs text-[#0A0A0A] font-medium">{order.created_by || 'Operator'}</div>
                            <div className="text-[11px]">{order.system_name || 'System 1'}</div>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className="text-xs bg-white border border-[#E5E5E5] rounded-md px-2 py-1 text-[#0A0A0A] focus:outline-none focus:border-[#2C75FF]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* NEW WORK ORDER SLIDE-OVER MODAL */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A0A0A]">Create New Work Order</h3>
                  <p className="text-xs text-[#525252] mt-0.5">Enter customer details and order pricing</p>
                </div>
                <button
                  onClick={() => setIsNewOrderOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#525252] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form id="new-wo-form" onSubmit={handleCreateOrderSubmit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#0A0A0A] mb-1.5">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newOrderForm.customer_name}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0A0A0A] mb-1.5">Customer Phone / Contact *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newOrderForm.customer_contact}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#0A0A0A] mb-1.5">Document Type</label>
                  <select
                    value={newOrderForm.document_type}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, document_type: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF] bg-white"
                  >
                    {TEMPLATE_DOCUMENTS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#0A0A0A] mb-1.5">Total Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newOrderForm.wo_amount}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, wo_amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#0A0A0A] mb-1.5">Amount Paid (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newOrderForm.amount_paid}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, amount_paid: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#0A0A0A] mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={newOrderForm.due_date}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, due_date: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#0A0A0A] mb-1.5">Initial Status</label>
                    <select
                      value={newOrderForm.status}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF] bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#0A0A0A] mb-1.5">Notes & Print Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Stamp paper value, copy requirements, customer notes..."
                    value={newOrderForm.internal_notes}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, internal_notes: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-xs focus:outline-none focus:border-[#2C75FF]"
                  />
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewOrderOpen(false)}
                className="px-4 py-2 border border-[#E5E5E5] text-xs font-medium rounded-lg text-[#525252] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-wo-form"
                disabled={isSubmittingOrder}
                className="px-4 py-2 bg-[#2C75FF] hover:bg-blue-600 text-white text-xs font-medium rounded-lg shadow-sm transition-all disabled:opacity-60"
              >
                {isSubmittingOrder ? 'Saving...' : 'Create Work Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
