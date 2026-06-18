import { ArrowUpDown, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { SortState, TableColumn, TableProps } from '../../../../Neuron/types/table.types';
import { Loader } from '../loader/Loader';
import type { PaginationData } from './TablePagination';
import { TablePagination } from './TablePagination';

const SortIcon = <TData,>({ column, sort }: { column: TableColumn<TData>; sort: SortState<TData> }) => {
  if (!column.sortable || sort.field !== column.key) {
    return column.sortable ? (
      <ArrowUpDown
        size={13}
        className='text-gray-300 ml-1 shrink-0'
      />
    ) : null;
  }
  return sort.direction === 'asc' ? (
    <ChevronUp
      size={13}
      className='text-blue-500 ml-1 shrink-0'
    />
  ) : (
    <ChevronDown
      size={13}
      className='text-blue-500 ml-1 shrink-0'
    />
  );
};

export const Table = <TData,>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data found',
  emptyIcon,
  sortable = true,
  paginated = true,
  defaultPageSize = 5,
  rowsPerPageOptions = [5, 10, 25],
  onRowClick,
  rowClassName,
  loading = false,
  paginationProps,
}: TableProps<TData>) => {
  const [sort, setSort] = useState<SortState<TData>>({ field: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Check if using external pagination (server-side)
  const isExternalPagination = !!paginationProps?.paginationData;

  const handleSort = (column: TableColumn<TData>) => {
    if (!column.sortable || !sortable) return;

    setSort((prev) =>
      prev.field === column.key
        ? { field: column.key as keyof TData, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field: column.key as keyof TData, direction: 'asc' }
    );
    if (!isExternalPagination) {
      setPage(1);
    }
  };

  // Sorted data — always client-side regardless of external pagination
  const sortedData = useMemo(() => {
    if (!sort.field || !sortable) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sort.field as keyof TData];
      const bVal = b[sort.field as keyof TData];

      // Handle numeric sorting
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String sorting
      const diff = String(aVal).localeCompare(String(bVal));
      return sort.direction === 'asc' ? diff : -diff;
    });
  }, [data, sort, sortable]);

  // Paginated data — external pagination receives pre-paginated data from server, just apply sort on top
  const paginatedData = useMemo(() => {
    if (isExternalPagination) return sortedData;
    if (!paginated) return sortedData;
    const startIdx = (page - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, page, pageSize, paginated, isExternalPagination]);

  // Pagination data
  const paginationData: PaginationData = isExternalPagination
    ? {
        currentPage: paginationProps.paginationData.currentPage,
        totalPages: paginationProps.paginationData.totalPages,
        rowsPerPage: paginationProps.paginationData.rowsPerPage,
        totalRecords: paginationProps.paginationData.totalItems,
      }
    : {
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(sortedData.length / pageSize)),
        rowsPerPage: pageSize,
        totalRecords: sortedData.length,
      };

  const handlePagination = (newPage: number, newPageSize: number) => {
    if (isExternalPagination && paginationProps?.handlePagination) {
      paginationProps.handlePagination(newPage, newPageSize);
    } else {
      setPage(newPage);
      setPageSize(newPageSize);
    }
  };

  return (
    <div className='flex flex-col gap-0 overflow-hidden'>
      <div className='overflow-x-auto min-h-[300px]'>
        <table className='w-full '>
          <thead>
            <tr className='bg-gray-50'>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${column.className ?? ''} ${column.sortable && sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <span className='flex items-center'>
                    {column.label}
                    <SortIcon
                      column={column}
                      sort={sort}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='p-0'
                >
                  <Loader overlay={false} />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-4 py-16 text-center'
                >
                  {emptyIcon ?? (
                    <Globe
                      size={32}
                      className='mx-auto text-gray-200 mb-2'
                    />
                  )}
                  <p className='text-sm text-gray-400'>{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={keyExtractor(row)}
                  className={`bg-white hover:bg-gray-50/70 transition-colors group ${rowClassName ? rowClassName(row) : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3.5 ${column.className ?? ''}`}
                    >
                      {column.render ? (
                        column.render(row, rowIndex)
                      ) : (
                        <span>{String(row[column.key as keyof TData])}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {paginated && !loading && (isExternalPagination || sortedData.length > 0) && (
        <TablePagination
          paginationData={paginationData}
          onPageChange={handlePagination}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </div>
  );
};
