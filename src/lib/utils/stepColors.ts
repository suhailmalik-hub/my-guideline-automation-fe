import type { ActionType, StepCategory } from '@/Neuron/types/workflow.editor.types';
import type { LucideIcon } from 'lucide-react';
import {
  Camera,
  ChevronDownSquare,
  CircleDot,
  ExternalLink,
  FileText,
  FormInput,
  MousePointer2,
  ScrollText,
} from 'lucide-react';

export interface StepStyle {
  stripColor: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export function getStepStyle(category: StepCategory): StepStyle {
  switch (category) {
    case 'browser':
      return {
        stripColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgLight: 'bg-blue-50/30',
        borderColor: 'border-blue-500',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
      };
    case 'extract':
      return {
        stripColor: 'bg-teal-500',
        textColor: 'text-teal-600',
        bgLight: 'bg-teal-50/30',
        borderColor: 'border-teal-500',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-700',
      };
    case 'interact':
    default:
      return {
        stripColor: 'bg-violet-500',
        textColor: 'text-violet-600',
        bgLight: 'bg-violet-50/30',
        borderColor: 'border-violet-500',
        badgeBg: 'bg-violet-100',
        badgeText: 'text-violet-700',
      };
  }
}

export const getActionIcon = (actionType: ActionType): LucideIcon => {
  const icons: Record<ActionType, LucideIcon> = {
    openUrl: ExternalLink,
    extract: ScrollText,
    extractPDF: FileText,
    extractScreenshot: Camera,
    click: MousePointer2,
    selectDropdownOption: ChevronDownSquare,
    fillTextInput: FormInput,
    selectRadioInput: CircleDot,
  };
  return icons[actionType] ?? ExternalLink;
};
