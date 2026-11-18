import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'indigo'
  | 'rose'
  | 'cyan'
  | 'emerald'
  | 'amber';

const colors: Record<BadgeColor, string> = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200',
  primary: 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400',
  secondary: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  success: 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400',
  warning: 'bg-amber-600/10 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400',
  danger: 'bg-rose-600/10 text-rose-600 dark:bg-rose-600/20 dark:text-rose-400',
  accent: 'bg-cyan-600/10 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400',
  indigo: 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400',
  rose: 'bg-rose-600/10 text-rose-600 dark:bg-rose-600/20 dark:text-rose-400',
  cyan: 'bg-cyan-600/10 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400',
  emerald: 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400',
  amber: 'bg-amber-600/10 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400',
};

export function Badge({
  className,
  color = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { color?: BadgeColor }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[color],
        className,
      )}
      {...props}
    />
  );
}