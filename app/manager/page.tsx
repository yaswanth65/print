'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics, addManualCash, createIndependentPayment } from '@/app/actions/app-actions';

type Lang = 'en' | 'te';

const t: Record<Lang, Record<string, string>> = {
  en: {
    counterCash: 'COUNTER CASH',
    addCash: 'ADD CASH',
    todaysEarnings: "TODAY'S EARNINGS",
    upi: 'UPI',
    cash: 'CASH',
    paymentEntry: 'PAYMENT ENTRY',
    amount: 'AMOUNT',
    enterAmount: 'Enter Amount',
    receivedAmount: 'RECEIVED AMOUNT',
    changeDue: 'Change due:',
    addPayment: 'ADD PAYMENT',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No recent transactions',
    manual: '(Manual)',
    cancel: 'Cancel',
    add: 'Add',
    amountPlaceholder: 'Amount',
    enterReceived: 'Enter received amount',
    english: 'English',
    telugu: 'తెలుగు',
  },
  te: {
    counterCash: 'కౌంటర్ క్యాష్',
    addCash: 'క్యాష్ జోడించు',
    todaysEarnings: 'నేటి ఆదాయం',
    upi: 'యూపీఐ',
    cash: 'క్యాష్',
    paymentEntry: 'చెల్లింపు ఎంట్రీ',
    amount: 'మొత్తం',
    enterAmount: 'మొత్తం నమోదు చేయండి',
    receivedAmount: 'అందిన మొత్తం',
    changeDue: 'మారుదల:',
    addPayment: 'చెల్లింపు జోడించు',
    recentTransactions: 'ఇటీవలి లావాదేవీలు',
    noTransactions: 'ఇటీవలి లావాదేవీలు లేవు',
    manual: '(మాన్యువల్)',
    cancel: 'రద్దు చేయి',
    add: 'జోడించు',
    amountPlaceholder: 'మొత్తం',
    enterReceived: 'అందిన మొత్తం నమోదు చేయండి',
    english: 'English',
    telugu: 'తెలుగు',
  },
};

