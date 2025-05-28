// src/pages/Index.tsx - Updated with Auth and Charts
import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { AIInsights } from '../components/AIInsights';
import { Charts } from '../components/Charts';
import { Navigation } from '../components/Navigation';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, BarChart3 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { transactions, addTransaction, loadTransactions } = useTransactions();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Branding */}
            <div className="flex items-center gap-4">
              <img 
                src="src/media/Linkedin Logo.png"
                alt="Elegnoia" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%236366f1'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EE%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  AgenticAccounting
                </h1>
                <p className="text-sm text-gray-600">Financial Management Suite</p>
              </div>
            </div>
            
            {/* User Info and Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-semibold text-gray-900">{transactions.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Net Balance</p>
                <p className="text-xl font-semibold text-green-600">
                  ${(transactions
                    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
                    .toLocaleString())}
                </p>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-3 pl-6 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Navigation with Charts */}
        <nav className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'add-transaction', label: 'Add Transaction', icon: () => <span className="text-lg">+</span> },
              { id: 'transactions', label: 'All Transactions', icon: () => <span className="text-lg">📋</span> },
              { id: 'charts', label: 'Analytics', icon: () => <span className="text-lg">📊</span> },
              { id: 'insights', label: 'AI Insights', icon: () => <span className="text-lg">🧠</span> },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="mt-8">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
          {activeTab === 'add-transaction' && (
            <TransactionForm onAddTransaction={addTransaction} />
          )}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} />}
          {activeTab === 'charts' && <Charts transactions={transactions} />}
          {activeTab === 'insights' && <AIInsights transactions={transactions} />}
        </div>
      </div>
    </div>
  );
};

export default Index;