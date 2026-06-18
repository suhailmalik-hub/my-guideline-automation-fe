import { Button } from '@/lib/ui/components';
import { useWorkflow } from '@/Neuron/context';
import type { WorkflowFlow } from '@/Neuron/types/workflow.editor.types';
import { Clock, Globe, Layers, Link, Trash2, X } from 'lucide-react';
import {
  INSPECTOR_INPUT_CLASS as inputClass,
  INSPECTOR_INPUT_DISABLED_CLASS as inputDisabledClass,
  INSPECTOR_INPUT_ERROR_CLASS as inputErrorClass,
} from '../../../types/inspector.types';

const FLOW_ACCENT_COLORS = ['bg-blue-400', 'bg-violet-400', 'bg-teal-400', 'bg-amber-400', 'bg-rose-400'];

interface FlowInspectorProps {
  flow: WorkflowFlow;
  colorIndex: number;
}

export const FlowInspector = ({ flow, colorIndex }: FlowInspectorProps) => {
  const { updateFlow, deleteFlow, selectFlow, validationErrors, clearFieldError } = useWorkflow();
  const accentColor = FLOW_ACCENT_COLORS[colorIndex % FLOW_ACCENT_COLORS.length];
  const errors = validationErrors[flow.id] ?? {};

  const update = (updates: Partial<Pick<WorkflowFlow, 'name' | 'url' | 'waitBeforeStart'>>) => {
    updateFlow(flow.id, updates);
    // Clear field errors as user types
    for (const key of Object.keys(updates)) {
      if (errors[key]) clearFieldError(flow.id, key);
    }
  };

  const handleDelete = () => {
    deleteFlow(flow.id);
    selectFlow(null);
  };

  return (
    <div className='w-80 border-l border-gray-200 bg-white h-full shrink-0 flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='px-4 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0'>
        <div className={`w-3 h-3 rounded-full shrink-0 ${accentColor}`} />
        <div className='flex-1 min-w-0'>
          <div className='text-xs font-semibold uppercase tracking-wider text-gray-400'>Flow</div>
          <div className='text-sm font-semibold text-gray-800 truncate'>{flow.name}</div>
        </div>
        <button
          onClick={() => selectFlow(null)}
          className='p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0'
          title='Deselect flow'
        >
          <X size={15} />
        </button>
      </div>

      {/* Fields */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-5'>
        {/* Step count */}
        <div className='flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100'>
          <Layers
            size={14}
            className='text-gray-400 shrink-0'
          />
          <span className='text-xs text-gray-500'>
            <span className='font-semibold text-gray-700'>{flow.steps.length}</span>{' '}
            {flow.steps.length === 1 ? 'step' : 'steps'} in this flow
          </span>
        </div>

        {/* Flow Name */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider'>
            <Layers size={11} /> Flow Name
          </label>
          <input
            type='text'
            value={flow.name}
            readOnly
            disabled
            className={inputDisabledClass}
          />
        </div>

        {/* Starting URL */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider'>
            <Link size={11} /> Starting URL<span className='text-red-400 ml-0.5'>*</span>
          </label>
          <div className='relative'>
            <Globe
              size={14}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            />
            <input
              type='text'
              value={flow.url ?? ''}
              onChange={(e) => update({ url: e.target.value })}
              placeholder='https://example.com/page'
              className={`${errors.url ? inputErrorClass : inputClass} pl-8`}
            />
          </div>
          {errors.url ? (
            <p className='text-[11px] text-red-500'>{errors.url}</p>
          ) : (
            <p className='text-[11px] text-gray-400'>Browser navigates here when this flow starts.</p>
          )}
        </div>

        {/* Wait Before Start */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider'>
            <Clock size={11} /> Wait Before Start (ms)
          </label>
          <div className='relative'>
            <Clock
              size={14}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
            />
            <input
              type='number'
              min={8000}
              step={500}
              value={flow.waitBeforeStart ?? 8000}
              onChange={(e) => update({ waitBeforeStart: Math.max(8000, Number(e.target.value)) })}
              className={`${inputClass} pl-8`}
            />
          </div>
          <p className='text-[11px] text-gray-400'>Minimum 8000 ms before flow execution begins.</p>
        </div>

        {/* Steps summary */}
        {flow.steps.length > 0 && (
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Steps in this flow</label>
            <div className='space-y-1'>
              {flow.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className='flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600'
                >
                  <span className='font-mono text-gray-400 shrink-0'>{String(idx + 1).padStart(2, '0')}</span>
                  <span className='truncate'>{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete flow */}
      <div className='px-4 py-3 border-t border-gray-100 shrink-0'>
        <Button
          onClick={handleDelete}
          variant='text'
          leftIcon={Trash2}
          iconSize={14}
          className='w-full rounded-lg text-sm border border-red-100 !text-red-500 hover:!bg-red-50 hover:!border-red-200'
        >
          Delete Flow
        </Button>
      </div>
    </div>
  );
};
