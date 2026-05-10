'use client';

import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/app/actions/app-actions';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  
  // Date filters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    async function loadData() {
      const data = await getDashboardMetrics(startDate, endDate);
      setMetrics(data);
    }
    loadData();
  }, [startDate, endDate]);

  if (!metrics) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
              <span className="text-sm font-medium text-gray-500">From:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="outline-none text-sm font-semibold"
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
              <span className="text-sm font-medium text-gray-500">To:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="outline-none text-sm font-semibold"
              />
            </div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 text-sm">
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards: mobile 3 per row (grid-cols-3) */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <StatCard title="Today's Earnings" value={`₹${metrics.todaysEarnings}`} color="text-green-600" />
          <StatCard title="Counter Cash" value={`₹${metrics.counterCash}`} color="text-blue-600" />
          <StatCard title="Cash Total" value={`₹${metrics.cashTotal}`} />
          <StatCard title="UPI Total" value={`₹${metrics.upiTotal}`} />
          <StatCard title="Pending Payments" value={metrics.pendingPaymentsCount} color="text-red-600" />
          <StatCard title="Total Docs" value={metrics.totalDocumentsPrinted} />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 font-medium">Type</th>
                  <th className="py-3 font-medium">Customer Name</th>
                  <th className="py-3 font-medium">Document / Reason</th>
                  <th className="py-3 font-medium">Method</th>
                  <th className="py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${tx.entry_type === 'DOCUMENT_PAYMENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {tx.entry_type === 'DOCUMENT_PAYMENT' ? 'Payment' : 'Cash Add'}
                      </span>
                    </td>
                    <td className="py-3 font-medium">{tx.customer_name || '-'}</td>
                    <td className="py-3">{tx.document_title}</td>
                    <td className="py-3">{tx.payment_method || '-'}</td>
                    <td className="py-3 text-right font-semibold">₹{tx.amount_collected}</td>
                  </tr>
                ))}
                {metrics.recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">No transactions found for this date range</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, color = "text-gray-900" }: { title: string, value: string | number, color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 flex flex-col justify-center items-center text-center">
      <div className="text-xs md:text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className={`text-lg md:text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
