import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryInfo } from '../constants';
import { Trash2, Filter } from 'lucide-react';
import { cn } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface HistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');

  const filteredTransactions = transactions.filter(t => 
    filter === 'ALL' ? true : t.type === filter
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setFilter('ALL')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
            filter === 'ALL' ? "bg-gray-100 text-gray-900" : "text-gray-400"
          )}
        >
          Tümü
        </button>
        <button
          onClick={() => setFilter(TransactionType.INCOME)}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
            filter === TransactionType.INCOME ? "bg-emerald-100 text-emerald-700" : "text-gray-400"
          )}
        >
          Gelirler
        </button>
        <button
          onClick={() => setFilter(TransactionType.EXPENSE)}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
            filter === TransactionType.EXPENSE ? "bg-red-100 text-red-700" : "text-gray-400"
          )}
        >
          Giderler
        </button>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Filter className="mx-auto mb-2 opacity-20" size={48} />
            <p>Henüz kayıt bulunamadı.</p>
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const catInfo = getCategoryInfo(t.category);
            return (
              <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {catInfo.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 truncate">{catInfo.label}</h4>
                    <span className={cn(
                      "font-bold whitespace-nowrap",
                      t.type === TransactionType.INCOME ? "text-emerald-600" : "text-red-600"
                    )}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}
                      {t.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400 truncate">{t.note || 'Not yok'}</p>
                    <p className="text-[10px] text-gray-300 uppercase font-bold">
                      {format(new Date(t.date), 'dd MMM yyyy', { locale: tr })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
