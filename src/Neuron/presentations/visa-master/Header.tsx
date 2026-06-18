import { Button } from '@/lib/ui';
import { Plus } from 'lucide-react';
import React from 'react';

interface VisaMasterHeaderProps {
  onCreateVisaType: () => void;
}

export const VisaMasterHeader: React.FC<VisaMasterHeaderProps> = ({ onCreateVisaType }) => {
  return (
    <div className='flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white rounded-lg'>
      <h1 className='text-md font-semibold text-gray-800'>Manage Visa Configuration</h1>
      <Button
        onClick={onCreateVisaType}
        leftIcon={Plus}
        iconSize={18}
        className='h-9 px-4 rounded-lg text-sm'
      >
        Create Visa Type
      </Button>
    </div>
  );
};
