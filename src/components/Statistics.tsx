import React from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryInfo, COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface StatisticsProps {
  transactions: Transaction[];
}

export const Statistics: React.FC<StatisticsProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === getCategoryInfo(t.category).label);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: getCategoryInfo(t.category).label, value: t.amount });
      }
      return acc;
    }, []);

  const monthlyData = [
    {
      name: 'Gelir',
      tutar: transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0)
    },
    {
      name: 'Gider',
      tutar: transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0)
    }
  ];

  const CHART_COLORS = ['#1a8a5c', '#27ae60', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6'];

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Gider Dağılımı</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {expenseData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
              <span className="text-xs text-gray-600 truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Gelir vs Gider</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="tutar" radius={[10, 10, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.income : COLORS.expense} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
