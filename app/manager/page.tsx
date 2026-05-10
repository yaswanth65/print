'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics, addManualCash, getPendingDocuments, markDocumentPaid } from '@/app/actions/app-actions';

export default function ManagerMobile() {
  const [activeTab, setActiveTab] = useState<'pending' | 'cash'>('pending');
  const [stats, setStats] = useState<any>({
    counterCash: 0,
    todaysEarnings: 0,
    upiTotal: 0,
    cashTotal: 0,
    recentTransactions: [],
  });
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);

  // Manual Cash State
  const [cashAmount, setCashAmount] = useState('');
  const [cashNotes, setCashNotes] = useState('');
  const [isSubmittingCash, setIsSubmittingCash] = useState(false);

  // Payment State
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [billAmount, setBillAmount] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI'>('UPI');
  const [isPaying, setIsPaying] = useState(false);

  const loadData = async () => {
    const metrics = await getDashboardMetrics();
    setStats(metrics);
    const docs = await getPendingDocuments();
    setPendingDocs(docs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCash = async () => {
    if (!cashAmount || isNaN(Number(cashAmount))) return;
    setIsSubmittingCash(true);
    await addManualCash(Number(cashAmount), cashNotes);
    setIsSubmittingCash(false);
    setCashAmount('');
    setCashNotes('');
    alert('Cash added to counter');
    loadData();
  };

  const handleCollectPayment = async () => {
    if (!selectedDoc || !billAmount || !receivedAmount) return;
    
    setIsPaying(true);
    
    const finalReceived = paymentMethod === 'UPI' ? Number(billAmount) : Number(receivedAmount);
    
    const res = await markDocumentPaid(selectedDoc.id, Number(billAmount), finalReceived, paymentMethod);
    setIsPaying(false);
    
    if (res.success) {
      if (res.changeAmount && res.changeAmount > 0) {
        alert(`Payment collected! Change to give: ₹${res.changeAmount}`);
      } else {
        alert('Payment collected successfully!');
      }
      setSelectedDoc(null);
      setBillAmount('');
      setReceivedAmount('');
      loadData();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-8 font-sans">
      <div className="bg-white w-full max-w-[450px] min-h-[800px] border border-gray-300 shadow-sm flex flex-col items-center p-6 relative">
        
        {/* Top Stats */}
        <div className="w-full flex justify-between items-center mb-4 gap-2">
          <div className="border border-black py-2 px-2 flex-1 text-center text-xs font-medium uppercase tracking-wide bg-blue-50">
            COUNTER CASH: ₹{stats.counterCash.toLocaleString('en-IN')}
          </div>
          <button 
            onClick={() => setActiveTab('cash')}
            className={`border border-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-black transition-colors ${activeTab === 'cash' ? 'bg-[#68d371]' : 'bg-gray-100 hover:bg-[#68d371]'}`}
          >
            ADD CASH
          </button>
        </div>

        <div className="w-full border border-black py-2 text-center text-xs font-medium uppercase tracking-wide mb-4">
          TODAYS EARNINGS: ₹{stats.todaysEarnings.toLocaleString('en-IN')}
        </div>

        <div className="w-full flex justify-between gap-4 mb-8">
          <div className="border border-black py-2 flex-1 text-center text-xs font-medium uppercase tracking-wide bg-white">
            UPI : ₹{stats.upiTotal.toLocaleString('en-IN')}
          </div>
          <div className="border border-black py-2 flex-1 text-center text-xs font-medium uppercase tracking-wide bg-white">
            CASH : ₹{stats.cashTotal.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="w-full flex border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab('pending')} className={`flex-1 py-3 text-sm font-bold uppercase ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Pending Prints
          </button>
          <button onClick={() => setActiveTab('cash')} className={`flex-1 py-3 text-sm font-bold uppercase ${activeTab === 'cash' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            Manual Entry
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="w-full flex-1 flex flex-col">
            {!selectedDoc ? (
              <div className="space-y-3 overflow-y-auto">
                {pendingDocs.map(doc => (
                  <div key={doc.id} className="border border-gray-300 p-4 rounded bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-800">{doc.customer_name}</div>
                      <div className="text-sm text-gray-600">{doc.document_title}</div>
                      <div className="text-xs text-blue-600 font-bold mt-1">₹{doc.bill_amount}</div>
                    </div>
                    <button 
                      onClick={() => { setSelectedDoc(doc); setReceivedAmount(''); }}
                      className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase rounded shadow-sm hover:bg-blue-700"
                    >
                      Collect
                    </button>
                  </div>
                ))}
                {pendingDocs.length === 0 && (
                  <div className="text-center text-gray-500 py-10">No pending prints.</div>
                )}
              </div>
            ) : (
              <div className="w-full border border-black p-4 mb-4 bg-gray-50 relative">
                <button onClick={() => setSelectedDoc(null)} className="absolute top-2 right-2 text-gray-500 text-sm font-bold">✕ Cancel</button>
                <h3 className="font-bold text-lg mb-4 text-center">Collect Payment</h3>
                <div className="text-sm text-center mb-6">For: <strong>{selectedDoc.customer_name}</strong> - {selectedDoc.document_title}</div>
                
                <input 
                  type="number" placeholder="BILL AMOUNT (₹)" value={billAmount}
                  onChange={(e) => { setBillAmount(e.target.value); if(paymentMethod==='UPI') setReceivedAmount(e.target.value); }}
                  className="w-full border border-black py-4 text-center text-sm font-bold uppercase mb-4 outline-none focus:ring-1 focus:ring-black"
                />

                <div className="w-full flex border border-black mb-4">
                  <button 
                    onClick={() => { setPaymentMethod('UPI'); setReceivedAmount(billAmount); }}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide border-r border-black transition-colors ${paymentMethod === 'UPI' ? 'bg-[#b3dcff]' : 'bg-white hover:bg-gray-50'}`}
                  >UPI</button>
                  <button 
                    onClick={() => setPaymentMethod('CASH')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide transition-colors ${paymentMethod === 'CASH' ? 'bg-[#b3dcff]' : 'bg-white hover:bg-gray-50'}`}
                  >CASH</button>
                </div>

                {paymentMethod === 'CASH' && (
                  <input 
                    type="number" placeholder="RECEIVED AMOUNT (₹)" value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className="w-full border border-black py-4 text-center text-sm font-bold uppercase mb-4 outline-none focus:ring-1 focus:ring-black"
                  />
                )}

                {paymentMethod === 'CASH' && billAmount && receivedAmount && Number(receivedAmount) >= Number(billAmount) && (
                  <div className="text-center font-bold text-red-600 mb-4 text-lg">
                    Change: ₹{Number(receivedAmount) - Number(billAmount)}
                  </div>
                )}

                <button 
                  onClick={handleCollectPayment} disabled={isPaying}
                  className="w-full border border-black py-4 text-xs font-bold uppercase tracking-wide text-white bg-[#40a3ff] hover:bg-[#2b90f0]"
                >
                  {isPaying ? 'Processing...' : 'CONFIRM PAYMENT'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cash' && (
          <div className="w-full flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-center">Manual Cash Entry</h3>
            <input 
              type="number" placeholder="ENTER AMOUNT (₹)" value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full border border-black py-4 text-center text-sm font-bold uppercase mb-4 outline-none focus:ring-1 focus:ring-black"
            />
            <input 
              type="text" placeholder="NOTES / REASON" value={cashNotes}
              onChange={(e) => setCashNotes(e.target.value)}
              className="w-full border border-black py-4 text-center text-sm font-bold uppercase mb-4 outline-none focus:ring-1 focus:ring-black"
            />
            <button 
              onClick={handleAddCash} disabled={isSubmittingCash}
              className="w-full border border-black py-4 text-xs font-bold uppercase tracking-wide text-black bg-[#68d371] hover:bg-[#52ba5b]"
            >
              {isSubmittingCash ? 'Processing...' : 'ADD TO COUNTER CASH'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
