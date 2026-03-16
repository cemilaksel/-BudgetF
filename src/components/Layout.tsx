import React from 'react';
import { LayoutGrid, Plus, History as HistoryIcon, BarChart3, Target } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  balance: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, balance }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Panel' },
    { id: 'add', icon: Plus, label: 'Ekle' },
    { id: 'history', icon: HistoryIcon, label: 'Geçmiş' },
    { id: 'stats', icon: BarChart3, label: 'İstatistik' },
    { id: 'goals', icon: Target, label: 'Hedefler' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col w-full max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className={cn(
        "p-6 pt-12 text-white rounded-b-[40px] shadow-lg z-20 transition-colors duration-500",
        balance >= 0 ? "bg-[#1a8a5c]" : "bg-[#e74c3c]"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold tracking-tight">Budget Analyzer</h1>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold">CA</span>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm opacity-80 font-medium">Toplam Bakiye</p>
          <h2 className="text-4xl font-black mt-1">
            {balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </h2>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 -mt-6 z-10">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-30 rounded-t-[32px] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              activeTab === tab.id ? "text-[#1a8a5c] scale-110" : "text-gray-400"
            )}
          >
            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
