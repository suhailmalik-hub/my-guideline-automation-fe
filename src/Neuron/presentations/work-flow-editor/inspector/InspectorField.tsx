import type { ReactNode } from 'react';

interface InspectorFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
}

export const InspectorField = ({ label, children, required, error }: InspectorFieldProps) => {
  return (
    <div className='space-y-1.5'>
      <label className='block text-[11px] font-semibold text-gray-500 uppercase tracking-wider'>
        {label}
        {required && <span className='text-red-400 ml-0.5'>*</span>}
      </label>
      {children}
      {error && (
        <p className='text-[11px] text-red-500 mt-0.5'>{error}</p>
      )}
    </div>
  );
};
