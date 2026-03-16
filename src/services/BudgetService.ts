import { Transaction, Goal, BudgetLimit, TransactionType } from '../types';

/**
 * BudgetService - Model Layer
 * Handles all business logic and data calculations for the budget application.
 * Adheres to SRP by isolating data processing from UI components.
 */
export class BudgetService {
  /**
   * Generates a unique ID compatible with older browsers.
   */
  static generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  /**
   * Calculates budget statistics based on transactions and initial balance.
   */
  static calculateStats(transactions: Transaction[], initialBalance: number) {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const netFlow = totalIncome - totalExpense;
    const currentBalance = initialBalance + netFlow;

    // Category-wise expenses for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryExpenses: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === TransactionType.EXPENSE) {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
          categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        }
      }
    });

    // Daily budget calculation
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const remainingDays = lastDayOfMonth - today.getDate() + 1;
    const dailyBudget = currentBalance > 0 ? currentBalance / remainingDays : 0;

    return {
      totalIncome,
      totalExpense,
      netFlow,
      currentBalance,
      dailyBudget,
      categoryExpenses,
    };
  }

  /**
   * Safe localStorage access.
   */
  static getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  static setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }
}
