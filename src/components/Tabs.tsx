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
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-brand-dark/95 backdrop-blur-md border-t border-white/5 safe-area-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3.5 transition-all duration-200 ${
                active ? 'text-brand-blue' : 'text-gray-600'
              }`}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-blue rounded-full" />
              )}
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[11px] font-semibold tracking-wide ${active ? 'text-brand-blue' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
