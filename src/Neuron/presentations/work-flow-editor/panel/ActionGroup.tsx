import type { ActionType } from '@/Neuron/types/workflow.editor.types';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ActionItem } from './ActionItem';

interface ActionGroupProps {
  title: string;
  icon: LucideIcon;
  items: { actionType: ActionType; label: string }[];
  searchQuery: string;
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  Browser: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  Extract: { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
  Interact: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
};

export const ActionGroup = ({ title, icon: GroupIcon, items, searchQuery }: ActionGroupProps) => {
  const [open, setOpen] = useState(true);
  const colors = colorMap[title] || { bg: 'bg-gray-50', text: 'text-gray-700', iconBg: 'bg-gray-100' };

  const filteredItems = searchQuery
    ? items.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  if (filteredItems.length === 0) return null;

  return (
    <div className='mb-3 px-1'>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${colors.bg} hover:shadow-sm border border-transparent hover:border-gray-200`}
      >
        <div className={`p-1 rounded-md ${colors.iconBg} shrink-0`}>
          {open ? (
            <ChevronDown
              size={12}
              className={colors.text}
            />
          ) : (
            <ChevronRight
              size={12}
              className={colors.text}
            />
          )}
        </div>
        <div className={`p-0.5 rounded-md ${colors.iconBg} shrink-0`}>
          <GroupIcon
            size={12}
            className={colors.text}
          />
        </div>
        <span className={`${colors.text} flex-1 text-left`}>{title}</span>
        <span className={`text-[10px] font-medium ${colors.text} opacity-60`}>{filteredItems.length}</span>
      </button>
      {open && (
        <div className='mt-2 ml-1 pl-2 border-l-2 border-gray-200 space-y-1'>
          {filteredItems.map((item) => (
            <ActionItem
              key={item.actionType}
              actionType={item.actionType}
              label={item.label}
              groupColor={colors.text}
            />
          ))}
        </div>
      )}
    </div>
  );
};
