import React, { useState } from 'react';
import { BudgetLimit } from '../types';
import { EXPENSE_CATEGORIES, getCategoryInfo } from '../constants';
import { AlertTriangle, Plus, Trash2, X } from 'lucide-react';
import { cn } from '../types';
import { parseCurrency } from '../utils/formatters';

interface BudgetManagerProps {
  limits: BudgetLimit[];
  categoryExpenses: Record<string, number>;
  onAddLimit: (limit: Omit<BudgetLimit, 'id'>) => void;
  onDeleteLimit: (id: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  limits,
  categoryExpenses,
  onAddLimit,
  onDeleteLimit,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const exceededLimits = limits.filter(l => (categoryExpenses[l.category] || 0) > l.limit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limitAmount) return;

    onAddLimit({
      category,
      limit: parseCurrency(limitAmount),
    });
    setCategory('');
    setLimitAmount('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 mt-8 pb-12">
      {/* Warnings Section */}
      {exceededLimits.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2 px-1">
            <AlertTriangle size={16} />
            Bütçe Aşımları
          </h3>
          <div className="space-y-2">
            {exceededLimits.map((l) => {
              const catInfo = getCategoryInfo(l.category);
              const spent = categoryExpenses[l.category] || 0;
              const over = spent - l.limit;
              return (
                <div key={l.id} className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-in">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">
                    {catInfo.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-red-900">{catInfo.label}</h4>
                      <span className="text-xs font-black text-red-600">LİMİT AŞILDI!</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      {l.limit.toLocaleString('tr-TR')} TL limitinizi <b>{over.toLocaleString('tr-TR')} TL</b> aştınız.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Management Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kategori Limitleri</h3>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-2xl space-y-3 animate-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500 text-sm"
                required
              >
                <option value="">Seçin</option>
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Aylık Limit (TL)</label>
              <input
                type="text"
                inputMode="decimal"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                placeholder="0,00"
                className="w-full p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#1a8a5c] text-white rounded-xl font-bold text-sm shadow-md"
            >
              Limit Ekle
            </button>
          </form>
        )}

        <div className="space-y-3">
          {limits.length === 0 ? (
            <p className="text-center py-4 text-xs text-gray-400 italic">Henüz bir limit tanımlanmadı.</p>
          ) : (
            limits.map((l) => {
              const catInfo = getCategoryInfo(l.category);
              const spent = categoryExpenses[l.category] || 0;
              const percent = Math.min((spent / l.limit) * 100, 100);
              const isExceeded = spent > l.limit;

              return (
                <div key={l.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{catInfo.emoji}</span>
                      <span className="text-xs font-bold text-gray-700">{catInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400">
                        {spent.toLocaleString('tr-TR')} / {l.limit.toLocaleString('tr-TR')} TL
                      </span>
                      <button
                        onClick={() => onDeleteLimit(l.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        isExceeded ? "bg-red-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
