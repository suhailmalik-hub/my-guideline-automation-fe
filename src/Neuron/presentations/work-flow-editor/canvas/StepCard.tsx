import { useWorkflow } from '@/Neuron/context';
import type { WorkflowStep } from '@/Neuron/types/workflow.editor.types';
import { getCanvasItemSortableId } from '@/Neuron/types/workflow.editor.types';
import { getActionIcon, getStepStyle } from '@/lib';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical } from 'lucide-react';
import { createElement } from 'react';

interface StepCardProps {
  step: WorkflowStep;
  isSelected: boolean;
  index: number;
}

export const StepCard = ({ step, isSelected, index }: StepCardProps) => {
  const { selectStep } = useWorkflow();
  const style = getStepStyle(step.category);
  const IconComponent = getActionIcon(step.actionType);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getCanvasItemSortableId({ kind: 'step', id: step.id }),
    data: { kind: 'canvas-step', stepId: step.id },
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const description = step.description || step.xpath || '';
  const truncatedDesc = description.length > 45 ? `${description.slice(0, 45)}...` : description;

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`relative flex items-center gap-3 px-4 h-[72px] bg-white border max-w-xl mx-auto w-full cursor-pointer transition-all
        ${
          isSelected
            ? `${style.borderColor} ring-2 ring-blue-100 ${style.bgLight}`
            : 'border-gray-200 hover:border-gray-300'
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}`}
      onClick={() => selectStep(step.id)}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1  ${style.stripColor}`} />
      <div className='w-7 h-7  bg-gray-100 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0'>
        {String(index + 1).padStart(2, '0')}
      </div>

      {createElement(IconComponent, {
        size: 20,
        className: `${style.textColor} shrink-0`,
      })}

      <div className='flex-1 min-w-0'>
        <div className='font-medium text-sm text-gray-900 truncate'>{step.name}</div>
        {truncatedDesc && <div className='text-xs text-gray-500 truncate'>{truncatedDesc}</div>}
      </div>

      <div className='flex items-center gap-1 shrink-0'>
        <div
          {...attributes}
          {...listeners}
          className='p-1 cursor-grab text-gray-300 hover:text-gray-500'
        >
          <GripVertical size={16} />
        </div>
        <button
          className='p-1 text-gray-300 hover:text-gray-500'
          aria-label='Step options'
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
