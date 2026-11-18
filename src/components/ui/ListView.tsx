import React from 'react';
import { cn } from '@/lib/cn';
import { Badge } from './Badge';

export interface ListItemProps {
  children: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ListItem({
  children,
  leading,
  trailing,
  badge,
  className,
  onClick,
  disabled,
}: ListItemProps) {
  return (
    <div
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      disabled={disabled}
      className={cn(
        'glass-card rounded-xl border p-4 flex items-center justify-between gap-3 transition-colors',
        disabled
          ? 'opacity-50 pointer-events-none'
          : onClick
          ? 'cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50'
          : '',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0">{children}</div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

export interface ListViewProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function ListView<T>({
  items = [],
  renderItem,
  emptyTitle = 'No items',
  emptyDescription = 'There are no records to display.',
  className,
}: ListViewProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      {!items || items.length === 0 ? (
        <div className="glass-card rounded-xl border p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{emptyTitle}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{emptyDescription}</p>
        </div>
      ) : (
        items.map((item, i) => renderItem(item, i))
      )}
    </div>
  );
}