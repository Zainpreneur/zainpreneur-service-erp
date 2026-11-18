import React from 'react';
import { cn } from '@/lib/cn';
import { Badge } from './Badge';

export interface CardGridProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function CardGridView<T>({
  items,
  renderCard,
  emptyTitle = 'No items',
  emptyDescription = 'There are no records to display.',
  className,
}: CardGridProps<T>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {items.length === 0 ? (
        <div className="glass-card rounded-xl border p-10 text-center col-span-full">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{emptyTitle}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{emptyDescription}</p>
        </div>
      ) : (
        items.map((item, i) => (
          <div key={i} className="glass-card rounded-xl border p-4">
            {renderCard(item, i)}
          </div>
        ))
      )}
    </div>
  );
}

export interface StatTileProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  trend?: { label: string; value: string; up: boolean };
}

const statColors: Record<string, string> = {
  primary: 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400',
  success: 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400',
  warning: 'bg-amber-600/10 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400',
  danger: 'bg-rose-600/10 text-rose-600 dark:bg-rose-600/20 dark:text-rose-400',
  accent: 'bg-cyan-600/10 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400',
};

export function StatTile({ label, value, icon, color = 'primary', trend }: StatTileProps) {
  return (
    <div className="glass-card rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className="shrink-0 rounded-xl p-2.5 {statColors[color]}">
          {icon}
        </div>
      </div>
      {trend && (
        <p className="mt-3 text-xs flex items-center gap-1">
          {trend.up ? (
            <span className="text-emerald-600">▲</span>
          ) : (
            <span className="text-rose-600">▼</span>
          )}
          <span className="text-slate-500 dark:text-slate-400">{trend.label} {trend.value}</span>
        </p>
      )}
    </div>
  );
}