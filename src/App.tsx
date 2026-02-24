/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Calculator, 
  Calendar as CalendarIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Entry {
  id: string;
  date: string;
  deposit: number;
  coupons: number;
  debitNote: string;
  invoices: number;
  creditNote: string;
}

const INITIAL_ENTRIES: Entry[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return {
    id: Math.random().toString(36).substr(2, 9),
    date: date.toISOString().split('T')[0],
    deposit: 0,
    coupons: 0,
    debitNote: '',
    invoices: 0,
    creditNote: '',
  };
});

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);

  const totals = useMemo(() => {
    const sumDeposits = entries.reduce((acc, curr) => acc + (curr.deposit || 0), 0);
    const sumCoupons = entries.reduce((acc, curr) => acc + (curr.coupons || 0), 0);
    const sumInvoices = entries.reduce((acc, curr) => acc + (curr.invoices || 0), 0);
    
    const totalDebit = sumDeposits + sumCoupons;
    const totalCredit = sumInvoices;
    const finalBalance = totalDebit - totalCredit;

    return {
      sumDeposits,
      sumCoupons,
      totalDebit,
      sumInvoices,
      totalCredit,
      finalBalance
    };
  }, [entries]);

  const updateEntry = (id: string, field: keyof Entry, value: string | number) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans p-4 md:p-8" dir="rtl">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Calculator size={28} />
            </div>
            دفتر صندوق محطة الوقود
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <CalendarIcon size={16} />
            كشف حساب لفترة أسبوعين (14 يوماً)
          </p>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-700 font-medium"
          >
            <Printer size={18} />
            طباعة الكشف
          </button>
          <button 
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-md font-medium"
          >
            <Save size={18} />
            حفظ البيانات
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Main Ledger Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8 print:shadow-none print:border-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th rowSpan={2} className="p-4 text-slate-600 font-bold border-l border-slate-200 w-32">التاريخ</th>
                  <th colSpan={3} className="p-3 text-emerald-700 font-bold border-l border-slate-200 bg-emerald-50/50 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ArrowUpCircle size={18} />
                      مدين (إيرادات)
                    </div>
                  </th>
                  <th colSpan={2} className="p-3 text-rose-700 font-bold bg-rose-50/50 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ArrowDownCircle size={18} />
                      دائن (مصروفات)
                    </div>
                  </th>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                  <th className="p-3 text-emerald-600 font-medium border-l border-slate-200 text-center">إيداع</th>
                  <th className="p-3 text-emerald-600 font-medium border-l border-slate-200 text-center">بونات</th>
                  <th className="p-3 text-emerald-600 font-medium border-l border-slate-200 text-center">ملاحظة</th>
                  <th className="p-3 text-rose-600 font-medium border-l border-slate-200 text-center">فواتير</th>
                  <th className="p-3 text-rose-600 font-medium text-center">ملاحظة</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {entries.map((entry, index) => (
                    <motion.tr 
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-3 border-l border-slate-200">
                        <input 
                          type="date" 
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-mono text-sm"
                        />
                      </td>
                      
                      {/* Debit Section */}
                      <td className="p-2 border-l border-slate-200 bg-emerald-50/20">
                        <input 
                          type="number" 
                          value={entry.deposit || ''}
                          placeholder="0.00"
                          onChange={(e) => updateEntry(entry.id, 'deposit', parseFloat(e.target.value) || 0)}
                          className="w-full text-center bg-transparent border-none focus:ring-0 text-emerald-700 font-bold placeholder:text-emerald-200"
                        />
                      </td>
                      <td className="p-2 border-l border-slate-200 bg-emerald-50/20">
                        <input 
                          type="number" 
                          value={entry.coupons || ''}
                          placeholder="0.00"
                          onChange={(e) => updateEntry(entry.id, 'coupons', parseFloat(e.target.value) || 0)}
                          className="w-full text-center bg-transparent border-none focus:ring-0 text-emerald-700 font-bold placeholder:text-emerald-200"
                        />
                      </td>
                      <td className="p-2 border-l border-slate-200 bg-emerald-50/10">
                        <input 
                          type="text" 
                          value={entry.debitNote}
                          placeholder="ملاحظة..."
                          onChange={(e) => updateEntry(entry.id, 'debitNote', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 text-slate-500 text-sm placeholder:text-slate-300"
                        />
                      </td>

                      {/* Credit Section */}
                      <td className="p-2 border-l border-slate-200 bg-rose-50/20">
                        <input 
                          type="number" 
                          value={entry.invoices || ''}
                          placeholder="0.00"
                          onChange={(e) => updateEntry(entry.id, 'invoices', parseFloat(e.target.value) || 0)}
                          className="w-full text-center bg-transparent border-none focus:ring-0 text-rose-700 font-bold placeholder:text-rose-200"
                        />
                      </td>
                      <td className="p-2 bg-rose-50/10">
                        <input 
                          type="text" 
                          value={entry.creditNote}
                          placeholder="ملاحظة..."
                          onChange={(e) => updateEntry(entry.id, 'creditNote', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 text-slate-500 text-sm placeholder:text-slate-300"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 print:block">
          {/* Detailed Summary Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 print:border-slate-300 print:shadow-none print:mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <FileText className="text-emerald-600" />
              ملخص الحساب الختامي
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Debit Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span>إجمالي الإيداعات:</span>
                  <span className="font-mono font-semibold text-emerald-600">{totals.sumDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>إجمالي البونات:</span>
                  <span className="font-mono font-semibold text-emerald-600">{totals.sumCoupons.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800">إجمالي المدين:</span>
                  <span className="font-mono text-xl font-black text-emerald-700">{totals.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Credit Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span>إجمالي الفواتير:</span>
                  <span className="font-mono font-semibold text-rose-600">{totals.sumInvoices.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 italic text-sm">
                  <span>(لا توجد بنود أخرى)</span>
                  <span>0.00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800">إجمالي الدائن:</span>
                  <span className="font-mono text-xl font-black text-rose-700">{totals.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Final Balance Highlight */}
            <div className="mt-10 bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner print:bg-white print:text-slate-900 print:border-2 print:border-slate-900">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${totals.finalBalance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} print:text-slate-900`}>
                  <Calculator size={32} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-bold print:text-slate-600">صافي الفرق (الرصيد النهائي)</p>
                  <h3 className="text-3xl font-black font-mono">
                    {totals.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${totals.finalBalance >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'} print:border print:border-slate-900 print:text-slate-900`}>
                  {totals.finalBalance >= 0 ? 'فائض / رصيد إيجابي' : 'عجز / رصيد سلبي'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-emerald-700 text-white rounded-2xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden print:hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info size={120} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info size={20} />
                إرشادات المحاسبة
              </h3>
              <ul className="space-y-3 text-emerald-100 text-sm">
                <li className="flex gap-2">
                  <span className="text-emerald-300 font-bold">•</span>
                  يتم تسجيل كافة الإيرادات النقدية في خانة الإيداع.
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-300 font-bold">•</span>
                  يتم تسجيل مبيعات الآجل أو الكوبونات في خانة البونات.
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-300 font-bold">•</span>
                  يتم تسجيل المشتريات والمصروفات في خانة الفواتير.
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-emerald-600/50">
              <p className="text-xs text-emerald-200 leading-relaxed">
                هذا النموذج مصمم ليطابق الدفاتر اليدوية التقليدية مع توفير دقة حسابية فورية.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Signature Section for Print */}
      <footer className="max-w-7xl mx-auto mt-12 hidden print:grid grid-cols-3 gap-8 text-center border-t border-slate-200 pt-8">
        <div>
          <p className="font-bold text-slate-800 mb-8">توقيع المحاسب</p>
          <div className="border-b border-slate-400 w-32 mx-auto"></div>
        </div>
        <div>
          <p className="font-bold text-slate-800 mb-8">توقيع مدير المحطة</p>
          <div className="border-b border-slate-400 w-32 mx-auto"></div>
        </div>
        <div>
          <p className="font-bold text-slate-800 mb-8">ختم المؤسسة</p>
          <div className="border-b border-slate-400 w-32 mx-auto"></div>
        </div>
      </footer>

      {/* Global CSS for Print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          input { border: none !important; outline: none !important; }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          .no-print { display: none !important; }
          @page { margin: 1cm; }
        }
      `}} />
    </div>
  );
}
