import { Button } from '@/lib/ui/components';
import { CheckCircle2, X } from 'lucide-react';

interface AutomationResultModalProps {
  isSaving: boolean;
  response: unknown;
  onClose: () => void;
  onConfirmWorkflow: () => void;
}

export const AutomationResultModal = ({
  isSaving,
  response,
  onClose,
  onConfirmWorkflow,
}: AutomationResultModalProps) => {
  const raw = typeof response === 'string' ? response : JSON.stringify(response, null, 2);

  return (
    <div className='absolute inset-0 z-50'>
      <div
        className='absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]'
        onClick={onClose}
      />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none px-4'>
        <div className='relative w-full max-w-4xl bg-white rounded-md shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]'>
          <div className='h-1 shrink-0 bg-gradient-to-r from-emerald-400 to-teal-500' />
          <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0'>
            <div className='p-2 rounded-xl bg-emerald-50'>
              <CheckCircle2
                size={18}
                className='text-emerald-500'
              />
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-sm font-semibold text-gray-900'>Verify Guideline Results</h2>
              <p className='text-xs text-gray-400 mt-0.5'>Review the API response and confirm the workflow</p>
            </div>

            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0'
              aria-label='Close'
            >
              <X size={15} />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto bg-gray-950 px-5 py-4'>
            <pre className='text-xs leading-relaxed font-mono whitespace-pre-wrap break-words text-gray-100'>{raw}</pre>
          </div>

          <div className='px-5 py-3 border-t border-gray-100 flex justify-end items-center shrink-0'>
            <Button
              onClick={onConfirmWorkflow}
              className='h-8 px-4 rounded-lg text-sm'
              isLoading={isSaving}
              loaderColor='#FFFFFF'
              loaderSize={15}
              disabled={isSaving}
            >
              Confirm Workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
