import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Calendar, Settings } from 'lucide-react';
import { cn, BudgetLimit } from '../types';
import { parseCurrency } from '../utils/formatters';
import { BudgetManager } from './BudgetManager';

interface DashboardProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    netFlow: number;
    dailyBudget: number;
    currentBalance: number;
    categoryExpenses: Record<string, number>;
  };
  initialBalance: number;
  setInitialBalance: (val: number) => void;
  limits: BudgetLimit[];
  onAddLimit: (limit: Omit<BudgetLimit, 'id'>) => void;
  onDeleteLimit: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  initialBalance, 
  setInitialBalance,
  limits,
  onAddLimit,
  onDeleteLimit
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState(initialBalance.toString());

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialBalance(parseCurrency(tempBalance));
    setIsEditingBalance(false);
  };

  const cards = [
    {
      title: 'Toplam Gelir',
      value: stats.totalIncome,
      icon: ArrowUpRight,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Toplam Gider',
      value: stats.totalExpense,
      icon: ArrowDownRight,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Net Akış',
      value: stats.netFlow,
      icon: Activity,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Günlük Bütçe',
      value: stats.dailyBudget,
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bgColor)}>
            <card.icon className={card.textColor} size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
            <p className={cn("text-lg font-bold truncate", card.textColor)}>
              {card.value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
          </div>
        </div>
      ))}
      
      <div className={cn(
        "col-span-2 p-6 rounded-3xl text-white shadow-xl mt-2 relative overflow-hidden transition-colors duration-500",
        stats.currentBalance >= 0 ? "bg-[#1a8a5c]" : "bg-[#e74c3c]"
      )}>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-80">Genel Durum (Bakiye)</p>
              <h2 className="text-3xl font-bold mt-1">
                {stats.currentBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </h2>
            </div>
            <button 
              onClick={() => setIsEditingBalance(!isEditingBalance)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>

          {isEditingBalance && (
            <form onSubmit={handleBalanceSubmit} className="mt-4 bg-white/10 p-4 rounded-2xl animate-in">
              <label className="text-[10px] font-bold uppercase opacity-70">Başlangıç Bakiyesi</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                  className="bg-white/20 border-none rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-1 focus:ring-white/50 w-full"
                  placeholder="0,00"
                />
                <button type="submit" className="bg-white text-[#1a8a5c] px-4 py-2 rounded-lg font-bold text-sm">
                  Güncelle
                </button>
              </div>
            </form>
          )}

          <p className="text-xs mt-4 opacity-70">
            {stats.netFlow >= 0 
              ? `Bu ay ${stats.netFlow.toLocaleString('tr-TR')} TL kardasınız.` 
              : `Bu ay ${Math.abs(stats.netFlow).toLocaleString('tr-TR')} TL içeridesiniz.`}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="col-span-2">
        <BudgetManager 
          limits={limits}
          categoryExpenses={stats.categoryExpenses}
          onAddLimit={onAddLimit}
          onDeleteLimit={onDeleteLimit}
        />
      </div>
    </div>
  );
};
