'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDashboardMetrics } from '@/app/actions/app-actions';
import { getAttendance, saveAttendance, getUsers, addUser, updateUser, deleteUser, getUserAttendanceHistory } from '@/app/actions/admin-actions';

type Lang = 'en' | 'te';
type Tab = 'cash' | 'attendance' | 'users';

const t: Record<Lang, Record<string, string>> = {
  en: {
    english: 'English', telugu: 'తెలుగు', cash: 'Cash', attendance: 'Attendance', users: 'Users',
    from: 'From:', to: 'To:', exportCsv: 'Export CSV',
    todaysEarnings: "Today's Earnings", counterCash: 'Counter Cash', cashTotal: 'Cash Total',
    upiTotal: 'UPI Total', transactions: 'Transactions',
    recentTransactions: 'Recent Transactions', type: 'Type', description: 'Description',
    method: 'Method', amount: 'Amount', time: 'Time', payment: 'Payment', cashAdd: 'Cash Add',
    noTransactions: 'No transactions found', loading: 'Loading Dashboard...',
    markAllPresent: 'Mark All Present', reset: 'Reset', confirmAttendance: 'Confirm Attendance',
    present: 'Present', absent: 'Absent', halfDay: 'Half Day',
    markAttendance: 'Mark attendance for today',
    search: 'Search...', filterRole: 'Role', all: 'All', addUser: 'Add User',
    edit: 'Edit', disable: 'Disable', viewAttendance: 'Attendance', phone: 'Phone',
    presentDays: 'Present Days', lastActive: 'Last Active', noUsers: 'No users found',
    name: 'Name', role: 'Role', cancel: 'Cancel', save: 'Save',
    noAttendance: 'No attendance changes to save', saved: 'Attendance saved successfully',
    userAdded: 'User added successfully', userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully', addUserTitle: 'Add User', editUserTitle: 'Edit User',
    confirmDelete: 'Delete this user?', confirm: 'Confirm', close: 'Close',
    attendanceTitle: 'Attendance History', date: 'Date', status: 'Status',
  },
  te: {
    english: 'English', telugu: 'తెలుగు', cash: 'క్యాష్', attendance: 'హాజరు', users: 'వినియోగదారులు',
    from: 'నుండి:', to: 'వరకు:', exportCsv: 'CSV ఎగుమతి',
    todaysEarnings: 'నేటి ఆదాయం', counterCash: 'కౌంటర్ క్యాష్', cashTotal: 'మొత్తం క్యాష్',
    upiTotal: 'మొత్తం యూపీఐ', transactions: 'లావాదేవీలు',
    recentTransactions: 'ఇటీవలి లావాదేవీలు', type: 'రకం', description: 'వివరణ',
    method: 'పద్ధతి', amount: 'మొత్తం', time: 'సమయం', payment: 'చెల్లింపు', cashAdd: 'క్యాష్ జోడింపు',
    noTransactions: 'లావాదేవీలు కనుగొనబడలేదు', loading: 'డాష్‌బోర్డ్ లోడ్ అవుతోంది...',
    markAllPresent: 'అందరూ హాజరు', reset: 'రీసెట్', confirmAttendance: 'హాజరు నిర్ధారించండి',
    present: 'హాజరు', absent: 'గైర్హాజరు', halfDay: 'సగం రోజు',
    markAttendance: 'ఈ రోజు హాజరు గుర్తించండి',
    search: 'వెతకండి...', filterRole: 'పాత్ర', all: 'అన్నీ', addUser: 'వినియోగదారుని జోడించు',
    edit: 'సవరించు', disable: 'నిలిపివేయి', viewAttendance: 'హాజరు', phone: 'ఫోన్',
    presentDays: 'హాజరు రోజులు', lastActive: 'చివరిగా', noUsers: 'వినియోగదారులు లేరు',
    name: 'పేరు', role: 'పాత్ర', cancel: 'రద్దు చేయి', save: 'సేవ్ చేయి',
    noAttendance: 'సేవ్ చేయడానికి మార్పులు లేవు', saved: 'హాజరు విజయవంతంగా సేవ్ చేయబడింది',
    userAdded: 'వినియోగదారు జోడించబడ్డారు', userUpdated: 'వినియోగదారు నవీకరించబడ్డారు',
    userDeleted: 'వినియోగదారు తొలగించబడ్డారు', addUserTitle: 'వినియోగదారుని జోడించు',
    editUserTitle: 'వినియోగదారుని సవరించు', confirmDelete: 'ఈ వినియోగదారుని తొలగించాలా?',
    confirm: 'నిర్ధారించండి', close: 'మూసివేయి',
    attendanceTitle: 'హాజరు చరిత్ర', date: 'తేదీ', status: 'స్థితి',
  },
};

