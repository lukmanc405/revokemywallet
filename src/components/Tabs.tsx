import { ListChecks, Clock } from 'lucide-react';

type TabId = 'approvals' | 'history';

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof ListChecks }[] = [
  { id: 'approvals', label: 'Approvals', icon: ListChecks },
  { id: 'history', label: 'History', icon: Clock },
];

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-gray-800 safe-area-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? 'text-purple-500' : 'text-gray-500'
              }`}
            >
              {active && (
                <div className="w-8 h-0.5 bg-purple-500 rounded-full absolute top-0" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
