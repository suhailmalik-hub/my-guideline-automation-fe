type WorkflowTab = 'PUBLISHED' | 'IN_PROGRESS' | 'RUN_ERROR';

interface WorkflowTabsProps {
  activeTab: WorkflowTab;
  onTabChange: (tab: WorkflowTab) => void;
}

const TABS: { label: string; value: WorkflowTab }[] = [
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Run Error', value: 'RUN_ERROR' },
];

export const WorkflowTabs = ({ activeTab, onTabChange }: WorkflowTabsProps) => {
  return (
    <div className='flex items-center gap-1 border-b border-gray-200 px-6 bg-white'>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type='button'
            onClick={() => onTabChange(tab.value)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {isActive && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full' />}
          </button>
        );
      })}
    </div>
  );
};

export type { WorkflowTab };
