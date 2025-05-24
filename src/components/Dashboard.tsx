
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

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            ${value.toLocaleString()}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-red-600' ? 'bg-red-100' : 'bg-purple-100'}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
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
          color={profitMargin >= 20 ? "text-green-600" : profitMargin >= 10 ? "text-orange-500" : "text-red-600"}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No transactions yet. Add your first transaction to get started!</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{transaction.description}</p>
                  <p className="text-sm text-slate-600">{transaction.category} • {transaction.date}</p>
                </div>
                <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cash Flow Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cash Flow Overview</h3>
        <div className="h-64 bg-gradient-to-r from-red-50 via-purple-50 to-slate-50 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">Chart visualization coming soon...</p>
        </div>
      </div>
    </div>
  );
};
