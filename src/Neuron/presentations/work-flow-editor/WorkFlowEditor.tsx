import { getTabId } from '@/lib';
import { Button, Loader } from '@/lib/ui/components';
import { getSseClientId } from '@/Neuron/api';
import { getCanvasItemSortableId, useWorkflow } from '@/Neuron/context';
import { useManageAutomation, useSSE, useWorkflowEditor } from '@/Neuron/hooks';
import type {
  ActionType,
  IAutomationExecutionVFSFlow,
  IPlayAutomationRequest,
  ISaveAutomationRequest,
  IUpdateAutomationStepRequest,
} from '@/Neuron/types';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Plus, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ActiveDragState } from './canvas/DragPreview';
import { DragPreview } from './canvas/DragPreview';
import WorkflowCanvas from './canvas/WorkflowCanvas';
import { WorkflowHeader } from './header';
import { InspectorPanel } from './inspector';
import { AutomationResultModal, CreateAutomationModal, type AutomationFormValues } from './modal';
import { ActionPanel } from './panel';

export const WorkflowEditor = () => {
  const { id } = useParams();
  const {
    selectedStepId,
    deleteStep,
    addFlow,
    addStepToFlow,
    canvasOrder,
    flows,
    reorderCanvasItems,
    hydrateFromApi,
    resetWorkflow,
    validateBeforeAddStep,
  } = useWorkflow();

  const { isAutomationDetailFetching, automationDetail, fetchAutomationDetail } = useManageAutomation();

  const {
    isAutomationCreating,
    createdAutomation,
    createAutomation,
    isAutomationExecuting,
    // automationExecutionResponse,
    playAutomation,
    isAutomationSaving,
    saveAutomation,
    isAutomationStepUpdating,
    updateAutomationStep,
  } = useWorkflowEditor();

  const [showModal, setShowModal] = useState(false);
  const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [automationExecutionResponse, setAutomationExecutionResponse] = useState<IAutomationExecutionVFSFlow | null>(
    null
  );
  const [isPlayPendingInQueue, setIsPlayPendingInQueue] = useState<boolean>(false);

  useSSE({
    onGuidelinePlayCompleteNotification: (playNotification) => {
      /** Handle concurrent play notifications */

      const sseClientId = getSseClientId();
      const tabId = getTabId();
      // Only process the notification if it matches the current guideline ID, SSE client ID, and tab ID
      const playResult = playNotification.result as unknown as IAutomationExecutionVFSFlow;
      if (
        playNotification.guidelineId === id &&
        playNotification.clientId === sseClientId &&
        playNotification.tabId === tabId
      ) {
        setAutomationExecutionResponse(playResult);
        setShowResultModal(true);
        setIsPlayPendingInQueue(false);
      }
    },

    onGuidelinePlayErrorNotification: (errorNotification) => {
      const sseClientId = getSseClientId();
      const tabId = getTabId();
      // Only process the notification if it matches the current guideline ID, SSE client ID, and tab ID
      if (
        errorNotification.guidelineId === id &&
        errorNotification.clientId === sseClientId &&
        errorNotification.tabId === tabId
      ) {
        toast.error(
          `Automation execution failed.
          Error: ${JSON.stringify(errorNotification.result)}`
        );
        setIsPlayPendingInQueue(false);
      }
    },
  });

  // Derive automation form values from whichever source is available:
  // edit mode (automationDetail) takes priority; create mode (createdAutomation) is fallback.
  const automationValues = useMemo<AutomationFormValues | null>(() => {
    if (automationDetail?.data) {
      const d = automationDetail.data;
      return {
        sourceCountryId: d.id,
        sourceCountry: d.source_country,
        destinationCountryId: d.id,
        destinationCountry: d.destination_country,
        visaTypeId: d.id,
        visaType: d.visa_type,
        subVisaTypeId: d.id,
        subvisaType: d.subvisa_type || '',
      };
    }
    if (createdAutomation?.success && createdAutomation.data) {
      const d = createdAutomation.data;
      return {
        sourceCountryId: d.id,
        sourceCountry: d.source_country,
        destinationCountryId: d.id,
        destinationCountry: d.destination_country,
        visaTypeId: d.id,
        visaType: d.visa_type,
        subVisaTypeId: d.id,
        subvisaType: d.subvisa_type || '',
      };
    }
    return null;
  }, [automationDetail, createdAutomation]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Fetch automation details if editing existing automation
  useEffect(() => {
    if (id) {
      fetchAutomationDetail(id);
    } else {
      resetWorkflow();
    }
  }, []);

  // Hydrate canvas from API response (edit mode side-effect — must stay in useEffect)
  useEffect(() => {
    if (automationDetail?.data?.automation_step) {
      hydrateFromApi(automationDetail.data.automation_step);
    }
  }, [automationDetail, hydrateFromApi]);

  // Keyboard Delete/Backspace to delete selected step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStepId) return;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      if (isInput) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteStep(selectedStepId);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedStepId, deleteStep]);

  // Drag Start: track what is being dragged
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current;

      // Auto-open modal if no automation configured yet
      if (!automationValues) {
        setShowModal(true);
        return;
      }
      if (data?.type === 'FLOW_ITEM') {
        setActiveDrag({ type: 'FLOW_ITEM' });
      } else if (data?.type === 'ACTION_ITEM') {
        setActiveDrag({ type: 'ACTION_ITEM', actionType: data.actionType, label: data.label });
      } else if (data?.kind === 'canvas-step') {
        setActiveDrag({ type: 'canvas-step' });
      } else if (data?.kind === 'canvas-flow') {
        setActiveDrag({ type: 'canvas-flow' });
      } else {
        setActiveDrag({ type: 'unknown' });
      }
    },
    [automationValues]
  );

  // Unified Drag End: handles ALL drag scenarios
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      const { active, over } = event;
      const data = active.data.current;

      if (!automationValues) return;

      // 1. New Flow dragged from palette
      if (data?.type === 'FLOW_ITEM') {
        addFlow();
        return;
      }

      // 2. Action dragged from palette
      if (data?.type === 'ACTION_ITEM' && data.actionType) {
        const overId = String(over?.id ?? '');

        // Only allow drop if it lands on a specific flow's drop zone
        if (overId.startsWith('flow-drop-')) {
          const flowId = overId.replace('flow-drop-', '');
          if (!validateBeforeAddStep(flowId)) return;
          addStepToFlow(flowId, data.actionType as ActionType);
        }
        // Dropped outside a flow → silently ignore (user must drop inside a flow)
        return;
      }

      //  3. Canvas item reorder (step or flow dragged on canvas)
      if (!over || active.id === over.id) return;

      const oldIndex = canvasOrder.findIndex((item) => getCanvasItemSortableId(item) === String(active.id));
      const newIndex = canvasOrder.findIndex((item) => getCanvasItemSortableId(item) === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCanvasItems(oldIndex, newIndex);
      }
    },
    [automationValues, addFlow, addStepToFlow, canvasOrder, reorderCanvasItems, validateBeforeAddStep]
  );

  const onCreateAutomationComplete = (status: string) => {
    if (status === 'success') {
      setShowModal(false);
    }
  };

  const handleModalDone = (payload: AutomationFormValues) => {
    createAutomation(payload, onCreateAutomationComplete);
  };

  const handleUpdate = () => {
    if (!automationValues) return;

    const flowsMap: Record<string, unknown> = {};
    flows.forEach((flow) => {
      const steps = flow.steps.map((step, idx) => {
        const base: Record<string, unknown> = {
          name: step.name,
          order: idx + 1,
          action: step.actionType,
          targetDescription: step.actionType !== 'extractPDF' ? step.description || '' : undefined,
          targetElement: step.targetElement || '',
          xpath: step.xpath || '',
          waitBeforeStep: step.waitBeforeStep || undefined,
        };

        if (step.actionType === 'openUrl' && step.url) base.url = step.url;
        if (step.actionType === 'extractPDF' && step.pdfUrl) base.pdfUrl = step.pdfUrl;

        if (step.actionType === 'extractScreenshot') {
          if (step.contentFrom) base.contentFrom = step.contentFrom;
          if (step.contentUpto) base.contentUpto = step.contentUpto;
        }

        if (
          (step.actionType === 'selectDropdownOption' ||
            step.actionType === 'fillTextInput' ||
            step.actionType === 'selectRadioInput') &&
          step.value
        ) {
          base.value = step.value;
        }

        if (
          (step.actionType === 'extract' ||
            step.actionType === 'extractPDF' ||
            step.actionType === 'extractScreenshot' ||
            step.actionType === 'selectRadioInput' ||
            step.actionType === 'selectDropdownOption' ||
            step.actionType === 'fillTextInput' ||
            step.actionType === 'click') &&
          step.snapshotBeforeStep !== undefined
        ) {
          base.snapshotBeforeStep = step.snapshotBeforeStep;
        }

        return Object.fromEntries(Object.entries(base).filter(([, v]) => v !== undefined));
      });

      flowsMap[flow.name] = {
        url: flow.url || '',
        waitBeforeStart: flow.waitBeforeStart || 8000,
        steps,
      };
    });

    const payload = {
      guidelineId: id || createdAutomation?.data?.id || '',
      automationStep: {
        useSession: false,
        flows: flowsMap,
      },
    };

    updateAutomationStep(payload as unknown as IUpdateAutomationStepRequest);
  };

  const onPlayAutomationComplete = (status: string) => {
    if (status === 'success') {
      // after successfull api hit,
      // queue triggered and the result comes via SSE notification
      // setShowResultModal(true);
      setIsPlayPendingInQueue(true);
    }
  };

  const onCompleteSaveWorkflow = (status: string) => {
    if (status === 'success') {
      setShowResultModal(false);
    }
  };

  const handleConfirmWorkflow = () => {
    if (!automationExecutionResponse) return;

    const guidelineId = id || createdAutomation?.data?.id || '';

    // Strip extractedContent and usage from each step, keep everything else
    const cleanedFlows: Record<string, unknown> = {};
    const responseFlows = automationExecutionResponse.flows || {};

    for (const [flowName, flowData] of Object.entries(responseFlows)) {
      const flow = flowData as IAutomationExecutionVFSFlow;
      const cleanedSteps = (flow.steps || []).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ extractedContent: _extractedContent, usage: _usage, ...rest }) => rest
      );

      cleanedFlows[flowName] = {
        url: flow.url || '',
        waitBeforeStart: flow.waitBeforeStart || 8000,
        steps: cleanedSteps,
      };
    }

    const savePayload = {
      guidelineId,
      automationConfig: {
        useSession: false,
        flows: cleanedFlows,
      },
    };

    saveAutomation(savePayload as unknown as ISaveAutomationRequest, onCompleteSaveWorkflow);
  };

  const handleRun = () => {
    if (!automationValues) return;

    const flowsMap: Record<string, unknown> = {};
    flows.forEach((flow) => {
      const steps = flow.steps.map((step, idx) => {
        const base: Record<string, unknown> = {
          name: step.name,
          order: idx + 1,
          action: step.actionType,
          targetDescription: step.actionType !== 'extractPDF' ? step.description || '' : undefined,
          targetElement: step.targetElement || '',
          waitBeforeStep: step.waitBeforeStep || undefined,
        };

        if (step.actionType === 'openUrl' && step.url) base.url = step.url;
        if (step.actionType === 'extractPDF' && step.pdfUrl) base.pdfUrl = step.pdfUrl;

        if (step.actionType === 'extractScreenshot') {
          if (step.contentFrom) base.contentFrom = step.contentFrom;
          if (step.contentUpto) base.contentUpto = step.contentUpto;
        }

        if (
          (step.actionType === 'selectDropdownOption' ||
            step.actionType === 'fillTextInput' ||
            step.actionType === 'selectRadioInput') &&
          step.value
        ) {
          base.value = step.value;
        }

        if (
          (step.actionType === 'extract' ||
            step.actionType === 'extractPDF' ||
            step.actionType === 'extractScreenshot' ||
            step.actionType === 'selectRadioInput' ||
            step.actionType === 'selectDropdownOption' ||
            step.actionType === 'fillTextInput' ||
            step.actionType === 'click') &&
          step.snapshotBeforeStep !== undefined
        ) {
          base.snapshotBeforeStep = step.snapshotBeforeStep;
        }

        return Object.fromEntries(Object.entries(base).filter(([, v]) => v !== undefined));
      });

      flowsMap[flow.name] = {
        url: flow.url || '',
        waitBeforeStart: flow.waitBeforeStart || 8000,
        steps,
      };
    });

    const payload = {
      tabId: getTabId(),
      clientId: getSseClientId(),
      guidelineId: id || createdAutomation?.data?.id || '',
      useSession: false,
      flows: flowsMap,
    };

    playAutomation(payload as unknown as IPlayAutomationRequest, onPlayAutomationComplete);
  };

  return (
    <div className='flex flex-col h-full relative'>
      {isAutomationDetailFetching && (
        <div className='absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-[2px]'>
          <Loader overlay={false} />
        </div>
      )}

      {automationValues ? (
        <WorkflowHeader
          formValues={automationValues}
          onUpdate={handleUpdate}
          onRun={handleRun}
          isAutomationExecuting={isAutomationExecuting || isPlayPendingInQueue}
          isUpdating={isAutomationStepUpdating}
        />
      ) : (
        <header className='h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-3 shrink-0'>
          <div className='flex items-center gap-2 flex-1'>
            <Zap
              size={15}
              className='text-gray-400'
            />
            <span className='text-sm font-medium text-gray-400'>Automation</span>
          </div>
          <Button
            type='button'
            onClick={() => setShowModal(true)}
            leftIcon={Plus}
            iconSize={14}
            className='h-8 px-4 rounded-lg text-sm'
          >
            Create Workflow
          </Button>
        </header>
      )}

      {/* Outer DndContext with drag handlers and sensors */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='flex flex-1 overflow-hidden'>
          <ActionPanel />
          <WorkflowCanvas />
          <InspectorPanel />
        </div>

        {/* Drag overlay — the visual ghost following the cursor */}
        <DragOverlay dropAnimation={null}>
          <DragPreview activeDrag={activeDrag} />
        </DragOverlay>
      </DndContext>

      {showResultModal && automationExecutionResponse && (
        <AutomationResultModal
          isSaving={isAutomationSaving}
          response={automationExecutionResponse}
          onClose={() => setShowResultModal(false)}
          onConfirmWorkflow={handleConfirmWorkflow}
        />
      )}

      {showModal && (
        <CreateAutomationModal
          isAutomationCreating={isAutomationCreating}
          onDone={handleModalDone}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
