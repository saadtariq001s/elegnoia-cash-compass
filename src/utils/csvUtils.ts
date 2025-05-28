// src/utils/csvUtils.ts - Fixed for proper data persistence
import Papa from 'papaparse';
import { User } from '../types/auth';
import { Transaction } from '../types/transaction';

// Storage keys
const USERS_STORAGE_KEY = 'agentic-users-database';
const TRANSACTIONS_STORAGE_PREFIX = 'agentic-transactions-user-';
const CURRENT_USER_KEY = 'agentic-current-user-session';

// Default users
const defaultUsers: User[] = [
  {
    id: 'user-1',
    username: 'Saad',
    password: 'elegnoiaceo',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'user-2',
    username: 'Areeba',
    password: 'elegnoiaai',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Enhanced error handling and logging
const logError = (operation: string, error: any) => {
  console.error(`[CSV Utils] ${operation} failed:`, error);
};

const logInfo = (operation: string, data?: any) => {
  console.log(`[CSV Utils] ${operation}`, data ? data : '');
};

// User Management Functions
export const initializeUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      logInfo('Initializing with default users');
      saveUsers(defaultUsers);
      return defaultUsers;
    }
    
    const users = JSON.parse(stored);
    logInfo('Loaded existing users', { count: users.length });
    return users;
  } catch (error) {
    logError('initializeUsers', error);
    saveUsers(defaultUsers);
    return defaultUsers;
  }
};

export const loadUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      return initializeUsers();
    }
    
    const users = JSON.parse(stored);
    // Validate users data
    if (!Array.isArray(users)) {
      logError('loadUsers', 'Invalid users data format');
      return initializeUsers();
    }
    
    return users;
  } catch (error) {
    logError('loadUsers', error);
    return initializeUsers();
  }
};

export const saveUsers = (users: User[]): boolean => {
  try {
    const usersData = JSON.stringify(users, null, 2);
    localStorage.setItem(USERS_STORAGE_KEY, usersData);
    logInfo('Users saved successfully', { count: users.length });
    return true;
  } catch (error) {
    logError('saveUsers', error);
    return false;
  }
};

export const findUserByCredentials = (username: string, password: string): User | null => {
  try {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      logInfo('User found', { username: user.username, role: user.role });
    } else {
      logInfo('User not found', { username });
    }
    return user || null;
  } catch (error) {
    logError('findUserByCredentials', error);
    return null;
  }
};

export const addNewUser = (userData: Omit<User, 'id'>): User | null => {
  try {
    const users = loadUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
      logError('addNewUser', 'Username already exists');
      return null;
    }
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const updatedUsers = [...users, newUser];
    if (saveUsers(updatedUsers)) {
      logInfo('New user added', { username: newUser.username, id: newUser.id });
      return newUser;
    }
    
    return null;
  } catch (error) {
    logError('addNewUser', error);
    return null;
  }
};

// Transaction Management Functions
export const getTransactionStorageKey = (userId: string): string => {
  return `${TRANSACTIONS_STORAGE_PREFIX}${userId}`;
};

export const loadUserTransactions = (userId: string): Transaction[] => {
  try {
    if (!userId) {
      logError('loadUserTransactions', 'No userId provided');
      return [];
    }
    
    const storageKey = getTransactionStorageKey(userId);
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      logInfo('No transactions found for user', { userId });
      return [];
    }
    
    const transactions = JSON.parse(stored);
    
    // Validate transactions data
    if (!Array.isArray(transactions)) {
      logError('loadUserTransactions', 'Invalid transactions data format');
      return [];
    }
    
    logInfo('Loaded user transactions', { userId, count: transactions.length });
    return transactions;
  } catch (error) {
    logError('loadUserTransactions', error);
    return [];
  }
};

export const saveUserTransactions = (userId: string, transactions: Transaction[]): boolean => {
  try {
    if (!userId) {
      logError('saveUserTransactions', 'No userId provided');
      return false;
    }
    
    const storageKey = getTransactionStorageKey(userId);
    const transactionsData = JSON.stringify(transactions, null, 2);
    
    localStorage.setItem(storageKey, transactionsData);
    logInfo('User transactions saved', { userId, count: transactions.length });
    return true;
  } catch (error) {
    logError('saveUserTransactions', error);
    return false;
  }
};

export const addTransactionForUser = (userId: string, transaction: Omit<Transaction, 'id'>): Transaction | null => {
  try {
    const existingTransactions = loadUserTransactions(userId);
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const updatedTransactions = [...existingTransactions, newTransaction];
    
    if (saveUserTransactions(userId, updatedTransactions)) {
      logInfo('Transaction added for user', { userId, transactionId: newTransaction.id });
      return newTransaction;
    }
    
    return null;
  } catch (error) {
    logError('addTransactionForUser', error);
    return null;
  }
};

