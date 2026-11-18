import React from 'react';
import { cn } from '@/lib/cn';

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-ring text-white hover:bg-ring/90',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-destructive text-white hover:bg-destructive/90',
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}