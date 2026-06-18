import type { TableColumn } from '@/lib/ui/components';
import { Table } from '@/lib/ui/components';
import { type IGuidelineAutomation } from '@/Neuron/types';
import type { IPagination, IPaginationProps } from '@/Neuron/types/common.types';
import { Edit2, Eye, Loader2, MoreVertical, Play, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  PUBLISHED: {
    label: 'Published',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
    dot: 'bg-gray-400',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  VERIFIED: {
    label: 'Verified',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  UNRUN: {
    label: 'Unrun',
    className: 'bg-gray-50 text-gray-700 border border-gray-200',
    dot: 'bg-gray-500',
  },
  IN_REVIEW: {
    label: 'In Review',
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
  },
  RUN_ERROR: {
    label: 'Run Error',
    className: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
};

const DEFAULT_STATUS_CONFIG = {
  label: 'Unknown',
  className: 'bg-gray-100 text-gray-600 border border-gray-200',
  dot: 'bg-gray-400',
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface ActionsMenuProps {
  row: IGuidelineAutomation;
  onEdit: (automationId: string) => void;
  onRun: (automationId: string) => void;
  onDelete: (automation: IGuidelineAutomation) => void;
  onViewGuideline: (automationId: string) => void;
  isAnyWorkflowRunning: boolean;
}

const ActionsMenu = ({ row, onEdit, onRun, onDelete, onViewGuideline, isAnyWorkflowRunning }: ActionsMenuProps) => {
  const isThisRunning = row.is_running;
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (isAnyWorkflowRunning) {
      toast.warn('Currently a workflow is running. Please wait until it finishes to perform other actions.');
      return;
    }
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (isThisRunning) {
    return (
      <div className='flex items-center justify-center gap-2'>
        <Loader2
          size={16}
          className='animate-spin text-emerald-500'
        />
        <span className='text-xs text-gray-400'>Running…</span>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center'>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        disabled={isThisRunning}
        className='p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        aria-label='Actions'
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className='z-[9999] min-w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-hidden'
          >
            {row.status === 'PUBLISHED' && (
              <>
                <button
                  onClick={() => {
                    onRun(row.id);
                    setOpen(false);
                  }}
                  className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors'
                >
                  <Play size={14} />
                  Run
                </button>
                <button
                  onClick={() => {
                    onViewGuideline(row.id);
                    setOpen(false);
                  }}
                  className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors'
                >
                  <Eye size={14} />
                  View Guideline
                </button>
              </>
            )}
            <button
              onClick={() => {
                onEdit(row.id);
                setOpen(false);
              }}
              className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors'
            >
              <Edit2 size={14} />
              Edit
            </button>
            <div className='my-1 border-t border-gray-100' />
            <button
              onClick={() => {
                onDelete(row);
                setOpen(false);
              }}
              className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors'
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

// Column definition

const createColumns = (
  onEdit: (automationId: string) => void,
  onRun: (automationId: string) => void,
  onDelete: (automation: IGuidelineAutomation) => void,
  onViewGuideline: (automationId: string) => void,
  isAnyWorkflowRunning: boolean
): TableColumn<IGuidelineAutomation>[] => [
  {
    key: 'source_country',
    label: 'From',
    sortable: true,
    className: 'min-w-[130px]',
    render: (row: IGuidelineAutomation) => (
      <span className='text-sm font-medium text-gray-800'>{row.source_country}</span>
    ),
  },
  {
    key: 'destination_country',
    label: 'To',
    sortable: true,
    className: 'min-w-[130px]',
    render: (row: IGuidelineAutomation) => (
      <span className='text-sm font-medium text-gray-800'>{row.destination_country}</span>
    ),
  },
  {
    key: 'visa_type',
    label: 'Visa Type',
    sortable: true,
    className: 'min-w-[120px]',
    render: (row: IGuidelineAutomation) => <span className='text-sm text-gray-700'>{row.visa_type}</span>,
  },
  {
    key: 'subvisa_type',
    label: 'Sub Visa Type',
    sortable: false,
    className: 'min-w-[140px]',
    render: (row: IGuidelineAutomation) =>
      row.subvisa_type ? (
        <span className='text-sm text-gray-600'>{row.subvisa_type}</span>
      ) : (
        <span className='text-xs text-gray-300'>—</span>
      ),
  },
  {
    key: 'status',
    label: 'Workflow',
    sortable: false,
    className: 'min-w-[130px]',
    render: (row: IGuidelineAutomation) => <StatusBadge status={row.status} />,
  },
  {
    key: 'guideline_result',
    label: 'Guideline State',
    sortable: false,
    className: 'min-w-[130px]',
    render: (row: IGuidelineAutomation) => <StatusBadge status={row?.guideline_result?.guideline_state} />,
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    className: 'w-32 text-center',
    render: (row: IGuidelineAutomation) => (
      <ActionsMenu
        row={row}
        onEdit={onEdit}
        onRun={onRun}
        onDelete={onDelete}
        onViewGuideline={onViewGuideline}
        isAnyWorkflowRunning={isAnyWorkflowRunning}
      />
    ),
  },
];

// Main table component

interface IList {
  isLoading: boolean;
  automationList: IGuidelineAutomation[];
  handleDeleteAutomation: (automation: IGuidelineAutomation) => void;
  handleEditAutomation: (automationId: string) => void;
  handleRunAutomation: (automationId: string) => void;
  handleViewGuideline: (automationId: string) => void;
  isAnyWorkflowRunning: boolean;
  paginationProps: IPaginationProps;
}

export const List = React.memo(
  ({
    isLoading,
    automationList,
    handleDeleteAutomation,
    handleEditAutomation,
    handleRunAutomation,
    handleViewGuideline,
    isAnyWorkflowRunning,
    paginationProps,
  }: IList) => {
    const columns = createColumns(
      handleEditAutomation,
      handleRunAutomation,
      handleDeleteAutomation,
      handleViewGuideline,
      isAnyWorkflowRunning
    );

    return (
      <Table
        data={automationList}
        columns={columns}
        loading={isLoading}
        keyExtractor={(row) => row.readable_id}
        emptyMessage='No workflows found'
        paginationProps={{
          paginationData: paginationProps?.paginationData as IPagination,
          handlePagination: paginationProps?.handlePagination,
        }}
      />
    );
  }
);
