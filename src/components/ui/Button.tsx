import React from 'react';
import { cn } from '@/lib/cn';

export type ButtonSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[52px]',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: ButtonSize;
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-destructive text-white hover:bg-destructive/90',
  };
  return (
    <button className={cn(base, variants[variant], sizeMap[size], className)} {...props} />
  );
}