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
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300/60 dark:border-slate-700/60 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="rounded-full bg-indigo-100 dark:bg-indigo-600/20 p-3 text-indigo-600 dark:text-indigo-400">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
