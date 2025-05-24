
import { Transaction } from '../types/transaction';
import { Download, Upload, Filter } from 'lucide-react';
import { useState } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg hover:from-red-600 hover:to-purple-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No transactions found. {filter !== 'all' && 'Try changing the filter or '}Add your first transaction to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">Date</th>
                  <th className="text-left p-4 font-medium text-slate-700">Description</th>
                  <th className="text-left p-4 font-medium text-slate-700">Category</th>
                  <th className="text-left p-4 font-medium text-slate-700">Project</th>
                  <th className="text-right p-4 font-medium text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{transaction.description}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {transaction.project || '-'}
                    </td>
                    <td className={`p-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
