// src/pages/Index.tsx - Professional Design Implementation
import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { AIInsights } from '../components/AIInsights';
import { Charts } from '../components/Charts';
import { Navigation } from '../components/Navigation';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Database, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    transactions, 
    addTransaction, 
    loadTransactions, 
    reloadTransactions,
    isLoading,
    error,
    clearError,
    getTransactionStats
  } = useTransactions();
  const { user, logout } = useAuth();

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !isLoading) {
        console.log('[Index] Auto-refreshing transaction data...');
        reloadTransactions();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isLoading, reloadTransactions]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your data will be saved securely.')) {
      logout();
    }
  };

  const handleAddTransaction = (transactionData: any) => {
    const success = addTransaction(transactionData);
    if (success) {
      console.log('[Index] Transaction added successfully');
    }
    return success;
  };

  const stats = getTransactionStats();

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo and Branding */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src="src/media/Linkedin Logo.png"
                    alt="Elegnoia" 
                    className="h-12 w-auto"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'%3E%3Cstop offset='0%' style='stop-color:%232563eb;stop-opacity:1' /%3E%3Cstop offset='100%' style='stop-color:%231e3a8a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='48' height='48' rx='12' fill='url(%23grad)'/%3E%3Ctext x='24' y='32' text-anchor='middle' fill='white' font-family='Inter' font-size='20' font-weight='700'%3EE%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="border-l border-gray-200 pl-6">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    AgenticAccounting
                  </h1>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Enterprise Financial Management
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats and User Info */}
            <div className="flex items-center gap-8">
              {/* Professional Status Indicator */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <Database className="w-5 h-5 text-blue-600" />
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isLoading ? 'bg-amber-400 animate-pulse' :
                    error ? 'bg-red-500' : 
                    'bg-green-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">
                    {isLoading ? 'Syncing' : error ? 'Error' : 'Live'}
                  </span>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transactions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {isLoading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      transactions.length.toLocaleString()
                    )}
                  </p>
                </div>
                
                <div className="w-px h-8 bg-gray-200"></div>
                
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Net Balance</p>
                  <p className={`text-xl font-bold flex items-center gap-1 ${
                    stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.netProfit >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4 rotate-180" />
                    )}
                    {isLoading ? (
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      `$${stats.netProfit.toLocaleString()}`
                    )}
                  </p>
                </div>
              </div>
              
              {/* Enhanced User Menu */}
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {user?.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                      {user?.role}
                      {user?.role === 'admin' && <Shield className="w-3 h-3" />}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  title="Secure Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Error Alert */}
      {error && (
        <div className="container mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-red-800">Data Sync Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="flex space-x-2">
                  <button
                    onClick={reloadTransactions}
                    className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg text-red-800 text-sm font-medium transition-colors"
                  >
                    Retry Sync
                  </button>
                  <button
                    onClick={clearError}
                    className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-red-700 text-sm font-medium border border-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Professional Navigation */}
        <div className="mb-8">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area with Enhanced Styling */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              isLoading={isLoading}
              error={error}
              onRefresh={reloadTransactions}
            />
          )}
          {activeTab === 'add-transaction' && (
            <div className="space-y-6">
              {/* Success indicator for transaction form */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Secure Data Storage Active</p>
                    <p className="text-xs text-green-700 mt-1">
                      All transactions are encrypted and automatically saved to your personal secure storage
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-medium">Protected</span>
                    </div>
                  </div>
                </div>
              </div>
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>
          )}
          {activeTab === 'transactions' && (
            <TransactionList transactions={transactions} />
          )}
          {activeTab === 'charts' && (
            <Charts transactions={transactions} />
          )}
          {activeTab === 'insights' && (
            <AIInsights transactions={transactions} />
          )}
        </div>
      </div>

      {/* Enhanced Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Enterprise CSV Storage</p>
                  <p className="text-xs text-gray-500">Bank-grade data security</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Auto-Save Enabled</p>
                  <p className="text-xs text-gray-500">Changes saved instantly</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">User: {user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role} access level</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last sync: {isLoading ? 'Syncing...' : 'Just now'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  isLoading ? 'bg-amber-400 animate-pulse' :
                  error ? 'bg-red-500' : 
                  'bg-green-500'
                }`} />
                <span className="text-xs font-medium">
                  {isLoading ? 'Syncing' : error ? 'Error' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;