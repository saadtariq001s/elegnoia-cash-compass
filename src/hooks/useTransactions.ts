
import { useState } from 'react';
import Papa from 'papaparse';
import { Transaction } from '../types/transaction';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = () => {
    const saved = localStorage.getItem('agentic-transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTransactions(parsed);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    localStorage.setItem('agentic-transactions', JSON.stringify(newTransactions));
    setTransactions(newTransactions);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    const updated = [...transactions, newTransaction];
    saveTransactions(updated);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agentic-accounting-transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedTransactions = results.data
            .filter((row: any) => row.date && row.amount)
            .map((row: any) => ({
              id: row.id || Date.now().toString() + Math.random().toString(),
              date: row.date,
              type: row.type,
              category: row.category,
              amount: parseFloat(row.amount),
              description: row.description || '',
              project: row.project || '',
            }));
          
          saveTransactions([...transactions, ...importedTransactions]);
        } catch (error) {
          console.error('Error importing CSV:', error);
        }
      },
    });
  };

  return {
    transactions,
    addTransaction,
    loadTransactions,
    exportToCSV,
    importFromCSV,
  };
};
