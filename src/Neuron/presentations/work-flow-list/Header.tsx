import { Button } from '@/lib/ui';
import { Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IHeader {
  isLoading?: boolean;
}

export const Header: React.FC<IHeader> = ({ isLoading }) => {
  const navigate = useNavigate();
  const handleCreateWorkflow = () => {
    navigate('/workflow/create');
  };

  return (
    <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white'>
      <div>
        <h1 className='text-lg font-semibold text-gray-900'>Guideline Workflows</h1>
        <p className='text-sm text-gray-400 mt-0.5'>Manage all your guideline workflows</p>
      </div>
      <Button
        onClick={handleCreateWorkflow}
        leftIcon={Plus}
        iconSize={15}
        className='h-9 px-4 rounded-lg text-sm'
        disabled={isLoading}
      >
        Create new Workflow
      </Button>
    </div>
  );
};