export const updateTransactionForUser = (userId: string, transactionId: string, updates: Partial<Transaction>): boolean => {
  try {
    const transactions = loadUserTransactions(userId);
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex === -1) {
      logError('updateTransactionForUser', 'Transaction not found');
      return false;
    }
    
    transactions[transactionIndex] = { ...transactions[transactionIndex], ...updates };
    
    return saveUserTransactions(userId, transactions);
  } catch (error) {
    logError('updateTransactionForUser', error);
    return false;
  }
};

export const deleteTransactionForUser = (userId: string, transactionId: string): boolean => {
  try {
    const transactions = loadUserTransactions(userId);
    const filteredTransactions = transactions.filter(t => t.id !== transactionId);
    
    if (filteredTransactions.length === transactions.length) {
      logError('deleteTransactionForUser', 'Transaction not found');
      return false;
    }
    
    return saveUserTransactions(userId, filteredTransactions);
  } catch (error) {
    logError('deleteTransactionForUser', error);
    return false;
  }
};

// Session Management
export const saveCurrentUserSession = (user: User): boolean => {
  try {
    const userData = JSON.stringify(user);
    localStorage.setItem(CURRENT_USER_KEY, userData);
    logInfo('User session saved', { username: user.username });
    return true;
  } catch (error) {
    logError('saveCurrentUserSession', error);
    return false;
  }
};

export const loadCurrentUserSession = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) {
      return null;
    }
    
    const user = JSON.parse(stored);
    logInfo('User session loaded', { username: user.username });
    return user;
  } catch (error) {
    logError('loadCurrentUserSession', error);
    return null;
  }
};

export const clearCurrentUserSession = (): boolean => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    logInfo('User session cleared');
    return true;
  } catch (error) {
    logError('clearCurrentUserSession', error);
    return false;
  }
};

// CSV Export/Import Functions
export const exportUsersToCSV = (): void => {
  try {
    const users = loadUsers();
    const csv = Papa.unparse(users);
    downloadCSV(csv, 'agentic-users.csv');
    logInfo('Users exported to CSV');
  } catch (error) {
    logError('exportUsersToCSV', error);
  }
};

export const exportUserTransactionsToCSV = (userId: string, username: string): void => {
  try {
    const transactions = loadUserTransactions(userId);
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }
    
    const csv = Papa.unparse(transactions);
    downloadCSV(csv, `agentic-transactions-${username}-${new Date().toISOString().split('T')[0]}.csv`);
    logInfo('User transactions exported to CSV', { userId, count: transactions.length });
  } catch (error) {
    logError('exportUserTransactionsToCSV', error);
  }
};

export const importTransactionsFromCSV = (file: File, userId: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const existingTransactions = loadUserTransactions(userId);
          
          const importedTransactions = results.data
            .filter((row: any) => row.date && row.amount && row.type)
            .map((row: any) => ({
              id: `txn-import-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: row.date,
              type: row.type,
              category: row.category || 'other',
              amount: parseFloat(row.amount) || 0,
              description: row.description || '',
              project: row.project || '',
            }));
          
          if (importedTransactions.length === 0) {
            reject(new Error('No valid transactions found in CSV'));
            return;
          }
          
          const allTransactions = [...existingTransactions, ...importedTransactions];
          
          if (saveUserTransactions(userId, allTransactions)) {
            logInfo('Transactions imported from CSV', { userId, imported: importedTransactions.length });
            resolve(importedTransactions);
          } else {
            reject(new Error('Failed to save imported transactions'));
          }
        } catch (error) {
          logError('importTransactionsFromCSV', error);
          reject(error);
        }
      },
      error: (error) => {
        logError('CSV parsing', error);
        reject(error);
      }
    });
  });
};

// Utility function for CSV download
const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Data integrity functions
export const validateAllUserData = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    // Validate users
    const users = loadUsers();
    if (!Array.isArray(users)) {
      errors.push('Users data is not an array');
    }
    
    // Validate each user's transactions
    users.forEach(user => {
      try {
        const transactions = loadUserTransactions(user.id);
        if (!Array.isArray(transactions)) {
          errors.push(`Transactions for user ${user.username} is not an array`);
        }
      } catch (error) {
        errors.push(`Failed to load transactions for user ${user.username}`);
      }
    });
    
    logInfo('Data validation completed', { errors: errors.length });
    return { isValid: errors.length === 0, errors };
  } catch (error) {
    logError('validateAllUserData', error);
    return { isValid: false, errors: ['Failed to validate data'] };
  }
};

// Initialize data on module load
try {
  initializeUsers();
} catch (error) {
  logError('Module initialization', error);
}