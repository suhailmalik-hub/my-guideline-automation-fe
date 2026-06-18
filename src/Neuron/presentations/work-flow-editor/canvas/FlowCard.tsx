import { getActionIcon, getStepStyle } from '@/lib';
import { useWorkflow } from '@/Neuron/context';
import type { ActionType, WorkflowFlow, WorkflowStep } from '@/Neuron/types/workflow.editor.types';
import { getCanvasItemSortableId } from '@/Neuron/types/workflow.editor.types';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { createElement, useEffect, useRef, useState } from 'react';

const QUICK_ACTIONS: Array<{ type: ActionType; label: string }> = [
  { type: 'openUrl', label: 'Open URL' },
  { type: 'extract', label: 'Extract Content' },
  { type: 'extractPDF', label: 'Extract PDF' },
  { type: 'extractScreenshot', label: 'Extract Screen Shot' },
  { type: 'click', label: 'Click' },
  { type: 'selectDropdownOption', label: 'Select Dropdown' },
  { type: 'fillTextInput', label: 'Fill Text Input' },
  { type: 'selectRadioInput', label: 'Select Radio' },
];

interface FlowStepRowProps {
  step: WorkflowStep;
  index: number;
  isSelected: boolean;
}

const FlowStepRow = ({ step, index, isSelected }: FlowStepRowProps) => {
  const { selectStep } = useWorkflow();
  const style = getStepStyle(step.category);
  const IconComponent = getActionIcon(step.actionType);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
    data: { kind: 'flow-step' },
  });

  const dragStyle = { transform: CSS.Transform.toString(transform), transition };
  const description = step.description || '';
  const truncatedDesc = description.length > 40 ? `${description.slice(0, 40)}…` : description;

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      onClick={() => selectStep(step.id)}
      className={`relative flex items-center gap-3 px-3 h-[60px] rounded-sm bg-white border cursor-pointer transition-all group
  ${isSelected ? `${style.borderColor} ring-2 ring-blue-100 ${style.bgLight}` : 'border-gray-200 hover:border-gray-300'}
  ${isDragging ? 'opacity-40 scale-95' : ''}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.stripColor}`} />
      <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0'>
        {String(index + 1).padStart(2, '0')}
      </div>
      {createElement(IconComponent, {
        size: 18,
        className: `${style.textColor} shrink-0`,
      })}
      <div className='flex-1 min-w-0'>
        <div className='font-medium text-sm text-gray-900 truncate'>{step.name}</div>
        {truncatedDesc && <div className='text-xs text-gray-400 truncate'>{truncatedDesc}</div>}
      </div>
      <div className='flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
        <div
          {...attributes}
          {...listeners}
          className='p-1 cursor-grab text-gray-300 hover:text-gray-500'
        >
          <GripVertical size={14} />
        </div>
        <button
          className='p-1 text-gray-300 hover:text-gray-500'
          aria-label='Step options'
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
};

// Flow color palette

const FLOW_COLORS = [
  {
    strip: 'bg-blue-400',
    header: 'border-blue-200 bg-blue-50/60',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-400',
    highlight: 'ring-2 ring-blue-200 border-blue-300',
  },
  {
    strip: 'bg-violet-400',
    header: 'border-violet-200 bg-violet-50/60',
    badge: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-400',
    highlight: 'ring-2 ring-violet-200 border-violet-300',
  },
  {
    strip: 'bg-teal-400',
    header: 'border-teal-200 bg-teal-50/60',
    badge: 'bg-teal-100 text-teal-700',
    dot: 'bg-teal-400',
    highlight: 'ring-2 ring-teal-200 border-teal-300',
  },
  {
    strip: 'bg-amber-400',
    header: 'border-amber-200 bg-amber-50/60',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    highlight: 'ring-2 ring-amber-200 border-amber-300',
  },
  {
    strip: 'bg-rose-400',
    header: 'border-rose-200 bg-rose-50/60',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-400',
    highlight: 'ring-2 ring-rose-200 border-rose-300',
  },
];

// FlowCard — accordion container

interface FlowCardProps {
  flow: WorkflowFlow;
  canvasIndex: number;
}

