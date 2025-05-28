// src/utils/csvUtils.ts
import Papa from 'papaparse';
import { User } from '../types/auth';
import { Transaction } from '../types/transaction';

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'Saad',
    password: 'elegnoiaceo',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'Areeba',
    password: 'elegnoiaai',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// User CSV Management
export const loadUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('agentic-users-csv');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default users
      saveUsers(defaultUsers);
      return defaultUsers;
    }
  } catch (error) {
    console.error('Error loading users:', error);
    return defaultUsers;
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem('agentic-users-csv', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const exportUsersToCSV = (): void => {
  const users = loadUsers();
  const csv = Papa.unparse(users);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agentic-users.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const importUsersFromCSV = (file: File): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedUsers = results.data
            .filter((row: any) => row.username && row.password)
            .map((row: any) => ({
              id: row.id || Date.now().toString() + Math.random().toString(),
              username: row.username,
              password: row.password,
              role: row.role || 'user',
              createdAt: row.createdAt || new Date().toISOString(),
            }));
          
          const existingUsers = loadUsers();
          const allUsers = [...existingUsers, ...importedUsers];
          saveUsers(allUsers);
          resolve(allUsers);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Transaction CSV Management (per user)
export const loadUserTransactions = (userId: string): Transaction[] => {
  try {
    const stored = localStorage.getItem(`agentic-transactions-${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading user transactions:', error);
    return [];
  }
};

export const saveUserTransactions = (userId: string, transactions: Transaction[]): void => {
  try {
    localStorage.setItem(`agentic-transactions-${userId}`, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving user transactions:', error);
  }
};

export const exportUserTransactionsToCSV = (userId: string, username: string): void => {
  const transactions = loadUserTransactions(userId);
  const csv = Papa.unparse(transactions);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agentic-transactions-${username}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};