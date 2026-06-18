import type { AutomationStepConfig } from './work-flow-list.types';
import type { ActionType, CanvasItemRef, WorkflowFlow, WorkflowStep } from './workflow.editor.types';

/** Map of field name → error message for a single entity (flow or step) */
export type ValidationErrors = Record<string, string>;

export interface WorkflowContextValue {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  // Ungrouped steps (outside any flow)
  steps: WorkflowStep[];
  // Flows — each has their own steps[]
  flows: WorkflowFlow[];
  // Ordered list of what is on the canvas (steps + flows interleaved)
  canvasOrder: CanvasItemRef[];
  selectedStepId: string | null;
  selectedFlowId: string | null;
  selectStep: (id: string | null) => void;
  selectFlow: (id: string | null) => void;
  reorderCanvasItems: (oldIndex: number, newIndex: number) => void;
  addStep: (actionType: ActionType, atCanvasIndex?: number) => void;
  updateStep: (id: string, updates: Partial<WorkflowStep>) => void;
  deleteStep: (id: string) => void;
  addFlow: (name?: string) => void;
  updateFlow: (
    id: string,
    updates: Partial<Pick<WorkflowFlow, 'name' | 'collapsed' | 'url' | 'waitBeforeStart'>>
  ) => void;
  deleteFlow: (id: string) => void;
  toggleFlowCollapsed: (id: string) => void;
  addStepToFlow: (flowId: string, actionType: ActionType, atIndex?: number) => void;
  updateStepInFlow: (flowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  deleteStepFromFlow: (flowId: string, stepId: string) => void;
  reorderStepsInFlow: (flowId: string, oldIndex: number, newIndex: number) => void;
  duplicateStepInFlow: (flowId: string, stepId: string) => void;
  findStepById: (id: string) => WorkflowStep | null;
  findFlowForStep: (stepId: string) => WorkflowFlow | null;
  hydrateFromApi: (automationStep: AutomationStepConfig) => void;
  resetWorkflow: () => void;
  // Validation
  validationErrors: Record<string, ValidationErrors>;
  setValidationErrorsFor: (id: string, errors: ValidationErrors) => void;
  clearValidationErrors: (id: string) => void;
  clearFieldError: (id: string, field: string) => void;
  validateBeforeAddStep: (flowId: string) => boolean;
}
