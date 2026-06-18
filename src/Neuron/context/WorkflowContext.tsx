import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import {
  isValid,
  validateFlow as runFlowValidation,
  validateStep as runStepValidation,
} from '../presentations/work-flow-editor/inspector/validation';
import type { AutomationStepConfig } from '../types';
import type { ValidationErrors, WorkflowContextValue } from '../types/workflow.context.types';
import type { ActionType, CanvasItemRef, WorkflowFlow, WorkflowStep } from '../types/workflow.editor.types';
import { getCanvasItemSortableId, getCategoryFromActionType, getDefaultStepName } from '../types/workflow.editor.types';

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

//  Helper to build a new WorkflowStep
function buildStep(actionType: ActionType): WorkflowStep {
  return {
    id: crypto.randomUUID(),
    actionType,
    category: getCategoryFromActionType(actionType),
    name: getDefaultStepName(actionType),
    description: '',
    createdAt: new Date().toISOString(),
  };
}

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [flows, setFlows] = useState<WorkflowFlow[]>([]);
  const [canvasOrder, setCanvasOrder] = useState<CanvasItemRef[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationErrors>>({});

  // Validation helpers
  const setValidationErrorsFor = useCallback((id: string, errors: ValidationErrors) => {
    setValidationErrors((prev) => ({ ...prev, [id]: errors }));
  }, []);

  const clearValidationErrors = useCallback((id: string) => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearFieldError = useCallback((id: string, field: string) => {
    setValidationErrors((prev) => {
      const entityErrors = prev[id];
      if (!entityErrors || !entityErrors[field]) return prev;
      const next = { ...entityErrors };
      delete next[field];
      if (Object.keys(next).length === 0) {
        const all = { ...prev };
        delete all[id];
        return all;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  // Ungrouped step ops
  const addStep = useCallback((actionType: ActionType, atCanvasIndex?: number) => {
    const step = buildStep(actionType);
    setSteps((prev) => [...prev, step]);
    setCanvasOrder((prev) => {
      const ref: CanvasItemRef = { kind: 'step', id: step.id };
      if (atCanvasIndex !== undefined && atCanvasIndex >= 0 && atCanvasIndex <= prev.length) {
        const next = [...prev];
        next.splice(atCanvasIndex, 0, ref);
        return next;
      }
      return [...prev, ref];
    });
  }, []);

  const updateStep = useCallback((id: string, updates: Partial<WorkflowStep>) => {
    // Search ungrouped steps
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    // Search inside flows
    setFlows((prev) =>
      prev.map((f) => ({
        ...f,
        steps: f.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }))
    );
  }, []);

  const deleteStep = useCallback(
    (id: string) => {
      setSteps((prev) => prev.filter((s) => s.id !== id));
      setCanvasOrder((prev) => prev.filter((item) => !(item.kind === 'step' && item.id === id)));
      setFlows((prev) => prev.map((f) => ({ ...f, steps: f.steps.filter((s) => s.id !== id) })));
      if (selectedStepId === id) setSelectedStepId(null);
    },
    [selectedStepId]
  );

  const selectStep = useCallback((id: string | null) => {
    setSelectedStepId(id);
    if (id) setSelectedFlowId(null); // deselect flow when step is selected
  }, []);

  const selectFlow = useCallback((id: string | null) => {
    setSelectedFlowId(id);
    if (id) setSelectedStepId(null); // deselect step when flow is selected
  }, []);

  //  Canvas ordering
  const reorderCanvasItems = useCallback((oldIndex: number, newIndex: number) => {
    setCanvasOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  }, []);

  //  Flow container ops
  const addFlow = useCallback((name?: string) => {
    setFlows((prev) => {
      const flowNumber = prev.length + 1;
      const flow: WorkflowFlow = {
        id: crypto.randomUUID(),
        name: name ?? `FLOW_${flowNumber}`,
        steps: [],
        collapsed: false,
        createdAt: new Date().toISOString(),
      };
      setCanvasOrder((co) => [...co, { kind: 'flow', id: flow.id }]);
      return [...prev, flow];
    });
  }, []);

  const updateFlow = useCallback(
    (id: string, updates: Partial<Pick<WorkflowFlow, 'name' | 'collapsed' | 'url' | 'waitBeforeStart'>>) => {
      setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    },
    []
  );

  const deleteFlow = useCallback((id: string) => {
    setFlows((prev) => prev.filter((f) => f.id !== id));
    setCanvasOrder((prev) => prev.filter((item) => !(item.kind === 'flow' && item.id === id)));
  }, []);

  const toggleFlowCollapsed = useCallback((id: string) => {
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, collapsed: !f.collapsed } : f)));
  }, []);

  // Flow step ops
  const addStepToFlow = useCallback((flowId: string, actionType: ActionType, atIndex?: number) => {
    const step = buildStep(actionType);
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id !== flowId) return f;
        const newSteps = [...f.steps];
        if (atIndex !== undefined && atIndex >= 0 && atIndex <= newSteps.length) {
          newSteps.splice(atIndex, 0, step);
        } else {
          newSteps.push(step);
        }
        return { ...f, steps: newSteps };
      })
    );
  }, []);

  const updateStepInFlow = useCallback((flowId: string, stepId: string, updates: Partial<WorkflowStep>) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id !== flowId ? f : { ...f, steps: f.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)) }
      )
    );
  }, []);

  const deleteStepFromFlow = useCallback(
    (flowId: string, stepId: string) => {
      setFlows((prev) =>
        prev.map((f) => (f.id !== flowId ? f : { ...f, steps: f.steps.filter((s) => s.id !== stepId) }))
      );
      if (selectedStepId === stepId) setSelectedStepId(null);
    },
    [selectedStepId]
  );

  const reorderStepsInFlow = useCallback((flowId: string, oldIndex: number, newIndex: number) => {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id !== flowId) return f;
        const next = [...f.steps];
        const [removed] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, removed);
        return { ...f, steps: next };
      })
    );
  }, []);

  const duplicateStepInFlow = useCallback((flowId: string, stepId: string) => {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id !== flowId) return f;
        const idx = f.steps.findIndex((s) => s.id === stepId);
        if (idx === -1) return f;
        const copy: WorkflowStep = {
          ...f.steps[idx],
          id: crypto.randomUUID(),
          name: `${f.steps[idx].name} (copy)`,
          createdAt: new Date().toISOString(),
        };
        const next = [...f.steps];
        next.splice(idx + 1, 0, copy);
        return { ...f, steps: next };
      })
    );
  }, []);

  //  Utility
  // Internal helper used by both findStepById and validateBeforeAddStep
  const findStepByIdInternal = (id: string): WorkflowStep | null => {
    const ungrouped = steps.find((s) => s.id === id);
    if (ungrouped) return ungrouped;
    for (const f of flows) {
      const found = f.steps.find((s) => s.id === id);
      if (found) return found;
    }
    return null;
  };

  // Validate before adding a step to a flow
  // Returns true if validation passes, false if blocked
  const validateBeforeAddStep = useCallback((flowId: string): boolean => {
    let blocked = false;

    // Read from the latest flows state to avoid stale closure
    setFlows((currentFlows) => {
      const flow = currentFlows.find((f) => f.id === flowId);
      if (!flow) return currentFlows;

      // 1. Validate the target flow has required fields (Starting URL)
      const flowErrors = runFlowValidation(flow);
      if (!isValid(flowErrors)) {
        setValidationErrors((prev) => ({ ...prev, [flow.id]: flowErrors }));
        setSelectedFlowId(flow.id);
        setSelectedStepId(null);
        blocked = true;
        return currentFlows;
      }

      // 2. Validate ALL existing steps in this flow have their required fields
      for (const step of flow.steps) {
        const stepErrors = runStepValidation(step);
        if (!isValid(stepErrors)) {
          setValidationErrors((prev) => ({ ...prev, [step.id]: stepErrors }));
          setSelectedStepId(step.id);
          setSelectedFlowId(null);
          blocked = true;
          return currentFlows;
        }
      }

      return currentFlows; // no mutation
    });

    return !blocked;
  }, []);

  const findStepById = useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    (id: string): WorkflowStep | null => {
      return findStepByIdInternal(id);
    },
    [steps, flows]
  );

  const findFlowForStep = useCallback(
    (stepId: string): WorkflowFlow | null => flows.find((f) => f.steps.some((s) => s.id === stepId)) ?? null,
    [flows]
  );

  //  Hydrate from API response (edit mode)
  const hydrateFromApi = useCallback((automationStep: AutomationStepConfig) => {
    const hydratedFlows: WorkflowFlow[] = [];
    const hydratedCanvasOrder: CanvasItemRef[] = [];

    const flowEntries = Object.entries(automationStep.flows);
    for (const [flowName, flowData] of flowEntries) {
      if (!flowData) continue;

      const flowId = crypto.randomUUID();
      const flowSteps: WorkflowStep[] = (flowData.steps || [])
        .sort((a, b) => a.order - b.order)
        .map((apiStep) => {
          const actionType = apiStep.action as ActionType;
          return {
            id: crypto.randomUUID(),
            actionType,
            category: getCategoryFromActionType(actionType),
            name: apiStep.name || getDefaultStepName(actionType),
            description: apiStep.targetDescription || '',
            targetElement: apiStep.targetElement || undefined,
            snapshotBeforeStep: apiStep.snapshotBeforeStep,
            url: apiStep.action === 'openUrl' ? apiStep.url : undefined,
            pdfUrl: apiStep.action === 'extractPDF' ? apiStep.pdfUrl : undefined,
            value:
              apiStep.action === 'selectDropdownOption' ||
              apiStep.action === 'fillTextInput' ||
              apiStep.action === 'selectRadioInput'
                ? apiStep.value
                : undefined,
            contentFrom: apiStep.action === 'extractScreenshot' ? apiStep.contentFrom : undefined,
            contentUpto: apiStep.action === 'extractScreenshot' ? apiStep.contentUpto : undefined,
            xpath: apiStep.xpath || undefined,
            waitBeforeStep: apiStep.waitBeforeStep || undefined,
            createdAt: new Date().toISOString(),
          };
        });

      hydratedFlows.push({
        id: flowId,
        name: flowName,
        url: flowData.url || undefined,
        waitBeforeStart: flowData.waitBeforeStart,
        steps: flowSteps,
        collapsed: false,
        createdAt: new Date().toISOString(),
      });

      hydratedCanvasOrder.push({ kind: 'flow', id: flowId });
    }

    setFlows(hydratedFlows);
    setCanvasOrder(hydratedCanvasOrder);
    setSteps([]);
    setSelectedStepId(null);
    setSelectedFlowId(null);
  }, []);

  const resetWorkflow = useCallback(() => {
    setWorkflowName('Untitled Workflow');
    setSteps([]);
    setFlows([]);
    setCanvasOrder([]);
    setSelectedStepId(null);
    setSelectedFlowId(null);
    setValidationErrors({});
  }, []);

  const value: WorkflowContextValue = {
    workflowName,
    setWorkflowName,
    steps,
    flows,
    canvasOrder,
    selectedStepId,
    selectedFlowId,
    addStep,
    updateStep,
    deleteStep,
    selectStep,
    selectFlow,
    reorderCanvasItems,
    addFlow,
    updateFlow,
    deleteFlow,
    toggleFlowCollapsed,
    addStepToFlow,
    updateStepInFlow,
    deleteStepFromFlow,
    reorderStepsInFlow,
    duplicateStepInFlow,
    findStepById,
    findFlowForStep,
    hydrateFromApi,
    resetWorkflow,
    validationErrors,
    setValidationErrorsFor,
    clearValidationErrors,
    clearFieldError,
    validateBeforeAddStep,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

export function useWorkflow(): WorkflowContextValue {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflow must be used within a WorkflowProvider');
  return context;
}

export { getCanvasItemSortableId };
