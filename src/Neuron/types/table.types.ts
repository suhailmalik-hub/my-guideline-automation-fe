import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<TData = Record<string, unknown>> {
  field: keyof TData | null;
  direction: SortDirection;
}

export interface TableColumn<TData = Record<string, unknown>> {
  key: keyof TData | string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (row: TData, index: number) => ReactNode;
}

export interface TableProps<TData = Record<string, unknown>> {
  columns: TableColumn<TData>[];
  data: TData[];
  keyExtractor: (row: TData) => string | number;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  sortable?: boolean;
  paginated?: boolean;
  defaultPageSize?: number;
  rowsPerPageOptions?: number[];
  onRowClick?: (row: TData) => void;
  rowClassName?: (row: TData) => string;
  loading?: boolean;
  // External pagination control (for server-side pagination)
  paginationProps?: {
    paginationData: {
      currentPage: number;
      rowsPerPage: number;
      totalItems: number;
      totalPages: number;
    };
    handlePagination: (pageNumber: number, limit: number) => void;
  };
}
