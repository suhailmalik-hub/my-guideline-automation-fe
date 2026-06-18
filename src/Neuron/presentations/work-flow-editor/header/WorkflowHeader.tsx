import { Button } from '@/lib/ui/components';
import { PlayCircle, Save, Zap } from 'lucide-react';
import type { AutomationFormValues } from '../modal/CreateAutomationModal';

interface WorkflowHeaderProps {
  formValues: AutomationFormValues;
  onUpdate: () => void;
  onRun?: () => void;
  onLock?: () => void;
  isAutomationExecuting: boolean;
  isUpdating?: boolean;
}

export const WorkflowHeader = ({
  formValues,
  onUpdate,
  onRun,
  isAutomationExecuting,
  isUpdating,
}: WorkflowHeaderProps) => {
  const { sourceCountry, destinationCountry, visaType, subvisaType } = formValues;

  const typeColor = 'text-blue-600 bg-blue-50';

  const workflowTitle =
    sourceCountry && destinationCountry && visaType
      ? `${sourceCountry} → ${destinationCountry} / ${visaType} ${subvisaType ? `- ${subvisaType}` : ''}`
      : 'Untitled Automation';

  return (
    <header className='h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-3 shrink-0 z-10'>
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeColor}`}>
        <Zap size={12} />
        Automation
      </span>

      <div className='w-px h-4 bg-gray-200' />

      <div className='flex-1 min-w-0'>
        <span
          className='text-sm font-medium text-gray-800 truncate block'
          title={workflowTitle}
        >
          {workflowTitle}
        </span>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <Button
          type='button'
          onClick={onRun}
          leftIcon={PlayCircle}
          iconSize={14}
          className='h-8 px-3 rounded-lg text-sm !bg-emerald-500 hover:!bg-emerald-600 shadow-sm shadow-emerald-200 active:scale-95'
          aria-label='Run automation'
          title='Run automation'
          disabled={isAutomationExecuting}
          isLoading={isAutomationExecuting}
          loaderColor='#FFFFFF'
          loaderSize={15}
        >
          Play
        </Button>

        <Button
          type='button'
          onClick={onUpdate}
          leftIcon={Save}
          iconSize={14}
          className='h-8 px-4 rounded-lg text-sm'
          aria-label='Save workflow'
          isLoading={isUpdating}
          loaderColor='#FFFFFF'
          loaderSize={15}
          disabled={isUpdating || isAutomationExecuting}
        >
          Save
        </Button>
      </div>
    </header>
  );
};
