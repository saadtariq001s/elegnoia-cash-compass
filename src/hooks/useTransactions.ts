// src/hooks/useTransactions.ts - Updated with Auth
import { useState } from 'react';
import Papa from 'papaparse';
import { Transaction } from '../types/transaction';
import { loadUserTransactions, saveUserTransactions, exportUserTransactionsToCSV } from '../utils/csvUtils';
import { useAuth } from '../contexts/AuthContext';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = () => {
    if (!user) return;
    
    try {
      const userTransactions = loadUserTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    if (!user) return;
    
    saveUserTransactions(user.id, newTransactions);
    setTransactions(newTransactions);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `${user.id}-${Date.now()}`,
    };
    
    const updated = [...transactions, newTransaction];
    saveTransactions(updated);
  };

  const deleteTransaction = (transactionId: string) => {
    if (!user) return;
    
    const updated = transactions.filter(t => t.id !== transactionId);
    saveTransactions(updated);
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    if (!user) return;
    
    const updated = transactions.map(t => 
      t.id === transactionId ? { ...t, ...updates } : t
    );
    saveTransactions(updated);
  };

  const exportToCSV = () => {
    if (!user) return;
    
    exportUserTransactionsToCSV(user.id, user.username);
  };

  const importFromCSV = (file: File) => {
    if (!user) return;
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedTransactions = results.data
            .filter((row: any) => row.date && row.amount)
            .map((row: any) => ({
              id: row.id || `${user.id}-${Date.now()}-${Math.random().toString()}`,
              date: row.date,
              type: row.type,
              category: row.category,
              amount: parseFloat(row.amount),
              description: row.description || '',
              project: row.project || '',
            }));
          
          const updated = [...transactions, ...importedTransactions];
          saveTransactions(updated);
        } catch (error) {
          console.error('Error importing CSV:', error);
        }
      },
    });
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loadTransactions,
    exportToCSV,
    importFromCSV,
  };
};