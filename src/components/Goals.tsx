import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Plus, Trash2 } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const Goals: React.FC<GoalsProps> = ({ goals, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onAdd({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
    });
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setShowAdd(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Tasarruf Hedefleri</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-[#1a8a5c] text-white rounded-xl shadow-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Hedef Adı</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Yeni Araba"
              className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Hedef Tutar</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0"
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Mevcut Birikim</label>
              <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#1a8a5c] text-white rounded-xl font-bold"
          >
            Hedef Ekle
          </button>
        </form>
      )}

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Target className="mx-auto mb-2 opacity-20" size={48} />
            <p>Henüz bir hedef belirlemediniz.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <Target size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900">{goal.title}</h4>
                  </div>
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-emerald-600">%{progress.toFixed(1)}</span>
                    <span className="text-gray-400">
                      {goal.currentAmount.toLocaleString('tr-TR')} / {goal.targetAmount.toLocaleString('tr-TR')} TL
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
