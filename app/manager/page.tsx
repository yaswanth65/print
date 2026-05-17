'use client';

import { useState, useEffect } from 'react';
import { getDashboardMetrics, addManualCash, createIndependentPayment } from '@/app/actions/app-actions';
import { 
  Wallet, 
  TrendingUp, 
  Zap, 
  Banknote, 
  Plus, 
  Delete, 
  ArrowRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { formatIST } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    viewAll: 'View all',
    txns: 'Txns',
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
    viewAll: 'అన్నీ చూడండి',
    txns: 'లావాదేవీలు',
  },
};

export default function ManagerDashboard() {
  const [lang, setLang] = useState<Lang>('te');

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
      // In the new UI, we might need to handle received amount if it's different.
      // For now, if not explicitly entered, assume exact amount.
      finalReceived = receivedAmount ? Number(receivedAmount) : Number(billAmount);
      
      if (finalReceived < Number(billAmount)) {
        return alert(lang === 'te' ? 'అందిన మొత్తం బిల్ మొత్తం కంటే తక్కువగా ఉండకూడదు' : 'Received amount cannot be less than bill amount');
      }
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

  const handleKeypadPress = (val: string) => {
    if (val === 'delete') {
      setBillAmount(prev => prev.slice(0, -1));
    } else if (val === '.') {
      if (!billAmount.includes('.')) {
        setBillAmount(prev => prev + val);
      }
    } else {
      // Limit to reasonable length
      if (billAmount.length < 7) {
        setBillAmount(prev => prev + val);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans">
      {/* Language Toggle Fixed at Top */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-2 flex justify-end gap-2 border-b border-gray-100">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-[#0D7C6B] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
        >
          {s.english}
        </button>
        <button
          onClick={() => setLang('te')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'te' ? 'bg-[#0D7C6B] text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
        >
          {s.telugu}
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        
        {/* 1. COUNTER CASH CARD */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
              <Wallet size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.counterCash}</div>
              <div className="text-2xl font-black text-gray-900">₹{stats.counterCash.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddCash(true)}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-green-100"
          >
            <Plus size={16} strokeWidth={3} />
            {s.addCash}
          </button>
        </motion.div>

        {/* Add Cash Modal Overlay */}
        <AnimatePresence>
          {showAddCash && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl"
              >
                <div className="text-lg font-black mb-4">{s.addCash}</div>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder={s.amountPlaceholder}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-xl font-bold border-2 border-transparent focus:border-[#0D7C6B] outline-none mb-4 transition-all"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddCash(false)}
                    className="flex-1 py-3 text-sm font-bold text-gray-400 bg-gray-100 rounded-2xl"
                  >
                    {s.cancel}
                  </button>
                  <button
                    onClick={handleAddCash}
                    disabled={isSubmittingCash || !cashAmount}
                    className="flex-1 py-3 text-sm font-bold text-white bg-[#0D7C6B] rounded-2xl disabled:opacity-50"
                  >
                    {s.add}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. PAYMENT ENTRY COMPONENT */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-5">
          <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.paymentEntry}</div>
          
          {/* Amount Display */}
          <div className="relative group">
            <div className={`w-full bg-[#F8FAFC] rounded-2xl px-6 py-6 border-2 transition-all flex items-center justify-between ${billAmount ? 'border-[#6366F1]' : 'border-gray-100'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{s.amount}</span>
                <div className={`font-black whitespace-nowrap overflow-hidden text-ellipsis ${billAmount ? 'text-4xl text-gray-900' : 'text-[1.375rem] text-gray-300'}`}>
                  {billAmount ? `₹${billAmount}` : s.enterAmount}
                  <span className="animate-pulse text-[#6366F1]">|</span>
                </div>
              </div>
              {billAmount && (
                <button onClick={() => setBillAmount('')} className="p-2 text-gray-300 hover:text-gray-500">
                  <Delete size={24} />
                </button>
              )}
            </div>
          </div>

          {/* UPI / CASH Toggle */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1.5">
            <button
              onClick={() => setPaymentMethod('UPI')}
              className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'UPI' ? 'bg-[#7C3AED] text-white shadow-md' : 'bg-transparent text-gray-400'}`}
            >
              <Zap size={18} fill={paymentMethod === 'UPI' ? 'currentColor' : 'none'} />
              {s.upi}
            </button>
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'bg-[#10B981] text-white shadow-md' : 'bg-transparent text-gray-400'}`}
            >
              <Banknote size={18} />
              {s.cash}
            </button>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'delete'].map((key) => (
              <button
                key={key}
                onClick={() => handleKeypadPress(key.toString())}
                className={`h-16 rounded-2xl text-xl font-black flex items-center justify-center transition-all active:scale-95 ${key === 'delete' ? 'bg-red-50 text-red-500' : 'bg-white border border-gray-100 text-gray-800 shadow-sm hover:bg-gray-50'}`}
              >
                {key === 'delete' ? <Delete size={24} /> : key}
              </button>
            ))}
          </div>

          {/* Add Payment Button */}
          <button
            onClick={handleCollectPayment}
            disabled={isPaying || !billAmount}
            className={`w-full py-5 rounded-[20px] text-sm font-black tracking-widest flex items-center justify-center gap-3 transition-all ${!billAmount ? 'bg-gray-100 text-gray-300' : 'bg-[#1E293B] text-white shadow-xl shadow-gray-200 hover:bg-black active:scale-[0.98]'}`}
          >
            <Plus size={20} strokeWidth={3} />
            {s.addPayment.toUpperCase()}
          </button>
        </div>

        {/* 3. ANALYTICS (Following Payment Entry) */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Today's Earnings Card */}
          <div className="col-span-2 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase">{s.todaysEarnings}</div>
              <div className="text-3xl font-black mt-1">₹{stats.todaysEarnings.toLocaleString('en-IN')}</div>
            </div>
            {/* Visual Sparkline Placeholder */}
            <div className="absolute right-6 bottom-6 w-24 h-12 opacity-30">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-white stroke-[4] fill-none">
                <path d="M0,35 L20,30 L40,32 L60,15 L80,20 L100,5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <TrendingUp className="absolute -top-4 -right-4 w-24 h-24 text-white/5" />
          </div>

          {/* UPI Total */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.upi}</div>
            <div className="text-xl font-black text-gray-900">₹{stats.upiTotal.toLocaleString('en-IN')}</div>
            <div className="text-[10px] font-bold text-gray-300 mt-1">
              {stats.recentTransactions.filter((tx:any) => tx.payment_method === 'UPI').length} {s.txns}
            </div>
          </div>

          {/* Cash Total */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Banknote size={20} />
            </div>
            <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.cash}</div>
            <div className="text-xl font-black text-gray-900">₹{stats.cashTotal.toLocaleString('en-IN')}</div>
            <div className="text-[10px] font-bold text-gray-300 mt-1">
              {stats.recentTransactions.filter((tx:any) => tx.payment_method === 'CASH').length} {s.txns}
            </div>
          </div>
        </div>

        {/* 4. RECENT TRANSACTIONS (Now at the end) */}
        <div className="pt-4 pb-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#0D7C6B]" />
              <h2 className="text-base font-black text-gray-900">{s.recentTransactions}</h2>
            </div>
            <button className="text-xs font-bold text-[#6366F1] flex items-center gap-1">
              {s.viewAll} <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {stats.recentTransactions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center text-gray-300 text-sm font-bold border border-dashed border-gray-200">
                {s.noTransactions}
              </div>
            ) : (
              stats.recentTransactions.slice(0, 5).map((tx: any) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  key={tx.id} 
                  className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.payment_method === 'UPI' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {tx.payment_method === 'UPI' ? <Zap size={18} /> : <Banknote size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${tx.payment_method === 'UPI' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {tx.payment_method === 'UPI' ? s.upi : s.cash}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {formatIST(tx.created_at)}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-300 font-medium mt-0.5">{tx.entry_type === 'MANUAL_CASH_ADDITION' ? s.manual : ''}</div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-gray-900">
                    ₹{tx.amount_collected.toLocaleString('en-IN')}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
