import { getActionIcon, getStepStyle } from '@/lib';
import { Button } from '@/lib/ui/components';
import type { ActionType, WorkflowStep } from '@/Neuron/types/workflow.editor.types';
import { Save, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { createElement } from 'react';

interface StepInspectorLayoutProps {
  step: WorkflowStep;
  stepOrder: number;
  onDelete: () => void;
  onSave: () => void;
  children: ReactNode;
}

const ACTION_TYPE_LABELS: Record<string, string> = {
  openUrl: 'Open URL',
  extract: 'Extract',
  extractPDF: 'Extract PDF',
  click: 'Click',
  selectDropdownOption: 'Select Dropdown',
  fillTextInput: 'Fill Input',
  selectRadioInput: 'Select Radio',
};

const getActionTypeLabel = (actionType: ActionType): string => ACTION_TYPE_LABELS[actionType] ?? actionType;

interface StepInspectorLayoutProps {
  step: WorkflowStep;
  stepOrder: number;
  onDelete: () => void;
  onSave: () => void;
  children: ReactNode;
}

export const StepInspectorLayout = ({ step, stepOrder, onDelete, onSave, children }: StepInspectorLayoutProps) => {
  const style = getStepStyle(step.category);
  const IconComponent = getActionIcon(step.actionType);

  return (
    <div className='w-80 border-l border-gray-200 bg-white h-full shrink-0 flex flex-col overflow-hidden'>
      <div className='px-4 pt-4 pb-3 border-b border-gray-100 shrink-0'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <div className={`p-1.5 rounded-lg ${style.badgeBg}`}>
              {createElement(IconComponent, {
                size: 14,
                className: style.textColor,
              })}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.badgeBg} ${style.badgeText}`}>
              {step.category.charAt(0).toUpperCase() + step.category.slice(1)}
            </span>
            <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200'>
              {getActionTypeLabel(step.actionType)}
            </span>
          </div>
          <button
            onClick={onDelete}
            className='p-1.5 text-red-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors'
            aria-label='Delete step'
          >
            <Trash2 size={15} />
          </button>
        </div>
        <div className='font-semibold text-sm text-gray-900 truncate'>{step.name}</div>
        <div className='text-xs text-gray-400 mt-0.5'>Step {stepOrder}</div>
      </div>
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>{children}</div>
      <div className='px-4 py-3 border-t border-gray-100 shrink-0'>
        <Button
          onClick={onSave}
          leftIcon={Save}
          iconSize={14}
          className='w-full h-10 rounded-lg active:scale-[0.98]'
        >
          Save Step
        </Button>
      </div>
    </div>
  );
};
