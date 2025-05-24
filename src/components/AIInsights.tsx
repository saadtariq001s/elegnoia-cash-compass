
import { useState } from 'react';
import { Transaction } from '../types/transaction';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights = ({ transactions }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    
    try {
      // Calculate basic metrics for AI analysis
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      
      // Group expenses by category
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const prompt = `
        As a financial advisor for Elegnoia, a startup, analyze the following financial data and provide actionable insights for profit optimization:

        Total Income: $${totalIncome}
        Total Expenses: $${totalExpenses}
        Net Profit: $${netProfit}
        Profit Margin: ${totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}%

        Expenses by Category:
        ${Object.entries(expensesByCategory).map(([cat, amount]) => `${cat}: $${amount}`).join('\n')}

        Number of Transactions: ${transactions.length}

        Please provide:
        1. Current financial health assessment
        2. Top 3 profit optimization recommendations
        3. Cost reduction opportunities
        4. Revenue growth suggestions
        5. Key metrics to monitor

        Keep the response concise and actionable for a startup environment.
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
        setInsights('Unable to generate insights. Please check your API configuration.');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Error generating insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const quickInsights = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Focus on high-margin projects and recurring revenue streams',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: AlertTriangle,
      title: 'Cost Control',
      description: 'Review subscription services and optimize team productivity',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Target,
      title: 'Profit Margin',
      description: 'Aim for 20%+ profit margin for sustainable growth',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Lightbulb,
      title: 'Optimization',
      description: 'Automate processes and invest in scalable solutions',
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Generator */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">AI-Powered Financial Insights</h2>
        </div>
        
        <p className="text-slate-600 mb-4">
          Get personalized recommendations based on your financial data to optimize profit and growth.
        </p>

        <button
          onClick={generateInsights}
          disabled={loading || transactions.length === 0}
          className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Generate AI Insights'}
        </button>

        {transactions.length === 0 && (
          <p className="text-orange-600 text-sm mt-2">
            Add some transactions first to get meaningful insights.
          </p>
        )}
      </div>

      {/* Generated Insights */}
      {insights && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Analysis Results</h3>
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
              {insights}
            </pre>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${insight.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{insight.title}</h4>
                  <p className="text-sm text-slate-600">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
