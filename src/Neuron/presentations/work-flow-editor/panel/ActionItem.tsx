import { getActionIcon } from '@/lib';
import type { ActionType } from '@/Neuron/types/workflow.editor.types';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { createElement } from 'react';

interface ActionItemProps {
  actionType: ActionType;
  label: string;
  groupColor?: string;
}

export const ActionItem = ({ actionType, label, groupColor = 'text-gray-700' }: ActionItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `action-${actionType}`,
    data: { type: 'ACTION_ITEM', actionType, label },
  });

  const IconComponent = getActionIcon(actionType);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs cursor-grab transition-all duration-200 border border-transparent hover:bg-white hover:shadow-sm hover:border-gray-100 group ${
        isDragging ? 'opacity-40 bg-gray-50' : ''
      }`}
    >
      <GripVertical
        size={12}
        className='text-gray-300 group-hover:text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'
      />
      <div className='p-1 rounded-md bg-gray-100 group-hover:bg-gray-200 shrink-0 transition-colors'>
        {createElement(IconComponent, {
          size: 13,
          className: `${groupColor} opacity-80`,
        })}
      </div>
      <span className='text-gray-700 font-medium flex-1'>{label}</span>
    </div>
  );
};
