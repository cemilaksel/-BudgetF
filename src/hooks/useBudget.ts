import { useState, useEffect, useMemo } from 'react';
import { Transaction, Goal, BudgetLimit } from '../types';
import { BudgetService } from '../services/BudgetService';

/**
 * useBudget - Controller Layer
 * Manages the state and coordinates between the View and the Model (BudgetService).
 */
export function useBudget() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    BudgetService.getStorageItem('budget_transactions', [])
  );

  const [goals, setGoals] = useState<Goal[]>(() => 
    BudgetService.getStorageItem('budget_goals', [])
  );

  const [limits, setLimits] = useState<BudgetLimit[]>(() => 
    BudgetService.getStorageItem('budget_limits', [])
  );

  const [initialBalance, setInitialBalance] = useState<number>(() => 
    BudgetService.getStorageItem('budget_initial_balance', 0)
  );

  useEffect(() => {
    BudgetService.setStorageItem('budget_transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    BudgetService.setStorageItem('budget_goals', goals);
  }, [goals]);

  useEffect(() => {
    BudgetService.setStorageItem('budget_limits', limits);
  }, [limits]);

  useEffect(() => {
    BudgetService.setStorageItem('budget_initial_balance', initialBalance);
  }, [initialBalance]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: BudgetService.generateId(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: BudgetService.generateId(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addLimit = (limit: Omit<BudgetLimit, 'id'>) => {
    const newLimit = {
      ...limit,
      id: BudgetService.generateId(),
    };
    setLimits(prev => [...prev, newLimit]);
  };

  const deleteLimit = (id: string) => {
    setLimits(prev => prev.filter(l => l.id !== id));
  };

  const stats = useMemo(() => 
    BudgetService.calculateStats(transactions, initialBalance),
    [transactions, initialBalance]
  );

  return {
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
    stats,
  };
}
