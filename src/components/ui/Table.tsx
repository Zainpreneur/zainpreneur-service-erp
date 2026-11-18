import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SortingState = { id: string; desc: boolean }[];

export interface DataTableProps<TData extends Record<string, unknown>> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  className?: string;
  onRowClick?: (row: TData) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  cell?: (params: { value: unknown; row: TData; column: string }) => React.ReactNode;
}

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 15,
  className,
  onRowClick,
  emptyTitle = 'No items',
  emptyDescription = 'There are no records to display.',
  cell: cellOverride,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const rows = table.getSortedRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className={cn('glass-card rounded-xl border p-10 text-center', className)}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={cn('glass-card rounded-xl border overflow-hidden', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) return null;
                return (
                  <th
                    key={header.id}
                    className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <header
                      className={cn(
                        'flex items-center gap-1.5 cursor-pointer select-none transition-colors hover:text-slate-900 dark:hover:text-slate-100',
                        header.column.getCanSort() ? 'group' : '',
                      )}
                      onClick={header.column.getCanSort() ? header.column.toggleSorting : undefined}
                    >
                      {header.id}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ChevronsUpDown className="size-4 text-slate-500 rotate-180" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ChevronsUpDown className="size-4 text-slate-500" />
                      ) : (
                        <ChevronsUpDown className="size-4 text-slate-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </header>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {rows.map((row) => {
            const item = row.original;
            return (
              <tr
                key={row.id}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => onRowClick?.(item)}
              >
                {row.getVisibleCells().map((cell) => {
                  const value = cell.getValue();
                  const rendered =
                    cellOverride?.({ value, row: item, column: cell.id }) ??
                    flexRenderCell(cell);
                  return (
                    <td
                      key={cell.id}
                      className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-600 dark:text-slate-400"
                    >
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function flexRenderCell(cell: any) {
  const { column, getValue } = cell;
  const value = getValue();
  const render = column.columnDef.cell;
  if (render) return render({ value, row: cell.row?.original, column: column.id });
  if (value === null || value === undefined) return <span className="text-slate-400">—</span>;
  if (typeof value === 'object') {
    try {
      return <span className="text-xs text-slate-400">{JSON.stringify(value)}</span>;
    } catch {
      return <span className="text-slate-400">—</span>;
    }
  }
  return String(value);
}

export { ColumnDef };