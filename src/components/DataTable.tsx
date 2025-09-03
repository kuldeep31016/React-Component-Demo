import React, { useState, useMemo, useCallback, memo } from 'react';
import { ChevronUp, ChevronDown, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  keyField?: keyof T;

  loading?: boolean;
  error?: string;

  selectable?: boolean | 'single' | 'multiple';
  selectedRows?: T[];
  onRowSelect?: (selectedRows: T[]) => void;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string, order: 'asc' | 'desc') => void;

  className?: string;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hoverable?: boolean;

  onRowClick?: (row: T, index: number) => void;
}

// Skeleton loader component for loading state
const TableSkeleton: React.FC<{ columns: number; rows: number; size: string }> =
  memo(({ columns, rows, size }) => {
    const sizeClasses = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12',
    };

    return (
      <div className="animate-pulse">
        <div className="overflow-hidden rounded-lg border border-secondary-200">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={index}
                    className={clsx(
                      'border-b border-secondary-200 px-4 py-3 text-left',
                      sizeClasses[size]
                    )}
                  >
                    <div className="h-4 w-24 rounded bg-secondary-200" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className={clsx(
                        'border-b border-secondary-100 px-4 py-3',
                        sizeClasses[size]
                      )}
                    >
                      <div className="h-4 w-20 rounded bg-secondary-100" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  });

TableSkeleton.displayName = 'TableSkeleton';

// Individual row component for performance optimization
const TableRow = memo(
  <T extends Record<string, any>>({
    row,
    index,
    columns,
    keyField,
    size,
    striped,
    hoverable,
    selectable,
    isSelected,
    onRowSelect,
    onRowClick,
  }: {
    row: T;
    index: number;
    columns: Column<T>[];
    keyField?: keyof T;
    size: string;
    striped: boolean;
    hoverable: boolean;
    selectable?: boolean | 'single' | 'multiple';
    isSelected: boolean;
    onRowSelect?: (selectedRows: T[]) => void;
    onRowClick?: (row: T, index: number) => void;
  }) => {
    const sizeClasses = {
      sm: 'h-8 px-3 py-1.5 text-sm',
      md: 'h-10 px-4 py-2 text-base',
      lg: 'h-12 px-4 py-3 text-lg',
    };

    const handleRowClick = useCallback(() => {
      onRowClick?.(row, index);
    }, [onRowClick, row, index]);

    const handleSelect = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectable && onRowSelect) {
          if (selectable === 'single') {
            onRowSelect(isSelected ? [] : [row]);
          } else if (selectable === 'multiple') {
            // This would need to be handled by parent component
            // For now, just toggle the current row
            onRowSelect(isSelected ? [] : [row]);
          }
        }
      },
      [selectable, onRowSelect, isSelected, row]
    );

    return (
      <tr
        className={clsx(
          'transition-colors duration-150',
          striped && index % 2 === 1 && 'bg-secondary-50',
          hoverable && 'hover:bg-secondary-100',
          onRowClick && 'cursor-pointer',
          isSelected && 'border-l-4 border-l-primary-500 bg-primary-50'
        )}
        onClick={handleRowClick}
      >
        {selectable && (
          <td
            className={clsx(
              'border-b border-secondary-100 px-4',
              sizeClasses[size]
            )}
          >
            <button
              onClick={handleSelect}
              className={clsx(
                'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                isSelected
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-secondary-300 hover:border-primary-400'
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </button>
          </td>
        )}
        {columns.map(column => (
          <td
            key={column.key}
            className={clsx(
              'border-b border-secondary-100 px-4',
              sizeClasses[size],
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.className
            )}
            style={column.width ? { width: column.width } : undefined}
          >
            {column.render
              ? column.render(row[column.dataIndex], row, index)
              : row[column.dataIndex]?.toString() || ''}
          </td>
        ))}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  loading = false,
  error,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  sortBy,
  sortOrder,
  onSort,
  className,
  size = 'md',
  striped = false,
  hoverable = true,
  onRowClick,
}: DataTableProps<T>) => {
  const [internalSortBy, setInternalSortBy] = useState<string | undefined>(
    sortBy
  );
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc'>(
    sortOrder || 'asc'
  );

  // Memoized sorted data for performance
  const sortedData = useMemo(() => {
    if (!internalSortBy) return data;

    const column = columns.find(col => col.key === internalSortBy);
    if (!column || !column.sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return internalSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, columns, internalSortBy, internalSortOrder]);

  const handleSort = useCallback(
    (columnKey: string) => {
      const column = columns.find(col => col.key === columnKey);
      if (!column?.sortable) return;

      const newOrder =
        internalSortBy === columnKey && internalSortOrder === 'asc'
          ? 'desc'
          : 'asc';

      setInternalSortBy(columnKey);
      setInternalSortOrder(newOrder);
      onSort?.(columnKey, newOrder);
    },
    [columns, internalSortBy, internalSortOrder, onSort]
  );

  const isRowSelected = useCallback(
    (row: T) => {
      if (!keyField) return false;
      return selectedRows.some(
        selectedRow => selectedRow[keyField] === row[keyField]
      );
    },
    [selectedRows, keyField]
  );

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (loading) {
    return (
      <div className={className}>
        <TableSkeleton
          columns={columns.length + (selectable ? 1 : 0)}
          rows={5}
          size={size}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={clsx(
          'rounded-lg border border-error-200 bg-error-50 p-8 text-center',
          className
        )}
      >
        <div className="text-error-600">
          <p className="text-lg font-semibold">Error Loading Data</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={clsx(
          'rounded-lg border border-secondary-200 bg-secondary-50 p-8 text-center',
          className
        )}
      >
        <div className="text-secondary-600">
          <p className="text-lg font-semibold">No Data Available</p>
          <p className="mt-2 text-sm">There are no records to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg border border-secondary-200',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              {selectable && (
                <th className="border-b border-secondary-200 px-4 py-3 text-left">
                  <div className="flex h-4 w-4 items-center justify-center">
                    {/* Could add select all checkbox here for multiple selection */}
                  </div>
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={clsx(
                    'border-b border-secondary-200 px-4 py-3 text-left font-medium text-secondary-700',
                    sizeClasses[size],
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-secondary-100',
                    column.className
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="ml-2 flex flex-col">
                        <ChevronUp
                          className={clsx(
                            'h-3 w-3',
                            internalSortBy === column.key &&
                              internalSortOrder === 'asc'
                              ? 'text-primary-500'
                              : 'text-secondary-400'
                          )}
                        />
                        <ChevronDown
                          className={clsx(
                            '-mt-1 h-3 w-3',
                            internalSortBy === column.key &&
                              internalSortOrder === 'desc'
                              ? 'text-primary-500'
                              : 'text-secondary-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <TableRow
                key={keyField ? row[keyField] : index}
                row={row}
                index={index}
                columns={columns}
                keyField={keyField}
                size={size}
                striped={striped}
                hoverable={hoverable}
                selectable={selectable}
                isSelected={isRowSelected(row)}
                onRowSelect={onRowSelect}
                onRowClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
