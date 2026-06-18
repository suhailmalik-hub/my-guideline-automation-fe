import { MousePointerClick } from 'lucide-react';

export const EmptyInspector = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center px-6'>
      <MousePointerClick
        size={40}
        className='text-gray-300 mb-3'
      />
      <p className='text-sm text-gray-400'>Select a step to inspect</p>
    </div>
  );
};
