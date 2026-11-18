import React from 'react';
import { cn } from '@/lib/cn';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-8 text-center', className)}>
      {Icon && (
        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 p-4 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}