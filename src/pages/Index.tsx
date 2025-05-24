
import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { AIInsights } from '../components/AIInsights';
import { Navigation } from '../components/Navigation';
import { useTransactions } from '../hooks/useTransactions';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { transactions, addTransaction, loadTransactions } = useTransactions();

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-600 to-slate-700 bg-clip-text text-transparent">
              AgenticAccounting
            </h1>
          </div>
          <p className="text-slate-600">Intelligent cash flow management for Elegnoia</p>
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
          {activeTab === 'add-transaction' && (
            <TransactionForm onAddTransaction={addTransaction} />
          )}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} />}
          {activeTab === 'insights' && <AIInsights transactions={transactions} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
