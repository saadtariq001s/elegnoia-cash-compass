// src/components/Navigation.tsx - Professional Design
import { 
  BarChart3, 
  Plus, 
  List, 
  Brain, 
  TrendingUp, 
  Sparkles,
  FileText,
  Target
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Overview & insights',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'add-transaction', 
      label: 'Add Transaction', 
      icon: Plus,
      description: 'Create new entry',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'transactions', 
      label: 'All Transactions', 
      icon: FileText,
      description: 'Manage records',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'charts', 
      label: 'Analytics', 
      icon: TrendingUp,
      description: 'Data visualization',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      id: 'insights', 
      label: 'AI Insights', 
      icon: Brain,
      description: 'Smart recommendations',
      color: 'from-pink-500 to-pink-600'
    },
  ];

  return (
    <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 backdrop-blur-sm bg-white/95">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 text-sm
                ${isActive 
                  ? 'bg-gradient-to-r text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:scale-102'
                }
              `}
              style={isActive ? {
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                backgroundImage: `linear-gradient(135deg, ${tab.color.split(' ')[0].replace('from-', '')} 0%, ${tab.color.split(' ')[1].replace('to-', '')} 100%)`
              } : {}}
            >
              {/* Background glow effect for active tab */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-xl opacity-20 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${tab.color.split(' ')[0].replace('from-', '')} 0%, ${tab.color.split(' ')[1].replace('to-', '')} 100%)`
                  }}
                />
              )}
              
              {/* Icon with enhanced styling */}
              <div className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'group-hover:bg-gray-100'
                }
              `}>
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`} />
                
                {/* Special effects for certain tabs */}
                {tab.id === 'insights' && isActive && (
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
                )}
              </div>
              
              {/* Text content */}
              <div className="hidden sm:block relative z-10">
                <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {tab.label}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                  {tab.description}
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full" />
              )}
              
              {/* Hover effect for inactive tabs */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Professional enhancement indicators */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>Professional Edition</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 font-medium">
          AgenticAccounting v2.0
        </div>
      </div>
    </nav>
  );
};