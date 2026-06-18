import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalRecords: number;
}

interface TablePaginationProps {
  paginationData: PaginationData;
  onPageChange: (page: number, rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

const DEFAULT_ROWS_OPTIONS = [5, 10, 25];

export const TablePagination = ({
  paginationData,
  onPageChange,
  rowsPerPageOptions = DEFAULT_ROWS_OPTIONS,
}: TablePaginationProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { currentPage, totalPages, rowsPerPage } = paginationData;

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const pageNumbersSeries = useMemo(() => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      startPage = 2;
      endPage = 4;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const handleOnPageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page, rowsPerPage);
  };

  const handleOnRowsPerPageChange = (newRowsPerPage: number) => {
    if (newRowsPerPage === rowsPerPage) {
      return;
    }
    onPageChange(1, newRowsPerPage);
    setIsDropdownOpen(false);
  };

  return (
    <div className='px-6 py-4 flex justify-between items-center border-t border-gray-100 bg-white'>
      {/* Left: Page navigation */}
      <div className='flex items-center gap-2'>
        <button
          onClick={() => handleOnPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer transition-opacity'
          aria-label='Previous page'
        >
          <ChevronLeft
            size={16}
            className='text-gray-600'
          />
        </button>

        <div className='flex items-center'>
          {pageNumbersSeries.map((page, index) => (
            <div
              key={index}
              className='flex items-center'
            >
              {typeof page === 'number' ? (
                <button
                  onClick={() => handleOnPageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer text-sm transition-colors ${
                    currentPage === page ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ) : (
                <span className='w-8 h-8 flex items-center justify-center text-gray-400 text-sm'>...</span>
              )}
              {index < pageNumbersSeries.length - 1 && <span className='text-gray-200 mx-1'>|</span>}
            </div>
          ))}
        </div>

        <button
          onClick={() => handleOnPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer transition-opacity'
          aria-label='Next page'
        >
          <ChevronRight
            size={16}
            className='text-gray-600'
          />
        </button>
      </div>

      {/* Right: Rows per page selector */}
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        <span className='hidden sm:inline'>Number of results per page:</span>
        <div
          ref={dropdownRef}
          className='relative inline-block text-left'
        >
          <div className='relative w-[75px]'>
            <button
              type='button'
              className='inline-flex justify-between items-center px-3 h-8 border border-gray-200 text-gray-700 text-sm font-medium rounded bg-white hover:bg-gray-50 w-full transition-colors'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup='true'
            >
              <span className='truncate'>{rowsPerPage}</span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className='absolute left-0 bottom-[calc(100%+4px)] z-50 w-full origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
                role='menu'
                aria-orientation='vertical'
              >
                <div className='py-1'>
                  {rowsPerPageOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOnRowsPerPageChange(option)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        option === rowsPerPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      role='menuitem'
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
