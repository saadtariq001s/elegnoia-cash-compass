
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
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Branding */}
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/0c6c2d90-c3a9-4be6-8af3-b4d946284cc1.png" 
                alt="Elegnoia" 
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  AgenticAccounting
                </h1>
                <p className="text-sm text-gray-600">Financial Management Suite</p>
              </div>
            </div>
            
            {/* Quick Stats */}
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
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
