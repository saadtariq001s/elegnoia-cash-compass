// src/hooks/useTransactions.ts - Fixed with proper data persistence
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types/transaction';
import { 
  loadUserTransactions, 
  saveUserTransactions, 
  addTransactionForUser,
  updateTransactionForUser,
  deleteTransactionForUser,
  exportUserTransactionsToCSV,
  importTransactionsFromCSV
} from '../utils/csvUtils';
import { useAuth } from '../contexts/AuthContext';

export const useTransactions = () => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions when user changes or component mounts
  const loadTransactions = useCallback(() => {
    if (!user || !isAuthenticated) {
      console.log('[useTransactions] No authenticated user, clearing transactions');
      setTransactions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useTransactions] Loading transactions for user:', user.username);
      const userTransactions = loadUserTransactions(user.id);
      
      setTransactions(userTransactions);
      console.log('[useTransactions] Loaded transactions:', userTransactions.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('[useTransactions] Load error:', err);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Load transactions when user changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Force reload transactions (useful for data refresh)
  const reloadTransactions = useCallback(() => {
    console.log('[useTransactions] Force reloading transactions');
    loadTransactions();
  }, [loadTransactions]);

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id'>) => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      console.log('[useTransactions] Adding transaction for user:', user.username);
      
      const newTransaction = addTransactionForUser(user.id, transactionData);
      
      if (newTransaction) {
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        console.log('[useTransactions] Transaction added successfully:', newTransaction.id);
        return true;
      } else {
        setError('Failed to add transaction');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
      console.error('[useTransactions] Add error:', err);
      setError(errorMessage);
      return false;
    }
  }, [user, isAuthenticated, transactions]);

  const deleteTransaction = useCallback((transactionId: string) => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      console.log('[useTransactions] Deleting transaction:', transactionId);
      
      const success = deleteTransactionForUser(user.id, transactionId);
      
      if (success) {
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        setTransactions(updatedTransactions);
        console.log('[useTransactions] Transaction deleted successfully');
        return true;
      } else {
        setError('Failed to delete transaction');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      console.error('[useTransactions] Delete error:', err);
      setError(errorMessage);
      return false;
    }
  }, [user, isAuthenticated, transactions]);

  const updateTransaction = useCallback((transactionId: string, updates: Partial<Transaction>) => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      console.log('[useTransactions] Updating transaction:', transactionId);
      
      const success = updateTransactionForUser(user.id, transactionId, updates);
      
      if (success) {
        const updatedTransactions = transactions.map(t => 
          t.id === transactionId ? { ...t, ...updates } : t
        );
        setTransactions(updatedTransactions);
        console.log('[useTransactions] Transaction updated successfully');
        return true;
      } else {
        setError('Failed to update transaction');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      console.error('[useTransactions] Update error:', err);
      setError(errorMessage);
      return false;
    }
  }, [user, isAuthenticated, transactions]);

  const exportToCSV = useCallback(() => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      console.log('[useTransactions] Exporting transactions to CSV for user:', user.username);
      exportUserTransactionsToCSV(user.id, user.username);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export transactions';
      console.error('[useTransactions] Export error:', err);
      setError(errorMessage);
    }
  }, [user, isAuthenticated]);

  const importFromCSV = useCallback(async (file: File): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useTransactions] Importing transactions from CSV for user:', user.username);
      
      const importedTransactions = await importTransactionsFromCSV(file, user.id);
      
      if (importedTransactions.length > 0) {
        // Reload all transactions to get the updated list
        const allTransactions = loadUserTransactions(user.id);
        setTransactions(allTransactions);
        
        console.log('[useTransactions] Successfully imported transactions:', importedTransactions.length);
        return true;
      } else {
        setError('No valid transactions found in the CSV file');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import transactions';
      console.error('[useTransactions] Import error:', err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Bulk operations
  const bulkDeleteTransactions = useCallback((transactionIds: string[]) => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      console.log('[useTransactions] Bulk deleting transactions:', transactionIds.length);
      
      let successCount = 0;
      
      for (const id of transactionIds) {
        if (deleteTransactionForUser(user.id, id)) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        const updatedTransactions = transactions.filter(t => !transactionIds.includes(t.id));
        setTransactions(updatedTransactions);
        console.log('[useTransactions] Bulk delete completed:', successCount, 'deleted');
        return true;
      } else {
        setError('Failed to delete any transactions');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk delete transactions';
      console.error('[useTransactions] Bulk delete error:', err);
      setError(errorMessage);
      return false;
    }
  }, [user, isAuthenticated, transactions]);

  const clearAllTransactions = useCallback(() => {
    if (!user || !isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      console.log('[useTransactions] Clearing all transactions for user:', user.username);
      
      const success = saveUserTransactions(user.id, []);
      
      if (success) {
        setTransactions([]);
        console.log('[useTransactions] All transactions cleared');
        return true;
      } else {
        setError('Failed to clear transactions');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear transactions';
      console.error('[useTransactions] Clear error:', err);
      setError(errorMessage);
      return false;
    }
  }, [user, isAuthenticated]);

  // Statistics and analytics
  const getTransactionStats = useCallback(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      transactionCount: transactions.length,
      averageTransaction: transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
    };
  }, [transactions]);

  return {
    // Data
    transactions,
    isLoading,
    error,
    
    // Basic operations
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loadTransactions,
    reloadTransactions,
    
    // CSV operations
    exportToCSV,
    importFromCSV,
    
    // Bulk operations
    bulkDeleteTransactions,
    clearAllTransactions,
    
    // Analytics
    getTransactionStats,
    
    // Utility
    clearError: () => setError(null),
  };
};