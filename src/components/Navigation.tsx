
import { BarChart3, Plus, List, Brain } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'add-transaction', label: 'Add Transaction', icon: Plus },
    { id: 'transactions', label: 'All Transactions', icon: List },
    { id: 'insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <nav className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
