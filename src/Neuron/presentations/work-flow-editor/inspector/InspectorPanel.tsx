import { useWorkflow } from '@/Neuron/context';
import { ClickInspector } from './ClickInspector';
import { EmptyInspector } from './EmptyInspector';
import { ExtractContentInspector } from './ExtractContentInspector';
import { ExtractPdfInspector } from './ExtractPdfInspector';
import { ExtractScreenshotInspector } from './ExtractScreenshotInspector';
import { FillTextInputInspector } from './FillTextInputInspector';
import { FlowInspector } from './FlowInspector';
import { OpenUrlInspector } from './OpenUrlInspector';
import { SelectDropdownInspector } from './SelectDropdownInspector';
import { SelectRadioInspector } from './SelectRadioInspector';

export const InspectorPanel = () => {
  const { steps, flows, selectedStepId, selectedFlowId, updateStep, deleteStep, findStepById, canvasOrder } =
    useWorkflow();

  // ── Flow selected ────────────────────────────────────────────
  if (selectedFlowId) {
    const flow = flows.find((f) => f.id === selectedFlowId);
    if (flow) {
      const flowColorIndex = canvasOrder
        .filter((item) => item.kind === 'flow')
        .findIndex((item) => item.id === selectedFlowId);
      return (
        <FlowInspector
          flow={flow}
          colorIndex={flowColorIndex >= 0 ? flowColorIndex : 0}
        />
      );
    }
  }

  // ── No step selected ─────────────────────────────────────────
  const step = selectedStepId ? findStepById(selectedStepId) : null;

  if (!step) {
    return (
      <div className='w-80 border-l border-gray-200 bg-white h-full shrink-0'>
        <EmptyInspector />
      </div>
    );
  }

  // Calculate order: position in its parent flow (or ungrouped steps)
  const ungroupedIdx = steps.findIndex((s) => s.id === step.id);
  const stepOrder =
    ungroupedIdx >= 0 ? ungroupedIdx + 1 : flows.flatMap((f) => f.steps).findIndex((s) => s.id === step.id) + 1;

  const onUpdate = (updates: Parameters<typeof updateStep>[1]) => updateStep(step.id, updates);
  const onDelete = () => deleteStep(step.id);

  // ── Route to action-specific inspector ──────────────────────
  switch (step.actionType) {
    case 'openUrl':
      return (
        <OpenUrlInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'extract':
      return (
        <ExtractContentInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'extractPDF':
      return (
        <ExtractPdfInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'extractScreenshot':
      return (
        <ExtractScreenshotInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'click':
      return (
        <ClickInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'selectDropdownOption':
      return (
        <SelectDropdownInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'fillTextInput':
      return (
        <FillTextInputInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    case 'selectRadioInput':
      return (
        <SelectRadioInspector
          step={step}
          stepOrder={stepOrder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
  }
};
