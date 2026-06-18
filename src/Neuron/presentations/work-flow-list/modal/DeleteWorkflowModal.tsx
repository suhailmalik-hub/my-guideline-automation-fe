import { Button } from '@/lib/ui/components';
import { AlertTriangle } from 'lucide-react';

interface DeleteWorkflowModalProps {
  workflowName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteWorkflowModal = ({ workflowName, onConfirm, onCancel, isDeleting }: DeleteWorkflowModalProps) => {
  return (
    <div className='absolute inset-0 z-50'>
      <div
        className='absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]'
        onClick={onCancel}
      />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none px-4'>
        <div className='relative w-full max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden pointer-events-auto'>
          <div className='h-1 shrink-0 bg-gradient-to-r from-red-400 to-rose-500' />

          <div className='px-6 pt-6 pb-4 flex flex-col items-center text-center'>
            <div className='p-3 rounded-full bg-red-50 mb-3'>
              <AlertTriangle
                size={24}
                className='text-red-500'
              />
            </div>
            <h2 className='text-sm font-semibold text-gray-900'>Delete Workflow</h2>
            <p className='text-sm text-gray-500 mt-2'>
              Are you sure you want to delete <span className='font-medium text-gray-700'>{workflowName}</span>? This
              action cannot be undone.
            </p>
          </div>

          <div className='px-6 py-4 flex justify-center items-center gap-3'>
            <Button
              onClick={onCancel}
              variant='text'
              disabled={isDeleting}
              className='h-8 px-5 rounded-lg text-sm border border-gray-200 !text-gray-600 hover:!bg-gray-50'
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              isLoading={isDeleting}
              loaderColor='#FFFFFF'
              loaderSize={15}
              className='h-8 px-5 rounded-lg text-sm !bg-red-600 hover:!bg-red-700'
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
