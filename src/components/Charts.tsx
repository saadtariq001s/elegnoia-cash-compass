// src/components/Charts.tsx
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { Transaction } from '../types/transaction';
import { TrendingUp, DollarSign, PieChart as PieIcon, BarChart3 } from 'lucide-react';

interface ChartsProps {
  transactions: Transaction[];
}

export const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  // Process data for different charts
  const processMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number; month: string } } = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, month: monthName };
      }
      
      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expenses += t.amount;
      }
    });
    
    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(item => ({
        ...item,
        profit: item.income - item.expenses,
        profitMargin: item.income > 0 ? ((item.income - item.expenses) / item.income * 100).toFixed(1) : 0
      }));
  };

  const processCategoryData = () => {
    const categoryData: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryData).map(([name, value]) => ({
      name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      percentage: ((value / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }));
  };

  const processDailyTrend = () => {
    const dailyData: { [key: string]: { date: string; amount: number; cumulative: number } } = {};
    let cumulative = 0;
    
    transactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(t => {
        const dateKey = t.date;
        const amount = t.type === 'income' ? t.amount : -t.amount;
        cumulative += amount;
        
        dailyData[dateKey] = {
          date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount,
          cumulative
        };
      });
    
    return Object.values(dailyData);
  };

  const monthlyData = processMonthlyData();
  const categoryData = processCategoryData();
  const dailyTrend = processDailyTrend();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff6b6b', '#4ecdc4', '#45b7d1'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: $${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Financial Analytics Dashboard</h2>
        <p className="text-slate-600">Comprehensive insights into your financial performance</p>
      </div>

      {/* Monthly Revenue vs Expenses */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-800">Monthly Revenue vs Expenses</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#6366f1" 
                strokeWidth={3}
                name="Net Profit"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <PieIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800">Expense Breakdown</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Cash Flow Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-800">Cumulative Cash Flow</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  name="Cumulative Balance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profit Margin Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Profit Margin Trend</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Profit Margin']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="profitMargin" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1' }}
                name="Profit Margin %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Revenue',
            value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Total Expenses',
            value: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          },
          {
            title: 'Net Profit',
            value: transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0),
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Avg Transaction',
            value: transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ].map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-4`}>
            <h4 className="text-sm font-medium text-gray-700">{item.title}</h4>
            <p className={`text-2xl font-bold ${item.color}`}>
              ${item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};