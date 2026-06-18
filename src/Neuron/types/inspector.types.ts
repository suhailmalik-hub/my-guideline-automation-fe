import type { WorkflowStep } from '@/Neuron/types/workflow.editor.types';

export interface StepInspectorProps {
  step: WorkflowStep;
  stepOrder: number;
  onUpdate: (updates: Partial<WorkflowStep>) => void;
  onDelete: () => void;
}

// Shared HTML element options for target element pickers
export const TARGET_ELEMENT_OPTIONS = [
  'button',
  'combobox', // for select dropdowns
  'div',
  'heading',
  'link', // for <a> tags
  'listitem', // for <li> elements
  'radio', // radio input element
  'span',
  'table',
  'textbox', // for input[type="text"]
] as const;

// Shared Tailwind class for all inspector text inputs
export const INSPECTOR_INPUT_CLASS =
  'w-full h-9 rounded-sm border border-gray-200 text-sm px-3 py-2 bg-white shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-150';

// Shared Tailwind class for all inspector textareas
export const INSPECTOR_TEXTAREA_CLASS =
  'w-full rounded-sm border border-gray-200 text-sm px-3 py-2 bg-white shadow-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-150';

// Shared Tailwind class for all inspector select dropdowns
export const INSPECTOR_SELECT_CLASS =
  'w-full h-9 rounded-sm border border-gray-200 text-sm pl-3 pr-8 py-2 bg-white shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-150 bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2716%27%20height%3D%2716%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%236b7280%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E")]';

// Shared Tailwind class for disabled/read-only inspector inputs
export const INSPECTOR_INPUT_DISABLED_CLASS =
  'w-full h-9 rounded-sm border border-gray-100 text-sm px-3 py-2 bg-gray-50 text-gray-400 shadow-sm cursor-not-allowed';

// Error-state class for inputs with validation errors
export const INSPECTOR_INPUT_ERROR_CLASS =
  'w-full h-9 rounded-sm border border-red-300 text-sm px-3 py-2 bg-white shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-150';

// Error-state class for textareas with validation errors
export const INSPECTOR_TEXTAREA_ERROR_CLASS =
  'w-full rounded-sm border border-red-300 text-sm px-3 py-2 bg-white shadow-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all duration-150';
