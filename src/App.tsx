import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { History } from './components/History';
import { Statistics } from './components/Statistics';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { ApiKeyScreen } from './components/ApiKeyScreen';
import { useBudget } from './hooks/useBudget';
import { TabType } from './types';
import { AiService } from './services/AiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const key = AiService.getApiKey();
    setHasApiKey(!!key);
  }, []);

  const { 
    transactions, 
    goals, 
    limits,
    initialBalance,
    setInitialBalance,
    addTransaction, 
    deleteTransaction, 
    addGoal, 
    deleteGoal, 
    addLimit,
    deleteLimit,
    stats 
  } = useBudget();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            initialBalance={initialBalance} 
            setInitialBalance={setInitialBalance} 
            limits={limits}
            onAddLimit={addLimit}
            onDeleteLimit={deleteLimit}
          />
        );
      case 'add':
        return (
          <AddTransaction 
            onAdd={addTransaction} 
            onSuccess={() => setActiveTab('history')} 
          />
        );
      case 'history':
        return (
          <History 
            transactions={transactions} 
            onDelete={deleteTransaction} 
          />
        );
      case 'stats':
        return <Statistics transactions={transactions} />;
      case 'goals':
        return (
          <Goals 
            goals={goals} 
            onAdd={addGoal} 
            onDelete={deleteGoal} 
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            stats={stats} 
            initialBalance={initialBalance} 
            setInitialBalance={setInitialBalance} 
            limits={limits}
            onAddLimit={addLimit}
            onDeleteLimit={deleteLimit}
          />
        );
    }
  };

  if (hasApiKey === null) return null;

  if (!hasApiKey) {
    return <ApiKeyScreen onKeySaved={() => setHasApiKey(true)} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      balance={stats.currentBalance}
    >
      {renderContent()}
    </Layout>
  );
}
