// src/components/TransactionForm.tsx - Professional Design
import { useState } from 'react';
import { Transaction } from '../types/transaction';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types/transaction';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Building,
  TrendingUp,
  TrendingDown,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    project: '',
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onAddTransaction({
      date: formData.date,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      project: formData.project.trim(),
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category: '',
      amount: '',
      description: '',
      project: '',
    });
    
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData({
      ...formData,
      type,
      category: '', // Reset category when type changes
    });
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-green-900 font-semibold">Transaction Added Successfully!</p>
              <p className="text-green-700 text-sm">Your financial data has been updated and saved securely.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Transaction</h2>
              <p className="text-gray-600 mt-1">Record your financial activity with professional accuracy</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Transaction Type Selector */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">Transaction Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-bold ${
                      formData.type === 'income' ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      Income
                    </h3>
                    <p className={`text-sm ${
                      formData.type === 'income' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Money received
                    </p>
                  </div>
                </div>
                {formData.type === 'income' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-bold ${
                      formData.type === 'expense' ? 'text-red-900' : 'text-gray-700'
                    }`}>
                      Expense
                    </h3>
                    <p className={`text-sm ${
                      formData.type === 'expense' ? 'text-red-700' : 'text-gray-500'
                    }`}>
                      Money spent
                    </p>
                  </div>
                </div>
                {formData.type === 'expense' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Transaction Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Tag className="inline w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="mt-2 flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.category}</span>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`w-full pl-8 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-lg font-semibold ${
                      errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                    required
                  />
                </div>
                {errors.amount && (
                  <div className="mt-2 flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.amount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <FileText className="inline w-4 h-4 mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter detailed description of the transaction..."
                  required
                />
                {errors.description && (
                  <div className="mt-2 flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.description}</span>
                  </div>
                )}
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Building className="inline w-4 h-4 mr-2" />
                  Project (Optional)
                </label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  placeholder="Associated project or client name"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Link this transaction to a specific project for better tracking
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Add Transaction</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Transaction will be automatically saved to your secure storage
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};