function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateIST(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+05:30');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Cash Tab ──────────────────────────────────────────────

function CashTab({ metrics, startDate, endDate, setStartDate, setEndDate, s, lang }: any) {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider whitespace-nowrap">{s.from}</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="outline-none text-xs sm:text-sm font-bold text-gray-800 border border-gray-200 px-2 py-1 bg-gray-50 w-[130px] sm:w-auto" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider whitespace-nowrap">{s.to}</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="outline-none text-xs sm:text-sm font-bold text-gray-800 border border-gray-200 px-2 py-1 bg-gray-50 w-[130px] sm:w-auto" />
          </div>
        </div>
        <button className="bg-[#1e293b] text-white text-[11px] font-bold px-4 py-2 transition-colors hover:bg-gray-800 w-full sm:w-auto text-center rounded">
          {s.exportCsv}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 border-b border-gray-200 bg-white">
        {[
          { label: s.todaysEarnings, value: `₹${metrics.todaysEarnings.toLocaleString('en-IN')}` },
          { label: s.counterCash, value: `₹${metrics.counterCash.toLocaleString('en-IN')}` },
          { label: s.cashTotal, value: `₹${metrics.cashTotal.toLocaleString('en-IN')}` },
          { label: s.upiTotal, value: `₹${metrics.upiTotal.toLocaleString('en-IN')}` },
          { label: s.transactions, value: metrics.recentTransactions.length, noColon: true },
        ].map((item, i) => (
          <div key={i} className={`px-4 sm:px-5 py-4 ${i < 4 ? 'border-r border-gray-200' : ''} ${i < 2 ? 'border-b md:border-b-0 border-gray-200' : ''}`}>
            <div className="text-[10px] font-bold text-gray-500 tracking-wider truncate">{item.label}</div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 truncate">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d7c6b] border-b border-[#0a6557] px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div>
          <div className="text-[10px] font-bold text-white/70 tracking-wider">{s.todaysEarnings}</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">₹{metrics.todaysEarnings.toLocaleString('en-IN')}</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-[10px] font-bold text-white/70 tracking-wider">{s.transactions}</div>
          <div className="text-lg sm:text-xl font-black text-white mt-0.5">{metrics.recentTransactions.length}</div>
        </div>
      </div>

      <div className="bg-white px-4 sm:px-5 py-4">
        <div className="font-bold text-gray-900 mb-3">{s.recentTransactions}</div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="w-full text-left text-sm min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="border-b border-gray-200">
                  {[s.type, s.description, s.method, s.time, s.amount].map((h, i) => (
                    <th key={i} className={`py-2 pr-3 text-[10px] font-bold text-gray-500 tracking-wider whitespace-nowrap ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-gray-100">
                    <td className="py-3 pr-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 tracking-wider whitespace-nowrap ${tx.entry_type === 'DOCUMENT_PAYMENT' ? 'bg-gray-200 text-gray-700' : 'bg-gray-800 text-white'}`}>
                        {tx.entry_type === 'DOCUMENT_PAYMENT' ? s.payment : s.cashAdd}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[120px] sm:max-w-none">{tx.document_title || '-'}</td>
                    <td className="py-3 pr-3"><span className="text-[10px] font-bold text-gray-500">{tx.payment_method || '-'}</span></td>
                    <td className="py-3 pr-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm font-black text-gray-900 whitespace-nowrap">₹{tx.amount_collected.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {metrics.recentTransactions.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400 text-sm font-medium">{s.noTransactions}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Attendance Tab ─────────────────────────────────────────

function AttendanceTab({ s }: { s: Record<string, string> }) {
  const today = getTodayIST();
  const [employees, setEmployees] = useState<any[]>([]);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAttendance(today);
      setEmployees(data);
      const map: Record<string, string> = {};
      data.forEach((e: any) => { if (e.status) map[e.id] = e.status; });
      setChanges(map);
      setLoaded(true);
    }
    load();
  }, [today]);

  const hasChanges = Object.keys(changes).length > 0;

  const setStatus = (userId: string, status: string) => {
    setChanges(prev => ({ ...prev, [userId]: status }));
  };

  const markAllPresent = () => {
    const map: Record<string, string> = {};
    employees.forEach(e => { map[e.id] = 'PRESENT'; });
    setChanges(map);
  };

  const resetAll = () => {
    const map: Record<string, string> = {};
    employees.forEach(e => { if (e.status) map[e.id] = e.status; });
    setChanges(map);
  };

  const handleConfirm = async () => {
    const records = Object.entries(changes).map(([userId, status]) => ({ userId, status, date: today }));
    setSaving(true);
    await saveAttendance(records);
    setSaving(false);
    alert(s.saved);
  };

  if (!loaded) return <div className="p-8 text-center text-gray-500 text-sm font-medium">{s.loading}</div>;

  return (
    <div className="flex flex-col min-h-0">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-4">
        <div className="font-bold text-gray-900 text-lg">{s.attendance}</div>
        <div className="text-xs text-gray-500 mt-0.5">{formatDateIST(today)}</div>
        <div className="text-[10px] font-bold text-gray-400 tracking-wider mt-1">{s.markAttendance}</div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3 flex gap-2">
        <button onClick={markAllPresent}
          className="bg-[#0d7c6b] hover:bg-[#0a6557] text-white text-[11px] font-bold px-4 py-2 transition-colors rounded">
          {s.markAllPresent}
        </button>
        <button onClick={resetAll}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold px-4 py-2 transition-colors border border-gray-200 rounded">
          {s.reset}
        </button>
      </div>

      <div className="bg-white px-4 sm:px-5 py-3 space-y-2 border-b border-gray-200">
        {employees.map(emp => {
          const current = changes[emp.id];
          return (
            <div key={emp.id} className="border border-gray-200 p-3 rounded">
              <div className="text-sm font-bold text-gray-900 mb-2">{emp.name}</div>
              <div className="flex gap-1.5">
                {(['PRESENT', 'ABSENT', 'HALF_DAY'] as const).map(st => {
                  const labels = { PRESENT: s.present, ABSENT: s.absent, HALF_DAY: s.halfDay };
                  return (
                    <button key={st} onClick={() => setStatus(emp.id, st)}
                      className={`flex-1 py-2 text-xs font-bold transition-colors rounded ${
                        current === st
                          ? st === 'PRESENT' ? 'bg-[#0d7c6b] text-white'
                            : st === 'ABSENT' ? 'bg-[#1e293b] text-white'
                            : 'bg-gray-200 text-gray-700'
                          : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                      }`}>
                      {labels[st]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {employees.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-6 font-medium">{s.noUsers}</div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-5 py-3">
        <button onClick={handleConfirm} disabled={!hasChanges || saving}
          className="w-full bg-[#0d7c6b] text-white hover:bg-[#0a6557] py-3 text-sm font-bold tracking-wide transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? '...' : s.confirmAttendance}
        </button>
      </div>
    </div>
  );
}

// ─── Users Tab ─────────────────────────────────────────────

function UsersTab({ s }: { s: Record<string, string> }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'ADMIN' | 'MANAGER' | 'OPERATOR'>('OPERATOR');
  const [submitting, setSubmitting] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<{records: any[]; stats: {present: number; absent: number; halfDay: number; total: number}} | null>(null);
  const [historyUserId, setHistoryUserId] = useState<string | null>(null);
  const historyToday = getTodayIST();
  const [histFrom, setHistFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  });
  const [histTo, setHistTo] = useState(historyToday);

  const loadUsers = useCallback(async () => {
    const data = await getUsers(search || undefined, roleFilter === 'ALL' ? undefined : roleFilter);
    setUsers(data);
    setLoaded(true);
  }, [search, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openAdd = () => {
    setEditUser(null); setFormName(''); setFormPhone(''); setFormRole('OPERATOR'); setShowModal('add');
  };

  const openEdit = (u: any) => {
    setEditUser(u); setFormName(u.name); setFormPhone(u.phone || ''); setFormRole(u.role); setShowModal('edit');
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    if (showModal === 'add') {
      await addUser({ name: formName.trim(), phone: formPhone.trim() || undefined, role: formRole });
      alert(s.userAdded);
    } else if (editUser) {
      await updateUser(editUser.id, { name: formName.trim(), phone: formPhone.trim() || undefined, role: formRole });
      alert(s.userUpdated);
    }
    setSubmitting(false);
    setShowModal(null);
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(s.confirmDelete)) return;
    await deleteUser(id);
    alert(s.userDeleted);
    loadUsers();
  };

  const showHistory = async (userId: string) => {
    setHistoryUserId(userId);
    const data = await getUserAttendanceHistory(userId, histFrom, histTo);
    setAttendanceHistory(data);
  };

  useEffect(() => {
    if (historyUserId) {
      getUserAttendanceHistory(historyUserId, histFrom, histTo).then(setAttendanceHistory);
    }
  }, [histFrom, histTo, historyUserId]);

  if (!loaded) return <div className="p-8 text-center text-gray-500 text-sm font-medium">{s.loading}</div>;

  return (
    <div className="flex flex-col min-h-0">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-4">
        <div className="font-bold text-gray-900 text-lg mb-3">{s.users}</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={s.search}
            className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-bold outline-none text-gray-800 placeholder-gray-300" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-bold outline-none text-gray-800">
            <option value="ALL">{s.all}</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="OPERATOR">OPERATOR</option>
          </select>
          <button onClick={openAdd}
            className="bg-[#0d7c6b] hover:bg-[#0a6557] text-white text-[11px] font-bold px-4 py-2 transition-colors whitespace-nowrap rounded">
            + {s.addUser}
          </button>
        </div>
      </div>

      <div className="bg-white px-4 sm:px-5 py-3 space-y-2 border-b border-gray-200">
        {users.map(u => (
          <div key={u.id} className="border border-gray-200 p-3 rounded">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900">{u.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.phone}: {u.phone || '-'}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5">
                  {u.role} &middot; {s.presentDays}: {u.presentDays}
                  {u.lastActive ? ` &middot; ${s.lastActive}: ${u.lastActive}` : ''}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(u)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold px-2.5 py-1.5 border border-gray-200 rounded transition-colors">
                  {s.edit}
                </button>
                <button onClick={() => handleDelete(u.id)}
                  className="bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 text-[10px] font-bold px-2.5 py-1.5 border border-gray-200 rounded transition-colors">
                  {s.disable}
                </button>
                <button onClick={() => showHistory(u.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold px-2.5 py-1.5 border border-gray-200 rounded transition-colors">
                  {s.viewAttendance}
                </button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-6 font-medium">{s.noUsers}</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="font-bold text-gray-900">{showModal === 'add' ? s.addUserTitle : s.editUserTitle}</div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">{s.name}</div>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-bold outline-none text-gray-800" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">{s.phone}</div>
                <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-bold outline-none text-gray-800" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">{s.role}</div>
                <select value={formRole} onChange={e => setFormRole(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-bold outline-none text-gray-800">
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="OPERATOR">OPERATOR</option>
                </select>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex gap-2 justify-end">
              <button onClick={() => setShowModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold px-4 py-2 border border-gray-200 rounded transition-colors">
                {s.cancel}
              </button>
              <button onClick={handleSave} disabled={submitting || !formName.trim()}
                className="bg-[#0d7c6b] hover:bg-[#0a6557] text-white text-[11px] font-bold px-4 py-2 rounded transition-colors disabled:opacity-40">
                {submitting ? '...' : s.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History Modal */}
      {attendanceHistory && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setAttendanceHistory(null)}>
          <div className="bg-white w-full max-w-sm border border-gray-200 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="font-bold text-gray-900">{s.attendanceTitle}</div>
              <button onClick={() => setAttendanceHistory(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">&times;</button>
            </div>

            {/* Date Filter */}
            <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 tracking-wider mb-0.5">{s.from}</div>
                <input type="date" value={histFrom} onChange={e => setHistFrom(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-2 py-1 text-xs font-bold outline-none text-gray-800" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 tracking-wider mb-0.5">{s.to}</div>
                <input type="date" value={histTo} onChange={e => setHistTo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-2 py-1 text-xs font-bold outline-none text-gray-800" />
              </div>
            </div>

            {/* Mini Stats */}
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 p-2 text-center">
                  <div className="text-lg font-black text-[#0d7c6b]">{attendanceHistory.stats.present}</div>
                  <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.present}</div>
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-200 p-2 text-center">
                  <div className="text-lg font-black text-[#1e293b]">{attendanceHistory.stats.absent}</div>
                  <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.absent}</div>
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-200 p-2 text-center">
                  <div className="text-lg font-black text-gray-500">{attendanceHistory.stats.halfDay}</div>
                  <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.halfDay}</div>
                </div>
              </div>
            </div>

            {/* Records */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {attendanceHistory.records.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4">{s.noTransactions}</div>
              ) : (
                attendanceHistory.records.map(r => (
                  <div key={r.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-xs font-medium text-gray-800">{r.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 ${r.status === 'PRESENT' ? 'bg-green-100 text-green-700' : r.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                      {r.status === 'PRESENT' ? s.present : r.status === 'ABSENT' ? s.absent : s.halfDay}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ─────────────────────────────────────────────

export default function AdminDashboard() {
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<Tab>('cash');
  const [metrics, setMetrics] = useState<any>(null);
  const today = getTodayIST();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const s = t[lang];

  useEffect(() => {
    async function load() {
      const data = await getDashboardMetrics(startDate, endDate);
      setMetrics(data);
    }
    load();
  }, [startDate, endDate]);

  if (!metrics) return (
    <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center">
      <div className="text-gray-500 text-sm font-medium">{s.loading}</div>
    </div>
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'cash', label: s.cash },
    { key: 'attendance', label: s.attendance },
    { key: 'users', label: s.users },
  ];

  return (
    <div className="min-h-screen bg-[#eef1f6]">
      <div className="w-full max-w-5xl mx-auto flex flex-col min-w-0">
        <div className="flex border-b border-gray-300">
          <button onClick={() => setLang('en')}
            className={`flex-1 py-3 text-sm font-bold tracking-wide ${lang === 'en' ? 'bg-white text-[#0d7c6b] border-b-2 border-[#0d7c6b]' : 'bg-gray-100 text-gray-500'}`}>
            {s.english}
          </button>
          <button onClick={() => setLang('te')}
            className={`flex-1 py-3 text-sm font-bold tracking-wide ${lang === 'te' ? 'bg-white text-[#0d7c6b] border-b-2 border-[#0d7c6b]' : 'bg-gray-100 text-gray-500'}`}>
            {s.telugu}
          </button>
        </div>

        <div className="flex border-b border-gray-300">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${tab === t.key ? 'bg-white text-[#0d7c6b] border-b-2 border-[#0d7c6b]' : 'bg-gray-100 text-gray-500 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'cash' && (
          <CashTab metrics={metrics} startDate={startDate} endDate={endDate}
            setStartDate={setStartDate} setEndDate={setEndDate} s={s} lang={lang} />
        )}
        {tab === 'attendance' && <AttendanceTab s={s} />}
        {tab === 'users' && <UsersTab s={s} />}
      </div>
    </div>
  );
}
