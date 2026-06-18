import { useWorkflow } from '@/Neuron/context';
import type { StepInspectorProps } from '../../../types/inspector.types';
import {
  INSPECTOR_INPUT_CLASS,
  INSPECTOR_INPUT_DISABLED_CLASS,
  INSPECTOR_INPUT_ERROR_CLASS,
  INSPECTOR_TEXTAREA_CLASS,
  INSPECTOR_TEXTAREA_ERROR_CLASS,
  TARGET_ELEMENT_OPTIONS,
} from '../../../types/inspector.types';
import { InspectorField } from './InspectorField';
import { InspectorSelect } from './InspectorSelect';
import { StepInspectorLayout } from './StepInspectorLayout';
import { isValid, validateStep } from './validation';

export const FillTextInputInspector = ({ step, stepOrder, onUpdate, onDelete }: StepInspectorProps) => {
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
        ...(step.targetElement ? { targetElement: step.targetElement } : {}),
        ...(step.value ? { value: step.value } : {}),
        ...(step.snapshotBeforeStep !== undefined ? { snapshotBeforeStep: step.snapshotBeforeStep } : {}),
      };
      console.log('[Neuron] Fill Text Input step saved:', output);
    } catch (error) {
      console.error(`Failed to save Fill Text Input step: ${error instanceof Error ? error.message : error}`);
    }
  };

  const hasTargetElement = !!(step.targetElement && step.targetElement.trim());

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
          placeholder='e.g. Enter Email Address'
          className={errors.name ? INSPECTOR_INPUT_ERROR_CLASS : INSPECTOR_INPUT_CLASS}
        />
      </InspectorField>

      <InspectorField
        label='Target Description'
        required
        error={errors.description}
      >
        <textarea
          rows={2}
          value={step.description}
          onChange={(e) => handleFieldChange('description', { description: e.target.value })}
          placeholder='Describe the text input to fill…'
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
        label='Target Element'
        required
        error={errors.targetElement}
      >
        <InspectorSelect
          value={step.targetElement ?? ''}
          onChange={(val) => handleFieldChange('targetElement', { targetElement: val })}
          options={TARGET_ELEMENT_OPTIONS}
          placeholder='Select element type…'
        />
      </InspectorField>

      <InspectorField
        label='Value'
        required={hasTargetElement}
        error={errors.value}
      >
        <input
          type='text'
          value={step.value ?? ''}
          onChange={(e) => handleFieldChange('value', { value: e.target.value })}
          placeholder='e.g. Text to enter'
          className={errors.value ? INSPECTOR_INPUT_ERROR_CLASS : INSPECTOR_INPUT_CLASS}
        />
      </InspectorField>

      <InspectorField label='Wait Before Start (ms)'>
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

      <div className='flex items-start gap-3 py-2'>
        <div className='flex items-center h-5 mt-0.5'>
          <input
            id={`snapshot-${step.id}`}
            type='checkbox'
            checked={step.snapshotBeforeStep ?? false}
            onChange={(e) => onUpdate({ snapshotBeforeStep: e.target.checked })}
            className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200 cursor-pointer'
          />
        </div>
        <label
          htmlFor={`snapshot-${step.id}`}
          className='flex-1 cursor-pointer'
        >
          <span className='text-xs font-medium text-gray-700 block'>Snapshot Before Step</span>
          <span className='text-[11px] text-gray-400'>Capture a screenshot before this step runs.</span>
        </label>
      </div>
    </StepInspectorLayout>
  );
};
