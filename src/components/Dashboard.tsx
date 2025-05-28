// src/components/Dashboard.tsx - Professional Design Implementation
import { Transaction } from '../types/transaction';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  RefreshCw, 
  Database, 
  AlertCircle,
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  transactions: Transaction[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const Dashboard = ({ transactions, isLoading, error, onRefresh }: DashboardProps) => {
  const { user } = useAuth();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // Calculate trends (simplified for demo)
  const trend = Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 1 : -(Math.floor(Math.random() * 10) + 1);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color, 
    bgGradient,
    prefix = '$', 
    suffix = '',
    description
  }: any) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 opacity-5 ${bgGradient}`} />
      
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${bgGradient}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-xs text-gray-400 mb-3">{description}</p>
            
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${color}`}>
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value.toFixed(1)}{suffix}
              </p>
              
              {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  trend > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {trend > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
          </div>
          
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        
        {/* Mini chart area (placeholder) */}
        <div className="h-8 bg-gray-50 rounded-lg flex items-end justify-between px-2 py-1">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 ${bgGradient} rounded-full opacity-40`}
              style={{ height: `${Math.random() * 24 + 8}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Data Status Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Financial Command Center
                <Shield className="w-5 h-5 text-blue-600" />
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isLoading ? 'Synchronizing data...' : 
                 error ? 'Connection issue detected' : 
                 `${transactions.length} transactions • User: ${user?.username}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Sync Error</span>
              </div>
            )}
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${
                isLoading ? 'bg-amber-400 animate-pulse' :
                error ? 'bg-red-500' : 
                'bg-green-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? 'Syncing' : error ? 'Error' : 'Live'}
              </span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          description="Gross income this period"
          value={totalIncome}
          icon={TrendingUp}
          color="text-green-600"
          bgGradient="bg-gradient-to-r from-green-500 to-emerald-600"
          trend={trend > 0 ? trend : null}
        />
        <StatCard
          title="Total Expenses"
          description="Operating costs tracked"
          value={totalExpenses}
          icon={TrendingDown}
          color="text-red-600"
          bgGradient="bg-gradient-to-r from-red-500 to-rose-600"
          trend={trend < 0 ? Math.abs(trend) : null}
        />
        <StatCard
          title="Net Profit"
          description="Bottom line performance"
          value={netProfit}
          icon={DollarSign}
          color={netProfit >= 0 ? "text-green-600" : "text-red-600"}
          bgGradient={netProfit >= 0 ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"}
          trend={trend}
        />
        <StatCard
          title="Profit Margin"
          description="Efficiency indicator"
          value={profitMargin}
          icon={Target}
          color={profitMargin >= 20 ? "text-green-600" : profitMargin >= 10 ? "text-amber-600" : "text-red-600"}
          bgGradient={profitMargin >= 20 ? "bg-gradient-to-r from-green-500 to-emerald-600" : profitMargin >= 10 ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-red-500 to-rose-600"}
          prefix=""
          suffix="%"
          trend={Math.abs(trend)}
        />
      </div>

      {/* Enhanced Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Latest financial transactions
                </p>
              </div>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="rounded-full bg-gray-200 h-3 w-3"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
              <p className="text-sm text-gray-500 mb-6">Add your first transaction to see your financial activity</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Ready to start tracking</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <p className="font-semibold text-gray-900 group-hover:text-gray-800">
                        {transaction.description}
                      </p>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-medium">{transaction.category}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                      {transaction.project && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">{transaction.project}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className={`font-bold text-lg flex items-center gap-1 ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Cash Flow Visualization Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Cash Flow Visualization</h3>
              <p className="text-sm text-gray-600">Advanced analytics and trend analysis</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-gray-100 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 transform rotate-12"></div>
            </div>
            
            <div className="text-center relative z-10">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Professional Chart Suite</h4>
              <p className="text-sm text-gray-500 mb-4">Detailed visualizations available in Analytics tab</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl border border-gray-200">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Analytics Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};