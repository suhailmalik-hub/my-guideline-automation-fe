import type { ActionType } from '@/Neuron/types/workflow.editor.types';
import { useDraggable } from '@dnd-kit/core';
import { Download, Globe, Layers, MousePointer, Search } from 'lucide-react';
import { useState } from 'react';
import { ActionGroup } from './ActionGroup';

interface ActionGroupData {
  title: string;
  icon: typeof Globe;
  items: { actionType: ActionType; label: string }[];
}

const actionGroups: ActionGroupData[] = [
  {
    title: 'Browser',
    icon: Globe,
    items: [{ actionType: 'openUrl', label: 'Open URL' }],
  },
  {
    title: 'Extract',
    icon: Download,
    items: [
      { actionType: 'extract', label: 'Extract Content' },
      { actionType: 'extractPDF', label: 'Extract PDF' },
      { actionType: 'extractScreenshot', label: 'Extract Screen Shot' },
    ],
  },
  {
    title: 'Interact',
    icon: MousePointer,
    items: [
      { actionType: 'click', label: 'Click' },
      { actionType: 'selectDropdownOption', label: 'Select Dropdown' },
      { actionType: 'fillTextInput', label: 'Fill Text Input' },
      { actionType: 'selectRadioInput', label: 'Select Radio' },
    ],
  },
];

// Draggable 'New Flow' item
const FlowDraggableItem = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'new-flow-drag',
    data: { type: 'FLOW_ITEM' },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50 cursor-grab transition-all text-blue-600 ${
        isDragging ? 'opacity-40' : ''
      }`}
      title='Drag to canvas to add a new flow group'
    >
      <Layers
        size={13}
        className='shrink-0'
      />
      <div className='flex-1 min-w-0'>
        <div className='text-xs font-semibold leading-tight'>New Flow</div>
        <div className='text-[9px] text-blue-400 leading-tight'>Drag to canvas</div>
      </div>
    </div>
  );
};

export const ActionPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='w-60 border-r border-gray-200 bg-white flex flex-col h-full shrink-0'>
      <div className='px-3 pt-4 pb-2'>
        <h2 className='text-sm font-semibold text-gray-800 mb-2'>Actions</h2>
        <div className='relative'>
          <Search
            size={14}
            className='absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search actions...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-1 pb-4'>
        {/* Structure section */}
        <div className='px-2 pt-2 pb-3'>
          <p className='text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1'>Structure</p>
          <FlowDraggableItem />
        </div>
        <div className='mx-2 border-t border-gray-100 mb-1' />
        {actionGroups.map((group) => (
          <ActionGroup
            key={group.title}
            title={group.title}
            icon={group.icon}
            items={group.items}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};
