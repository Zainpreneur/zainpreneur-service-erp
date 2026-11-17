import React from 'react';
import { cn } from '@/lib/cn';

const colors: Record<string, string> = {
  default: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
  indigo: 'bg-indigo-600/20 text-indigo-300',
  emerald: 'bg-emerald-600/20 text-emerald-300',
  amber: 'bg-amber-600/20 text-amber-300',
  rose: 'bg-rose-600/20 text-rose-300',
  cyan: 'bg-cyan-600/20 text-cyan-300',
};

export function Badge({ className, color = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { color?: keyof typeof colors }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[color], className)} {...props} />;
}