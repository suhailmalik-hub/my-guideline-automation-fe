import { getTabId } from '@/lib';
import { getSseClientId } from '@/Neuron/api';
import { useManageAutomation, useSSE, useWorkflowEditor } from '@/Neuron/hooks';
import type { IGuidelineAutomation, IPlayAutomationResponse } from '@/Neuron/types';
import { DEFAULT_TABLE_LIMIT, DEFAULT_TABLE_PAGE, type IPagination } from '@/Neuron/types/common.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from './Header';
import { DeleteWorkflowModal, /* GuidelineDetailModal, */ GuideLineResultsModal } from './modal';
import { List } from './workflow-list/List';
import type { WorkflowTab } from './WorkflowTabs';
import { WorkflowTabs } from './WorkflowTabs';

interface IManageWorkFlowList {}

export const ManageWorkFlowList: React.FC<IManageWorkFlowList> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { tab?: WorkflowTab } | null;
  const initialTab: WorkflowTab = locationState?.tab ?? 'PUBLISHED';
  const {
    isAutoamtionListFetching,
    automationList,
    autoamtionListPagination,
    fetchAutomationList,
    updateAutomationListRecord,
    isAutomationDeleting,
    deleteAutomation,
    // isGuidelineDetailFetching,
    // guidelineDetail,
    // guidelineDetailFull,
    // fetchGuidelineDetail,
  } = useManageAutomation();
  const [isManualRunPendingInQueue, setIsManualRunPendingInQueue] = useState<boolean>(false);
  const [automationRunResponse, setAutomationRunResponse] = useState<IPlayAutomationResponse | null>(null);
  const { runAutomation } = useWorkflowEditor();
  const manuallyTriggeredIdRef = useRef<string | null>(null);
  const [isManualRunning, setIsManualRunning] = useState<boolean>(false);
  const [deleteModalFlag, setDeleteModalFlag] = useState<boolean>(false);
  const [selectedAutomation, setSelectedAutomation] = useState<IGuidelineAutomation | null>(null);
  const [showRunResultModal, setShowRunResultModal] = useState<boolean>(false);
  const [runResultGuidelineId, setRunResultGuidelineId] = useState<string | null>(null);
  // const [showGuidelineDetailModal, setShowGuidelineDetailModal] = useState<boolean>(false);
  // const [viewingGuidelineId, setViewingGuidelineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkflowTab>(initialTab);
  const [prevLocationState, setPrevLocationState] = useState(locationState);
  if (locationState !== prevLocationState) {
    setPrevLocationState(locationState);
    if (locationState?.tab && locationState.tab !== activeTab) {
      setActiveTab(locationState.tab);
    }
  }
  const fetchGuidelineAutomationList = useCallback(
    (page: number = DEFAULT_TABLE_PAGE, limit: number = DEFAULT_TABLE_LIMIT, status: string = activeTab) => {
      const mapToRequest = {
        page: page,
        limit: limit,
        status: status,
      };
      fetchAutomationList(mapToRequest);
    },
    [activeTab]
  );

  useEffect(() => {
    fetchGuidelineAutomationList(DEFAULT_TABLE_PAGE, DEFAULT_TABLE_LIMIT, activeTab);
  }, [activeTab]);

  useSSE({
    onAutomationStarted:
      activeTab === 'PUBLISHED'
        ? ({ guidelineId }) => updateAutomationListRecord(guidelineId, { is_running: true })
        : undefined,
    onAutomationCompleted:
      activeTab === 'PUBLISHED'
        ? ({ guidelineId }) => {
            updateAutomationListRecord(guidelineId, { is_running: false });
          }
        : undefined,
    onAutomationRunError:
      activeTab === 'PUBLISHED'
        ? () => {
            fetchGuidelineAutomationList();
          }
        : undefined,

    onManualGuidelineRunStart:
      activeTab === 'PUBLISHED'
        ? ({ guidelineId }) => {
            updateAutomationListRecord(guidelineId, { is_running: true });
          }
        : undefined,

    onManualGuidelineRunComplete:
      activeTab === 'PUBLISHED'
        ? (runNotification) => {
            const sseClientId = getSseClientId();
            const browserTabId = getTabId();
            const { clientId, guidelineId, tabId, result } = runNotification;
            updateAutomationListRecord(guidelineId, { is_running: false });
            if (sseClientId === clientId && browserTabId === tabId && manuallyTriggeredIdRef.current === guidelineId) {
              setRunResultGuidelineId(runNotification?.guidelineId);
              setShowRunResultModal(true);
              setIsManualRunning(false);
              setIsManualRunPendingInQueue(false);
              manuallyTriggeredIdRef.current = null;
              setAutomationRunResponse(result as unknown as IPlayAutomationResponse);
            }
          }
        : undefined,

    onManualGuidelineRunError:
      activeTab === 'PUBLISHED'
        ? (runErrorNotification) => {
            const sseClientId = getSseClientId();
            const browserTabId = getTabId();
            const { clientId, guidelineId, tabId, result } = runErrorNotification;
            if (sseClientId === clientId && browserTabId === tabId && manuallyTriggeredIdRef.current === guidelineId) {
              setRunResultGuidelineId(null);
              setIsManualRunning(false);
              setIsManualRunPendingInQueue(false);
              manuallyTriggeredIdRef.current = null;
              toast.error(
                `Workflow execution failed.
          Error: ${JSON.stringify(result)}`
              );
            }
          }
        : undefined,
  });

  const onPageChange = useCallback(
    (pageNumber: number, limit: number) => {
      fetchGuidelineAutomationList(pageNumber, limit);
    },
    [fetchGuidelineAutomationList]
  );

  const handleDelete = (automation: IGuidelineAutomation) => {
    setSelectedAutomation(automation);
    setDeleteModalFlag(true);
  };

  const onConfirmDeleteComplete = (status: string) => {
    if (status === 'success') {
      fetchGuidelineAutomationList();
    }
    setDeleteModalFlag(false);
    setSelectedAutomation(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAutomation) {
      deleteAutomation(selectedAutomation.id, onConfirmDeleteComplete);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalFlag(false);
    setSelectedAutomation(null);
  };

  const handleEditAutomation = (automationId: string) => {
    navigate(`/workflow/${automationId}/edit`);
    console.log('Edit automation with ID:', automationId);
  };

  const handleRunAutomation = (automationId: string) => {
    manuallyTriggeredIdRef.current = automationId;
    setIsManualRunning(true);
    runAutomation(
      {
        guidelineId: automationId,
        tabId: getTabId(),
        clientId: getSseClientId() as string,
      },
      () => {
        setIsManualRunPendingInQueue(true);
        // the response is handled via SSE,
        // so no need to do anything here on success
      }
    );
  };

  const handleViewGuideline = (automationId: string) => {
    navigate(`/workflow/${automationId}/review`);
    // setViewingGuidelineId(automationId);
    // setShowGuidelineDetailModal(true);
    // fetchGuidelineDetail(automationId);
  };

  return (
    <div className='flex flex-col h-full bg-gray-50 relative'>
      <Header isLoading={isManualRunning || isManualRunPendingInQueue} />
      <div className='flex-1 overflow-auto p-6'>
        <div className='bg-white border border-gray-200 shadow-sm'>
          <WorkflowTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <List
            isLoading={isAutoamtionListFetching}
            automationList={automationList ?? []}
            handleDeleteAutomation={handleDelete}
            handleEditAutomation={handleEditAutomation}
            handleRunAutomation={handleRunAutomation}
            handleViewGuideline={handleViewGuideline}
            isAnyWorkflowRunning={isManualRunning || isManualRunPendingInQueue}
            paginationProps={{
              paginationData: autoamtionListPagination as IPagination,
              handlePagination: onPageChange,
            }}
          />
        </div>
      </div>

      {showRunResultModal && automationRunResponse && (
        <GuideLineResultsModal
          response={automationRunResponse}
          guidelineId={runResultGuidelineId}
          onClose={() => setShowRunResultModal(false)}
        />
      )}

      {deleteModalFlag && selectedAutomation && (
        <DeleteWorkflowModal
          workflowName={`${selectedAutomation.source_country} → ${selectedAutomation.destination_country} · ${selectedAutomation.visa_type}`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isAutomationDeleting}
        />
      )}

      {/* {showGuidelineDetailModal && guidelineDetailFull?.is_confirmed && (
        <GuidelineDetailModal
          isLoading={isGuidelineDetailFetching}
          guidelineDetail={guidelineDetail}
          onClose={() => setShowGuidelineDetailModal(false)}
        />
      )}

      {showGuidelineDetailModal &&
        !isGuidelineDetailFetching &&
        guidelineDetailFull &&
        !guidelineDetailFull.is_confirmed && (
          <GuideLineResultsModal
            response={guidelineDetailFull}
            guidelineId={viewingGuidelineId}
            onClose={() => setShowGuidelineDetailModal(false)}
          />
        )} */}
    </div>
  );
};
