// src/components/Charts.tsx - Professional Design
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
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  PieChart as PieIcon, 
  BarChart3,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  Eye
} from 'lucide-react';

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

  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6366F1'
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-2xl shadow-2xl">
          <p className="font-bold text-gray-900 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {`${entry.name}: $${entry.value.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate summary stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome * 100) : 0;

  const StatCard = ({ title, value, icon: Icon, color, bgGradient, description, trend }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${bgGradient}`} />
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgGradient} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color} mb-1`}>
          {typeof value === 'string' ? value : `$${value.toLocaleString()}`}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
                <p className="text-gray-600 mt-1">Comprehensive insights into your financial performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {transactions.length} transactions analyzed
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-bold">Live Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={totalIncome}
          icon={TrendingUp}
          color="text-green-600"
          bgGradient="bg-gradient-to-r from-green-500 to-emerald-600"
          description="Gross income generated"
          trend={15.2}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={TrendingDown}
          color="text-red-600"
          bgGradient="bg-gradient-to-r from-red-500 to-rose-600"
          description="Operating costs tracked"
          trend={-8.1}
        />
        <StatCard
          title="Net Profit"
          value={netProfit}
          icon={DollarSign}
          color={netProfit >= 0 ? "text-green-600" : "text-red-600"}
          bgGradient={netProfit >= 0 ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"}
          description="Bottom line performance"
          trend={23.7}
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Target}
          color={profitMargin >= 20 ? "text-green-600" : profitMargin >= 10 ? "text-amber-600" : "text-red-600"}
          bgGradient={profitMargin >= 20 ? "bg-gradient-to-r from-green-500 to-emerald-600" : profitMargin >= 10 ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-red-500 to-rose-600"}
          description="Efficiency indicator"
          trend={5.3}
        />
      </div>

      {/* Main Chart - Monthly Revenue vs Expenses */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Monthly Performance</h3>
                <p className="text-sm text-gray-600">Revenue vs Expenses with profit trend</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Premium Analytics</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {monthlyData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={600}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={600}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="income" 
                    fill="url(#incomeGradient)" 
                    name="Income"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="url(#expenseGradient)" 
                    name="Expenses"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    name="Net Profit"
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2, fill: '#6366F1' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No data available for chart visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <PieIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Expense Distribution</h3>
                <p className="text-sm text-gray-600">Category-wise spending analysis</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {categoryData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No expense data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cumulative Cash Flow */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cash Flow Trend</h3>
                <p className="text-sm text-gray-600">Cumulative financial trajectory</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {dailyTrend.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrend}>
                    <defs>
                      <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight={600}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight={600}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fill="url(#cashFlowGradient)"
                      name="Cumulative Balance"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#10B981' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No trend data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profit Margin Trend */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profit Margin Evolution</h3>
                <p className="text-sm text-gray-600">Business efficiency over time</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">Advanced Metrics</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {monthlyData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <defs>
                    <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={600}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight={600}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Profit Margin']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profitMargin" 
                    stroke="#6366F1" 
                    strokeWidth={4}
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2, fill: '#6366F1' }}
                    name="Profit Margin %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No margin data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};