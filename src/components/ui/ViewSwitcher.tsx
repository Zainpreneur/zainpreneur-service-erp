'use client';
import React from 'react';
import { cn } from '@/lib/cn';
import { LayoutGrid, List, Table2, GalleryHorizontalEnd, Kanban } from 'lucide-react';

export type ViewMode = 'table' | 'list' | 'card' | 'gallery' | 'board';

const icons: Record<ViewMode, React.ComponentType<{ size?: number }>> = {
  table: Table2,
  list: List,
  card: LayoutGrid,
  gallery: GalleryHorizontalEnd,
  board: Kanban,
};

const labels: Record<ViewMode, string> = {
  table: 'Table',
  list: 'List',
  card: 'Card',
  gallery: 'Gallery',
  board: 'Board',
};

export function ViewSwitcher({
  value,
  onChange,
  options = ['table', 'card', 'list'],
  className,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  options?: ViewMode[];
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-sm', className)}>
      {options.map((opt) => {
        const Icon = icons[opt];
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900',
            )}
            aria-pressed={active}
            title={labels[opt]}
          >
            <Icon size={13} />
            <span className="hidden sm:inline capitalize">{labels[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}