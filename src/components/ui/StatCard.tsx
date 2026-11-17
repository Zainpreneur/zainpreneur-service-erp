import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export function StatCard({
  label, value, icon: Icon, color = 'primary', href, loading,
}: {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  href?: string;
  loading?: boolean;
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400',
    success: 'bg-emerald-600/15 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-600/15 text-amber-600 dark:text-amber-400',
    danger: 'bg-rose-600/15 text-rose-600 dark:text-rose-400',
    accent: 'bg-cyan-600/15 text-cyan-600 dark:text-cyan-400',
  };
  const content = (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{loading ? '—' : value}</p>
      </div>
      {Icon && (
        <div className={cn('shrink-0 rounded-xl p-3', colorMap[color])}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
  const cls = 'rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm transition hover:border-indigo-600/40 hover:shadow-md';
  if (href) return <Link href={href} className={cls}>{content}</Link>;
  return <div className={cls}>{content}</div>;
}
