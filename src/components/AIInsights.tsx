// src/components/AIInsights.tsx - Visual AI Analysis Parser
import { useState } from 'react';
import { Transaction } from '../types/transaction';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  BarChart3,
  Activity,
  ArrowRight,
  CheckCircle,
  DollarSign,
  PieChart,
  Award,
  Lightbulb,
  Settings,
  RefreshCw,
  ChevronRight,
  Info,
  Zap,
  Users,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  Eye,
  TrendingDown
} from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
}

interface ParsedInsights {
  executiveSummary: string;
  keyMetrics: string[];
  risks: string[];
  recommendations: string[];
  opportunities: string[];
  outlook: string[];
}

export const AIInsights = ({ transactions }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>('');
  const [parsedInsights, setParsedInsights] = useState<ParsedInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse AI response into structured data
  const parseAIResponse = (response: string): ParsedInsights => {
    const sections = {
      executiveSummary: '',
      keyMetrics: [] as string[],
      risks: [] as string[],
      recommendations: [] as string[],
      opportunities: [] as string[],
      outlook: [] as string[]
    };

    const lines = response.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('EXECUTIVE SUMMARY')) {
        currentSection = 'executiveSummary';
        continue;
      } else if (trimmedLine.includes('KEY PERFORMANCE') || trimmedLine.includes('METRICS')) {
        currentSection = 'keyMetrics';
        continue;
      } else if (trimmedLine.includes('RISK ASSESSMENT')) {
        currentSection = 'risks';
        continue;
      } else if (trimmedLine.includes('STRATEGIC RECOMMENDATIONS')) {
        currentSection = 'recommendations';
        continue;
      } else if (trimmedLine.includes('OPTIMIZATION OPPORTUNITIES')) {
        currentSection = 'opportunities';
        continue;
      } else if (trimmedLine.includes('FINANCIAL OUTLOOK')) {
        currentSection = 'outlook';
        continue;
      }

      if (trimmedLine && !trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
        if (currentSection === 'executiveSummary') {
          sections.executiveSummary += trimmedLine + ' ';
        } else if (currentSection && trimmedLine.startsWith('•')) {
          const cleanLine = trimmedLine.replace('•', '').trim();
          if (cleanLine) {
            (sections as any)[currentSection].push(cleanLine);
          }
        }
      }
    }

    return sections;
  };

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
      
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
        acc[month][t.type === 'income' ? 'income' : 'expenses'] += t.amount;
        return acc;
      }, {} as Record<string, { income: number; expenses: number }>);

      const prompt = `
        As a senior financial analyst, provide a concise professional analysis of this business financial data:

        Financial Overview:
        • Total Income: $${totalIncome.toLocaleString()}
        • Total Expenses: $${totalExpenses.toLocaleString()}
        • Net Profit: $${netProfit.toLocaleString()}
        • Profit Margin: ${profitMargin.toFixed(1)}%
        • Transaction Count: ${transactions.length}

        Please provide analysis in EXACTLY this format:

        **EXECUTIVE SUMMARY**
        [2 sentences maximum about overall financial health]

        **KEY PERFORMANCE METRICS**
        • [Metric 1 - keep to 1 sentence]
        • [Metric 2 - keep to 1 sentence]
        • [Metric 3 - keep to 1 sentence]

        **RISK ASSESSMENT**
        • [Risk 1 - keep to 1 sentence]
        • [Risk 2 - keep to 1 sentence]

        **STRATEGIC RECOMMENDATIONS**
        • [Action 1 - specific and actionable]
        • [Action 2 - specific and actionable]
        • [Action 3 - specific and actionable]
        • [Action 4 - specific and actionable]

        **OPTIMIZATION OPPORTUNITIES**
        • [Opportunity 1 - specific]
        • [Opportunity 2 - specific]
        • [Opportunity 3 - specific]

        **FINANCIAL OUTLOOK**
        • [Prediction 1 - specific]
        • [Prediction 2 - specific]

        Keep each bullet point to maximum 15 words. Be specific and actionable.
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
        const rawInsights = data.candidates[0].content.parts[0].text;
        setInsights(rawInsights);
        
        // Parse the response
        const parsed = parseAIResponse(rawInsights);
        setParsedInsights(parsed);
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

  const professionalInsights = [
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
      icon: BarChart3,
      title: 'Growth Strategy',
      description: 'Invest in automation and scalable solutions to accelerate business growth',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Header matching project theme */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-b border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  AI-Powered Financial Intelligence
                  <Award className="w-6 h-6 text-amber-500" />
                </h2>
                <p className="text-gray-600 mt-1">Advanced analytics and actionable insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
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
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Generate Executive Analysis</h3>
              <p className="text-gray-600">Get concise, actionable insights for stakeholder review</p>
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
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Analyzing Financial Data...</span>
              </>
            ) : (
              <>
                <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Generate Executive Analysis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {transactions.length === 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-amber-800 font-medium">
                  Add transaction data to generate meaningful insights.
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

      {/* Parsed AI Analysis Results */}
      {parsedInsights && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Executive Summary</h3>
                  <p className="text-sm text-gray-600">Key financial health overview</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-800 leading-relaxed text-lg">{parsedInsights.executiveSummary}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Key Performance Metrics</h3>
                  <p className="text-sm text-gray-600">Critical performance indicators</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parsedInsights.keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Percent className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-green-800 font-medium leading-relaxed">{metric}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Risk Assessment</h3>
                  <p className="text-sm text-gray-600">Areas requiring attention</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {parsedInsights.risks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-red-800 font-medium">{risk}</p>
                    </div>
                    <div className="px-2 py-1 bg-red-600 text-white rounded-md text-xs font-bold">
                      HIGH
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Strategic Action Plan</h3>
                  <p className="text-sm text-gray-600">Immediate actions for stakeholders</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedInsights.recommendations.map((rec, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-800 font-medium mb-2">{rec}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">Action Required</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Growth Opportunities</h3>
                  <p className="text-sm text-gray-600">Revenue optimization potential</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {parsedInsights.opportunities.map((opp, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                      <ArrowUp className="w-4 h-4 text-white" />
                    </div>
                    <p className="flex-1 text-amber-800 font-medium">{opp}</p>
                    <div className="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-bold">
                      OPPORTUNITY
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Outlook */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Financial Outlook</h3>
                  <p className="text-sm text-gray-600">Future performance predictions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parsedInsights.outlook.map((prediction, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-blue-800 font-medium leading-relaxed">{prediction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Professional Insights - only show if no AI analysis yet */}
      {!parsedInsights && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Professional Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalInsights.map((insight, index) => {
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
      )}
    </div>
  );
};