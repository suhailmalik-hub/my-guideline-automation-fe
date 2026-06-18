import { useWorkflow } from '@/Neuron/context';
import { Plus } from 'lucide-react';

interface AddStepButtonProps {
  atIndex: number;
}

export const AddStepButton = ({ atIndex }: AddStepButtonProps) => {
  const { addStep } = useWorkflow();

  return (
    <div className='flex justify-center py-1'>
      <button
        onClick={() => addStep('click', atIndex)}
        className='w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors'
        aria-label='Add step'
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
