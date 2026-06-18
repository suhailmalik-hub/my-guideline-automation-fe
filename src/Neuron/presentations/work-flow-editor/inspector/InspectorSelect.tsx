import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface InspectorSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export const InspectorSelect = ({ value, onChange, options, placeholder = 'Select…' }: InspectorSelectProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, close]);

  const handleSelect = (opt: string) => {
    onChange(opt);
    close();
  };

  return (
    <div
      ref={containerRef}
      className='relative'
    >
      {/* Trigger */}
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className={
          'w-full h-9 flex items-center justify-between rounded-lg border text-sm px-3 bg-white shadow-sm transition-all duration-150 text-left ' +
          (open ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300') +
          (!value ? ' text-gray-400' : ' text-gray-800')
        }
      >
        <span className='truncate'>{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={'shrink-0 text-gray-400 transition-transform duration-150 ' + (open ? 'rotate-180' : '')}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg py-0 animate-in fade-in slide-in-from-top-1 duration-100'>
          {/* Clear / placeholder option */}
          <button
            type='button'
            onClick={() => handleSelect('')}
            className={
              'w-full px-3 py-2 text-sm text-left transition-colors border-b border-gray-100 ' +
              (!value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-400 hover:bg-gray-50')
            }
          >
            <span className='italic'>{placeholder}</span>
          </button>

          {options.map((opt, idx) => {
            const isSelected = opt === value;
            const isLast = idx === options.length - 1;
            return (
              <button
                type='button'
                key={opt}
                onClick={() => handleSelect(opt)}
                className={
                  'w-full px-3 py-2 text-sm text-left transition-colors ' +
                  (!isLast ? 'border-b border-gray-100 ' : '') +
                  (isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50')
                }
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
