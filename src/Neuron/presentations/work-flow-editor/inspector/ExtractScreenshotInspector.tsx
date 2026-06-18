import { useWorkflow } from '@/Neuron/context';
import type { StepInspectorProps } from '../../../types/inspector.types';
import {
  INSPECTOR_INPUT_CLASS,
  INSPECTOR_INPUT_DISABLED_CLASS,
  INSPECTOR_INPUT_ERROR_CLASS,
  INSPECTOR_TEXTAREA_CLASS,
  INSPECTOR_TEXTAREA_ERROR_CLASS,
} from '../../../types/inspector.types';
import { InspectorField } from './InspectorField';
import { StepInspectorLayout } from './StepInspectorLayout';
import { isValid, validateStep } from './validation';

export const ExtractScreenshotInspector = ({ step, stepOrder, onUpdate, onDelete }: StepInspectorProps) => {
  const { validationErrors, clearFieldError, setValidationErrorsFor } = useWorkflow();
  const errors = validationErrors[step.id] ?? {};

  const handleFieldChange = (field: string, updates: Parameters<typeof onUpdate>[0]) => {
    onUpdate(updates);
    if (errors[field]) clearFieldError(step.id, field);
  };

  const handleSave = () => {
    try {
      const stepErrors = validateStep(step);
      if (!isValid(stepErrors)) {
        setValidationErrorsFor(step.id, stepErrors);
        return;
      }
      const output = {
        name: step.name,
        order: stepOrder,
        action: step.actionType,
        targetDescription: step.description,
      };
      console.log('[Neuron] ExtractScreenshot step saved:', output);
    } catch (error) {
      console.error(`Failed to save ExtractScreenshot step: ${error instanceof Error ? error.message : error}`);
    }
  };

  return (
    <StepInspectorLayout
      step={step}
      stepOrder={stepOrder}
      onDelete={onDelete}
      onSave={handleSave}
    >
      <InspectorField
        label='Step Name'
        required
        error={errors.name}
      >
        <input
          type='text'
          value={step.name}
          onChange={(e) => handleFieldChange('name', { name: e.target.value })}
          placeholder='e.g. Extract Screenshot'
          className={errors.name ? INSPECTOR_INPUT_ERROR_CLASS : INSPECTOR_INPUT_CLASS}
        />
      </InspectorField>

      <InspectorField
        label='Target Description'
        required
        error={errors.description}
      >
        <textarea
          rows={5}
          value={step.description}
          onChange={(e) => handleFieldChange('description', { description: e.target.value })}
          placeholder='Describe what to capture…'
          className={errors.description ? INSPECTOR_TEXTAREA_ERROR_CLASS : INSPECTOR_TEXTAREA_CLASS}
        />
      </InspectorField>

      <InspectorField label='Order'>
        <input
          type='number'
          value={stepOrder}
          readOnly
          disabled
          className={INSPECTOR_INPUT_DISABLED_CLASS}
        />
      </InspectorField>

      <InspectorField
        label='Content From'
        required
        error={errors.contentFrom}
      >
        <textarea
          rows={4}
          value={step.contentFrom ?? ''}
          onChange={(e) => handleFieldChange('contentFrom', { contentFrom: e.target.value })}
          placeholder='Starting content marker…'
          className={errors.contentFrom ? INSPECTOR_TEXTAREA_ERROR_CLASS : INSPECTOR_TEXTAREA_CLASS}
        />
      </InspectorField>

      <InspectorField
        label='Content Upto'
        required
        error={errors.contentUpto}
      >
        <textarea
          rows={4}
          value={step.contentUpto ?? ''}
          onChange={(e) => handleFieldChange('contentUpto', { contentUpto: e.target.value })}
          placeholder='Ending content marker…'
          className={errors.contentUpto ? INSPECTOR_TEXTAREA_ERROR_CLASS : INSPECTOR_TEXTAREA_CLASS}
        />
      </InspectorField>

      <InspectorField label='Wait Before Step (ms)'>
        <input
          type='number'
          min={1000}
          step={100}
          value={step.waitBeforeStep ?? 1000}
          onChange={(e) => onUpdate({ waitBeforeStep: Math.max(1000, Number(e.target.value)) })}
          placeholder='1000'
          className={INSPECTOR_INPUT_CLASS}
        />
      </InspectorField>
    </StepInspectorLayout>
  );
};
