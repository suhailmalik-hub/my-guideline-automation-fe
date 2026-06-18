import type { WorkflowFlow, WorkflowStep } from '@/Neuron/types/workflow.editor.types';

export type ValidationErrors = Record<string, string>;

/**
 * Validates a flow's required fields.
 * Returns a map of field → error message. Empty map = valid.
 */
export function validateFlow(flow: WorkflowFlow): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!flow.url || !flow.url.trim()) {
    errors.url = 'Starting URL is required';
  }

  return errors;
}

/**
 * Validates a step's required fields based on its actionType.
 * Returns a map of field → error message. Empty map = valid.
 */
export function validateStep(step: WorkflowStep): ValidationErrors {
  const errors: ValidationErrors = {};

  switch (step.actionType) {
    case 'openUrl': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.description || !step.description.trim()) errors.description = 'Target Description is required';
      if (!step.url || !step.url.trim()) errors.url = 'URL is required';
      break;
    }

    case 'extract': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.description || !step.description.trim()) errors.description = 'Target Description is required';
      break;
    }

    case 'extractPDF': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.pdfUrl || !step.pdfUrl.trim()) errors.pdfUrl = 'PDF URL is required';
      break;
    }

    case 'click': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.description || !step.description.trim()) errors.description = 'Target Description is required';
      break;
    }

    case 'extractScreenshot': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.description || !step.description.trim()) errors.description = 'Target Description is required';
      if (!step.contentFrom || !step.contentFrom.trim()) errors.contentFrom = 'Content From is required';
      if (!step.contentUpto || !step.contentUpto.trim()) errors.contentUpto = 'Content Upto is required';
      break;
    }

    case 'selectDropdownOption':
    case 'fillTextInput':
    case 'selectRadioInput': {
      if (!step.name || !step.name.trim()) errors.name = 'Step Name is required';
      if (!step.description || !step.description.trim()) errors.description = 'Target Description is required';
      if (!step.targetElement || !step.targetElement.trim()) errors.targetElement = 'Target Element is required';
      if (step.targetElement && step.targetElement.trim() && (!step.value || !step.value.trim())) {
        errors.value = 'Value is required when Target Element is selected';
      }
      break;
    }

    default:
      break;
  }

  return errors;
}

/**
 * Returns true if the errors map is empty (i.e. valid).
 */
export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
