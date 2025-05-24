
import { Transaction } from '../types/transaction';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
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
    .slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, trend, color, prefix = '$' }: any) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value.toFixed(1)}
            {prefix === '' && '%'}
          </p>
          <div className="flex items-center text-xs">
            {trend && (
              <span className={`${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          color === 'text-green-600' ? 'bg-green-50' : 
          color === 'text-red-600' ? 'bg-red-50' : 
          'bg-blue-50'
        }`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={totalIncome}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={TrendingDown}
          color="text-red-600"
        />
        <StatCard
          title="Net Profit"
          value={netProfit}
          icon={DollarSign}
          color={netProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Profit Margin"
          value={profitMargin}
          icon={Target}
          color={profitMargin >= 20 ? "text-green-600" : profitMargin >= 10 ? "text-amber-600" : "text-red-600"}
          prefix=""
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <p className="text-sm text-gray-600 mt-1">Latest financial activity</p>
        </div>
        
        <div className="p-6">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No transactions yet</p>
              <p className="text-sm text-gray-400">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      {transaction.project && ` • ${transaction.project}`}
                    </p>
                  </div>
                  <div className={`font-semibold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
          <p className="text-sm text-gray-600 mt-1">Visual representation of your financial trends</p>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Chart Visualization</p>
              <p className="text-sm text-gray-400">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
