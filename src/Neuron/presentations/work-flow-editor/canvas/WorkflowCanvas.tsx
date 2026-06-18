import { useWorkflow } from '@/Neuron/context';
import { getCanvasItemSortableId } from '@/Neuron/types/workflow.editor.types';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback } from 'react';
import { FlowCard } from './FlowCard';
import { StepCard } from './StepCard';
import { StepConnector } from './StepConnector';

/**
 * WorkflowCanvas — pure renderer.
 *
 * ALL DnD handling (palette drags, canvas reordering, flow drops) lives in
 * the outer DndContext in WorkFlowEditor so that:
 *   – ActionItem.useDraggable   → outer context
 *   – StepCard.useSortable      → outer context
 *   – FlowCard.useSortable      → outer context
 *   – FlowCard.useDroppable     → outer context
 *   – FlowStepRow.useSortable   → FlowCard's own inner DndContext
 */
export default function WorkflowCanvas() {
  const { steps, flows, canvasOrder, selectedStepId, selectStep } = useWorkflow();

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) selectStep(null);
    },
    [selectStep]
  );

  const sortableIds = canvasOrder.map(getCanvasItemSortableId);
  const isEmpty = canvasOrder.length === 0;

  return (
    <div
      className='flex-1 overflow-y-auto px-8 py-6 bg-gray-50 h-full'
      onClick={handleCanvasClick}
    >
      {/* Start badge */}
      <div className='flex justify-center mb-2'>
        <span className='px-4 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full'>Start</span>
      </div>

      {!isEmpty && <StepConnector />}

      {/* SortableContext is connected to the outer DndContext in WorkFlowEditor */}
      <SortableContext
        items={sortableIds}
        strategy={verticalListSortingStrategy}
      >
        {canvasOrder.map((item, idx) => {
          if (item.kind === 'step') {
            const step = steps.find((s) => s.id === item.id);
            if (!step) return null;
            return (
              <div key={step.id}>
                <StepCard
                  step={step}
                  isSelected={selectedStepId === step.id}
                  index={idx}
                />
                {idx < canvasOrder.length - 1 && <StepConnector />}
              </div>
            );
          }

          if (item.kind === 'flow') {
            const flow = flows.find((f) => f.id === item.id);
            if (!flow) return null;
            const flowColorIndex = canvasOrder.slice(0, idx).filter((ci) => ci.kind === 'flow').length;
            return (
              <div key={flow.id}>
                <FlowCard
                  flow={flow}
                  canvasIndex={flowColorIndex}
                />
                {idx < canvasOrder.length - 1 && <StepConnector />}
              </div>
            );
          }

          return null;
        })}
      </SortableContext>

      {/* Empty state — guide user to drag a Flow first */}
      {isEmpty && (
        <div className='flex flex-col items-center mt-8 gap-2'>
          <StepConnector />
          <p className='text-sm text-gray-400 text-center max-w-xs'>
            Drag a <strong className='text-blue-500'>New Flow</strong> from the left panel to get started.
          </p>
        </div>
      )}

      {/* End badge */}
      <div className='flex justify-center mt-2'>
        <span className='px-4 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full'>End</span>
      </div>
    </div>
  );
}
