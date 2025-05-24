
export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  project?: string;
}

export type TransactionCategory = 
  | 'project-income'
  | 'service-income'
  | 'subscription'
  | 'salary'
  | 'tools'
  | 'marketing'
  | 'office'
  | 'other';

export const INCOME_CATEGORIES = [
  { value: 'project-income', label: 'Project Income' },
  { value: 'service-income', label: 'Service Income' },
  { value: 'other', label: 'Other Income' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'salary', label: 'Employee Salaries' },
  { value: 'subscription', label: 'Tool Subscriptions' },
  { value: 'tools', label: 'Tools & Software' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'office', label: 'Office Expenses' },
  { value: 'other', label: 'Other Expenses' },
];
