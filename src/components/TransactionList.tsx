// src/components/TransactionList.tsx - Professional Design
import { Transaction } from '../types/transaction';
import { 
  Download, 
  Upload, 
  Filter, 
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  FileText,
  Building,
  Tag,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const filteredAndSortedTransactions = transactions
    .filter(t => {
      const matchesFilter = filter === 'all' || t.type === filter;
      const matchesSearch = searchTerm === '' || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.project && t.project.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const totalIncome = filteredAndSortedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredAndSortedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <div className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            transaction.type === 'income' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          } shadow-lg`}>
            {transaction.type === 'income' ? (
              <TrendingUp className="w-6 h-6 text-white" />
            ) : (
              <TrendingDown className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-800">
              {transaction.description}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              {transaction.project && (
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  <Building className="inline w-3 h-3 mr-1" />
                  {transaction.project}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-xl transition-all">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(transaction.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>ID: {transaction.id.slice(-8)}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 font-bold text-xl ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? (
            <ArrowUpRight className="w-5 h-5" />
          ) : (
            <ArrowDownRight className="w-5 h-5" />
          )}
          <span>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                <p className="text-gray-600 mt-1">Manage and analyze your financial records</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredAndSortedTransactions.length}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Income</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expenses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, categories, or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  viewMode === 'table' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table
              </button>
            </div>

            {/* Export/Import */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-colors font-medium shadow-lg">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Display */}
      {filteredAndSortedTransactions.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Add your first transaction to get started tracking your finances'
              }
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                Show All Transactions
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-6 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        Date
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <FileText className="inline w-4 h-4 mr-2" />
                        Description
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <Tag className="inline w-4 h-4 mr-2" />
                        Category
                      </th>
                      <th className="text-left p-6 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <Building className="inline w-4 h-4 mr-2" />
                        Project
                      </th>
                      <th className="text-right p-6 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <DollarSign className="inline w-4 h-4 mr-2" />
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                        }`}
                      >
                        <td className="p-6 text-sm text-gray-600 font-medium">
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-6">
                          <div className="font-semibold text-gray-900">{transaction.description}</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {transaction.id.slice(-8)}</div>
                        </td>
                        <td className="p-6">
                          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </td>
                        <td className="p-6 text-sm text-gray-600 font-medium">
                          {transaction.project ? (
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {transaction.project}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className={`p-6 text-right font-bold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className="flex items-center justify-end gap-1">
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};