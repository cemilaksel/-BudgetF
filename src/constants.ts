import { TransactionType } from './types';

export const COLORS = {
  primary: '#1a8a5c',
  income: '#27ae60',
  expense: '#e74c3c',
  background: '#f0f2f5',
  card: '#ffffff',
  blue: '#3498db',
  orange: '#f39c12',
};

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Maaş', emoji: '💰' },
  { id: 'interest', label: 'Faiz', emoji: '📈' },
  { id: 'rent_income', label: 'Kira Geliri', emoji: '🏠' },
  { id: 'other_income', label: 'Diğer', emoji: '✨' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'market', label: 'Market', emoji: '🛒' },
  { id: 'rent', label: 'Kira', emoji: '🏠' },
  { id: 'bills', label: 'Fatura', emoji: '📄' },
  { id: 'transport', label: 'Ulaşım', emoji: '🚌' },
  { id: 'credit_card', label: 'Kredi Kartı', emoji: '💳' },
  { id: 'health', label: 'Sağlık', emoji: '🏥' },
  { id: 'education', label: 'Eğitim', emoji: '🎓' },
  { id: 'entertainment', label: 'Eğlence', emoji: '🎮' },
  { id: 'clothing', label: 'Giyim', emoji: '👕' },
  { id: 'other_expense', label: 'Diğer', emoji: '📦' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const getCategoryInfo = (id: string) => {
  return ALL_CATEGORIES.find(c => c.id === id) || { label: id, emoji: '❓' };
};
