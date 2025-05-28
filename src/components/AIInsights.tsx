// src/components/AIInsights.tsx - Professional Design
import { useState } from 'react';
import { Transaction } from '../types/transaction';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  DollarSign,
  PieChart,
  BarChart3,
  Award,
  Rocket,
  Shield,
  Clock
} from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights = ({ transactions }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate comprehensive metrics for AI analysis
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
      
      // Group expenses by category
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      // Calculate monthly trends
      const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
        acc[month][t.type === 'income' ? 'income' : 'expenses'] += t.amount;
        return acc;
      }, {} as Record<string, { income: number; expenses: number }>);

      const prompt = `
        As an expert financial advisor specializing in business analytics, provide a comprehensive analysis of this financial data for AgenticAccounting:

        📊 FINANCIAL OVERVIEW:
        • Total Income: $${totalIncome.toLocaleString()}
        • Total Expenses: $${totalExpenses.toLocaleString()}
        • Net Profit: $${netProfit.toLocaleString()}
        • Profit Margin: ${profitMargin.toFixed(1)}%
        • Transaction Count: ${transactions.length}

        💰 EXPENSE BREAKDOWN:
        ${Object.entries(expensesByCategory).map(([cat, amount]) => `• ${cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}: $${amount.toLocaleString()}`).join('\n')}

        📈 MONTHLY PERFORMANCE:
        ${Object.entries(monthlyData).slice(-3).map(([month, data]) => 
          `• ${month}: Income $${data.income.toLocaleString()}, Expenses $${data.expenses.toLocaleString()}, Net: $${(data.income - data.expenses).toLocaleString()}`
        ).join('\n')}

        Please provide a professional analysis in the following format:

        🎯 EXECUTIVE SUMMARY
        [2-3 sentence overview of financial health]

        📊 KEY PERFORMANCE INSIGHTS
        • [3-4 specific data-driven insights]

        ⚠️ AREAS OF CONCERN
        • [2-3 potential issues or risks identified]

        🚀 STRATEGIC RECOMMENDATIONS
        • [4-5 actionable recommendations for improvement]

        💡 OPTIMIZATION OPPORTUNITIES
        • [3-4 specific opportunities to boost profitability]

        🎲 FORECASTING & TRENDS
        • [2-3 predictions based on current data patterns]

        Keep the response professional, actionable, and focused on practical business insights that can drive real financial improvements.
      `;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        setInsights(data.candidates[0].content.parts[0].text);
      } else {
        setError('Unable to generate insights. Please check API configuration.');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickInsights = [
    {
      icon: TrendingUp,
      title: 'Revenue Optimization',
      description: 'Focus on high-margin services and recurring revenue streams for sustainable growth',
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: AlertTriangle,
      title: 'Cost Management',
      description: 'Review subscription services and optimize operational efficiency to reduce overhead',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      icon: Target,
      title: 'Profit Target',
      description: 'Aim for 20%+ profit margin through strategic pricing and cost optimization',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Lightbulb,
      title: 'Growth Strategy',
      description: 'Invest in automation and scalable solutions to accelerate business growth',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  // Calculate key metrics for display
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-b border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  AI-Powered Financial Intelligence
                  <Award className="w-6 h-6 text-amber-500" />
                </h2>
                <p className="text-gray-600 mt-1">Advanced analytics and personalized recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Secure Analysis</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Generator */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Generate Custom Analysis</h3>
              <p className="text-gray-600">Get personalized insights based on your financial data</p>
            </div>
          </div>
          
          {/* Data Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Total Revenue</p>
                  <p className="text-xl font-bold text-green-900">${totalIncome.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Total Expenses</p>
                  <p className="text-xl font-bold text-red-900">${totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <PieChart className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Net Profit</p>
                  <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                    ${netProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={generateInsights}
            disabled={loading || transactions.length === 0}
            className="group w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Analyzing Financial Data...</span>
                <Clock className="w-6 h-6 animate-pulse" />
              </>
            ) : (
              <>
                <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Generate AI Insights</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {transactions.length === 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-amber-800 font-medium">
                  Add some transactions first to get meaningful AI insights and recommendations.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated AI Insights */}
      {insights && (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI Analysis Results</h3>
                  <p className="text-sm text-gray-600">Professional financial insights and recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <Star className="w-4 h-4" />
                <span className="text-sm font-bold">Premium Analysis</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="prose prose-gray max-w-none">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
                  {insights}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Professional Insights */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Quick Professional Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className={`${insight.bgColor} rounded-2xl p-6 border ${insight.borderColor} hover:shadow-lg transition-all duration-200`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r ${insight.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${insight.textColor} mb-2`}>{insight.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Features */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional AI Features</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience enterprise-grade financial intelligence with advanced machine learning algorithms 
            that analyze your data to provide actionable business insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <Brain className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Smart Analysis</h4>
              <p className="text-sm text-gray-600">Advanced pattern recognition and trend analysis</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <Target className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Personalized Insights</h4>
              <p className="text-sm text-gray-600">Tailored recommendations for your business</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <Rocket className="w-10 h-10 text-pink-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Growth Optimization</h4>
              <p className="text-sm text-gray-600">Strategic guidance for business expansion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};