export const FlowCard = ({ flow, canvasIndex }: FlowCardProps) => {
  const {
    selectedStepId,
    selectedFlowId,
    toggleFlowCollapsed,
    deleteFlow,
    addStepToFlow,
    reorderStepsInFlow,
    selectFlow,
    validateBeforeAddStep,
  } = useWorkflow();

  const isFlowSelected = selectedFlowId === flow.id;
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const color = FLOW_COLORS[canvasIndex % FLOW_COLORS.length];

  // Canvas-level sortable (outer DndContext)
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getCanvasItemSortableId({ kind: 'flow', id: flow.id }),
    data: { kind: 'canvas-flow', flowId: flow.id },
  });
  const dragStyle = { transform: CSS.Transform.toString(transform), transition };

  // Drop zone (outer DnDContext) — accepts palette action drags
  const dropId = `flow-drop-${flow.id}`;
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: dropId });

  // Inner DnD for reordering steps inside the flow
  const innerSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleInnerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = flow.steps.findIndex((s) => s.id === active.id);
    const newIdx = flow.steps.findIndex((s) => s.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) reorderStepsInFlow(flow.id, oldIdx, newIdx);
  };

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  return (
    <div
      ref={setSortableRef}
      style={dragStyle}
      className={`max-w-xl mx-auto w-full rounded-md border-2 bg-white shadow-sm transition-all cursor-pointer
  ${isDragging ? 'opacity-40 scale-[0.98]' : ''}
  ${isFlowSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2.5 border-b transition-colors
  ${flow.collapsed ? ' border-b-transparent bg-gray-50/70' : color.header}`}
        onClick={() => selectFlow(isFlowSelected ? null : flow.id)}
      >
        {/* Drag handle (canvas reorder) */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className='p-1 cursor-grab text-gray-300 hover:text-gray-500 shrink-0'
          aria-label='Drag flow'
        >
          <GripVertical size={15} />
        </button>

        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.dot}`} />

        <span className='flex-1 text-left text-sm font-semibold text-gray-800 truncate'>{flow.name}</span>

        {/* Step count badge */}
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${color.badge}`}>
          {flow.steps.length} {flow.steps.length === 1 ? 'step' : 'steps'}
        </span>

        {/* Collapse / expand */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFlowCollapsed(flow.id);
          }}
          className='p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-colors shrink-0'
        >
          {flow.collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteFlow(flow.id);
          }}
          className='p-1 rounded-md text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0'
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Expanded body */}
      {!flow.collapsed && (
        <div className='px-3 py-3 space-y-2'>
          {/* Drop zone wrapper — connected to outer DndContext */}
          <div
            ref={setDropRef}
            className={`rounded-xl transition-all min-h-[60px]
  ${isOver ? 'bg-blue-50/60 ring-2 ring-blue-300 ring-offset-1' : ''}`}
          >
            {flow.steps.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center text-xs transition-colors
  ${isOver ? 'border-blue-400 text-blue-500 bg-blue-50' : 'border-gray-200 text-gray-400'}`}
              >
                {isOver ? '⬇ Drop action here' : 'Drag actions from the left panel to add steps'}
              </div>
            ) : (
              /* Inner DndContext for reordering steps within the flow */
              <DndContext
                sensors={innerSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleInnerDragEnd}
              >
                <SortableContext
                  items={flow.steps.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='space-y-2'>
                    {flow.steps.map((step, idx) => (
                      <FlowStepRow
                        key={step.id}
                        step={step}
                        index={idx}
                        isSelected={selectedStepId === step.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div
            className='relative'
            ref={pickerRef}
          >
            <button
              onClick={() => setShowPicker((p) => !p)}
              className='flex items-center gap-1.5 w-full px-3 py-2 rounded-md border border-dashed border-gray-300 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-colors'
            >
              <Plus size={13} />
              Add step to this flow
            </button>

            {/* Action picker popup */}
            {showPicker && (
              <div className='absolute bottom-full left-0 mb-1 w-full bg-white rounded-md border border-gray-200 shadow-xl p-2 z-50 grid grid-cols-2 gap-1'>
                {QUICK_ACTIONS.map((action) => {
                  const IconComponent = getActionIcon(action.type);
                  return (
                    <button
                      key={action.type}
                      onClick={() => {
                        if (!validateBeforeAddStep(flow.id)) return;
                        addStepToFlow(flow.id, action.type);
                        setShowPicker(false);
                      }}
                      className='flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left'
                    >
                      {createElement(IconComponent, {
                        size: 13,
                        className: 'shrink-0 text-gray-400',
                      })}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