export default function ManagerDashboard() {
  const [lang, setLang] = useState<Lang>('en');

  const [stats, setStats] = useState<any>({
    counterCash: 0,
    todaysEarnings: 0,
    upiTotal: 0,
    cashTotal: 0,
    recentTransactions: [],
  });

  const [billAmount, setBillAmount] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI'>('UPI');
  const [isPaying, setIsPaying] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [isSubmittingCash, setIsSubmittingCash] = useState(false);

  const s = t[lang];

  const loadData = async () => {
    const metrics = await getDashboardMetrics();
    setStats(metrics);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCollectPayment = async () => {
    if (!billAmount || isNaN(Number(billAmount))) return alert(lang === 'te' ? 'దయచేసి చెల్లుబాటు అయ్యే మొత్తం నమోదు చేయండి' : 'Please enter a valid bill amount');

    let finalReceived = Number(billAmount);

    if (paymentMethod === 'CASH') {
      if (!receivedAmount || isNaN(Number(receivedAmount))) return alert(lang === 'te' ? 'దయచేసి అందిన మొత్తం నమోదు చేయండి' : 'Please enter the received cash amount');
      if (Number(receivedAmount) < Number(billAmount)) return alert(lang === 'te' ? 'అందిన మొత్తం బిల్ మొత్తం కంటే తక్కువగా ఉండకూడదు' : 'Received amount cannot be less than bill amount');
      finalReceived = Number(receivedAmount);
    }

    setIsPaying(true);
    const res = await createIndependentPayment(Number(billAmount), finalReceived, paymentMethod);
    setIsPaying(false);

    if (res.success) {
      if (res.changeAmount && res.changeAmount > 0) {
        alert(`${lang === 'te' ? 'చెల్లింపు సేకరించబడింది! మారుదల ఇవ్వండి:' : 'Payment collected! Give Change:'} ₹${res.changeAmount}`);
      }
      setBillAmount('');
      setReceivedAmount('');
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleAddCash = async () => {
    if (!cashAmount || isNaN(Number(cashAmount))) return;
    setIsSubmittingCash(true);
    await addManualCash(Number(cashAmount), 'Added to counter');
    setIsSubmittingCash(false);
    setCashAmount('');
    setShowAddCash(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] flex items-start justify-center pt-0 pb-8">
      <div className="w-full min-w-0 flex flex-col">

        {/* Language Toggle */}
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-3 text-sm font-bold tracking-wide ${lang === 'en' ? 'bg-white text-[#0d7c6b] border-b-2 border-[#0d7c6b]' : 'bg-gray-100 text-gray-500'}`}
          >
            {s.english}
          </button>
          <button
            onClick={() => setLang('te')}
            className={`flex-1 py-3 text-sm font-bold tracking-wide ${lang === 'te' ? 'bg-white text-[#0d7c6b] border-b-2 border-[#0d7c6b]' : 'bg-gray-100 text-gray-500'}`}
          >
            {s.telugu}
          </button>
        </div>

        {/* Counter Cash */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.counterCash}</div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 truncate">₹{stats.counterCash.toLocaleString('en-IN')}</div>
            </div>
            <button
              onClick={() => setShowAddCash(true)}
              className="bg-[#0d7c6b] hover:bg-[#0a6557] text-white text-[11px] font-bold px-3 sm:px-4 py-2 transition-colors shrink-0"
            >
              + {s.addCash}
            </button>
          </div>
          {showAddCash && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder={s.amountPlaceholder}
                className="flex-1 bg-gray-50 px-3 py-2 text-sm font-bold outline-none border border-gray-200 w-full sm:w-auto"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCash}
                  disabled={isSubmittingCash}
                  className="flex-1 sm:flex-none bg-[#0d7c6b] text-white px-4 py-2 text-sm font-bold"
                >
                  {s.add}
                </button>
                <button
                  onClick={() => setShowAddCash(false)}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-500 px-4 py-2 text-sm font-bold"
                >
                  {s.cancel}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Today's Earnings */}
        <div className="bg-[#0d7c6b] border-b border-[#0a6557] px-4 sm:px-5 py-4">
          <div className="text-[10px] font-bold text-white/70 tracking-wider">{s.todaysEarnings}</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">₹{stats.todaysEarnings.toLocaleString('en-IN')}</div>
        </div>

        {/* UPI & Cash Split */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 bg-white px-4 sm:px-5 py-4 border-r border-gray-200 min-w-0">
            <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.upi}</div>
            <div className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 truncate">₹{stats.upiTotal.toLocaleString('en-IN')}</div>
          </div>
          <div className="flex-1 bg-white px-4 sm:px-5 py-4 min-w-0">
            <div className="text-[10px] font-bold text-gray-500 tracking-wider">{s.cash}</div>
            <div className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 truncate">₹{stats.cashTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Payment Entry */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-4">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-3">{s.paymentEntry}</div>
          <div className="border border-gray-200 px-4 py-2 mb-3">
            <div className="text-[10px] font-bold text-gray-400 tracking-wider">{s.amount}</div>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => {
                setBillAmount(e.target.value);
                if (paymentMethod === 'CASH') setReceivedAmount(e.target.value);
              }}
              placeholder={s.enterAmount}
              className="w-full text-xl sm:text-2xl font-black bg-transparent outline-none text-gray-800 placeholder-gray-300 mt-0.5"
            />
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setPaymentMethod('UPI')}
              className={`flex-1 py-3 text-sm font-bold ${paymentMethod === 'UPI' ? 'bg-[#0d7c6b] text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {s.upi}
            </button>
            <button
              onClick={() => {
                setPaymentMethod('CASH');
                setReceivedAmount(billAmount);
              }}
              className={`flex-1 py-3 text-sm font-bold ${paymentMethod === 'CASH' ? 'bg-[#0d7c6b] text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {s.cash}
            </button>
          </div>
          {paymentMethod === 'CASH' && (
            <div className="mb-3">
              <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-1">{s.receivedAmount}</div>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder={s.enterReceived}
                className="w-full bg-white border border-gray-300 px-4 py-3 text-sm font-bold outline-none text-gray-800 placeholder-gray-300"
              />
              {billAmount && receivedAmount && Number(receivedAmount) >= Number(billAmount) && (
                <div className="mt-1 text-xs font-bold text-red-600">
                  {s.changeDue} ₹{Number(receivedAmount) - Number(billAmount)}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleCollectPayment}
            disabled={isPaying || !billAmount}
            className="w-full bg-[#1e293b] text-white hover:bg-gray-800 py-3 text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {s.addPayment}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white px-4 sm:px-5 py-4">
          <div className="font-bold text-gray-900 mb-3">{s.recentTransactions}</div>
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4 font-medium">{s.noTransactions}</div>
          ) : (
            stats.recentTransactions.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`text-[10px] font-bold px-2 py-0.5 tracking-wider shrink-0 ${tx.payment_method === 'UPI' ? 'bg-gray-200 text-gray-700' : 'bg-gray-800 text-white'}`}>
                    {tx.payment_method === 'UPI' ? s.upi : s.cash}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-medium truncate">
                      {new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} {tx.entry_type === 'MANUAL_CASH_ADDITION' ? s.manual : ''}
                    </div>
                  </div>
                </div>
                <div className="text-sm sm:text-base font-black text-gray-900 shrink-0">
                  ₹{tx.amount_collected.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
