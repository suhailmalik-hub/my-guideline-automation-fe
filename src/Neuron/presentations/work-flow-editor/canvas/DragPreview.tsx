import { getActionIcon } from '@/lib';
import type { ActionType } from '@/Neuron/types/workflow.editor.types';
import { Layers } from 'lucide-react';
import { createElement } from 'react';

export interface ActiveDragState {
  type: 'ACTION_ITEM' | 'FLOW_ITEM' | 'canvas-step' | 'canvas-flow' | 'unknown';
  label?: string;
  actionType?: ActionType;
}

interface DragPreviewProps {
  activeDrag: ActiveDragState | null;
}

export const DragPreview = ({ activeDrag }: DragPreviewProps) => {
  if (!activeDrag) return null;

  if (activeDrag.type === 'FLOW_ITEM') {
    return (
      <div className='flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-blue-400 rounded-xl shadow-2xl w-44 opacity-95 cursor-grabbing'>
        <Layers
          size={16}
          className='text-blue-500 shrink-0'
        />
        <div>
          <div className='text-xs font-semibold text-blue-700'>New Flow</div>
          <div className='text-[10px] text-blue-400'>Flow container</div>
        </div>
      </div>
    );
  }

  if (activeDrag.type === 'ACTION_ITEM' && activeDrag.actionType) {
    const IconComponent = getActionIcon(activeDrag.actionType);
    return (
      <div className='flex items-center gap-2.5 px-4 py-2.5 bg-white border border-blue-300 rounded-xl shadow-2xl w-48 opacity-95 cursor-grabbing ring-2 ring-blue-100'>
        {createElement(IconComponent, {
          size: 16,
          className: 'text-blue-500 shrink-0',
        })}
        <span className='text-sm font-medium text-gray-700'>{activeDrag.label ?? activeDrag.actionType}</span>
      </div>
    );
  }

  if (activeDrag.type === 'canvas-step') {
    return (
      <div className='px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xl w-64 opacity-70 h-[72px] flex items-center'>
        <div className='text-sm text-gray-500'>Moving step…</div>
      </div>
    );
  }

  return null;
};
