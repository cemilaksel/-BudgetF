import React, { useState } from 'react';
import { TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, COLORS } from '../constants';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '../types';
import { parseCurrency } from '../utils/formatters';

interface AddTransactionProps {
  onAdd: (transaction: any) => void;
  onSuccess: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, onSuccess }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAdd({
      amount: parseCurrency(amount),
      type,
      category,
      note,
      date,
    });
    onSuccess();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setType(TransactionType.INCOME)}
          className={cn(
            "flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2",
            type === TransactionType.INCOME 
              ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
              : "bg-white border-transparent text-gray-500 shadow-sm"
          )}
        >
          <ArrowUpCircle className={cn(type === TransactionType.INCOME ? "text-emerald-500" : "text-gray-400")} />
          <span className="font-semibold">Gelir</span>
        </button>
        <button
          onClick={() => setType(TransactionType.EXPENSE)}
          className={cn(
            "flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2",
            type === TransactionType.EXPENSE 
              ? "bg-red-50 border-red-500 text-red-700" 
              : "bg-white border-transparent text-gray-500 shadow-sm"
          )}
        >
          <ArrowDownCircle className={cn(type === TransactionType.EXPENSE ? "text-red-500" : "text-gray-400")} />
          <span className="font-semibold">Gider</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tutar (TL)</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00 veya 0.00"
            className="w-full text-4xl font-bold p-4 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <p className="text-[10px] text-gray-400 ml-1">İpucu: Binlik ayırıcı için nokta, kuruş için virgül kullanabilirsiniz.</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Not (İsteğe bağlı)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Kısa bir not ekleyin..."
            className="w-full p-4 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#1a8a5c] text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
        >
          <PlusCircle size={24} />
          Kaydet
        </button>
      </form>
    </div>
  );
};
