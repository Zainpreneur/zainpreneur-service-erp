import React from 'react';
import { cn } from '@/lib/cn';

export type CardVariant = 'default' | 'outlined' | 'filled' | 'elevated' | 'glass';

const cardVariants: Record<CardVariant, string> = {
  default: 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  outlined: 'border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  filled: 'bg-slate-100 dark:bg-slate-800',
  elevated: 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md',
  glass: 'glass-card border border-slate-200/60 dark:border-slate-700/60',
};

export function Card({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return <div className={cn('rounded-xl p-4 transition-colors', cardVariants[variant], className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex items-center justify-between', className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4 flex items-center justify-between gap-2', className)} {...props} />;
}