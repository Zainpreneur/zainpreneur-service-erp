import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

const colorMap: Record<string, string> = {
  primary: 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400 border-indigo-600/20',
  success: 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400 border-emerald-600/20',
  warning: 'bg-amber-600/10 text-amber-600 dark:bg-amber-600/20 dark:text-amber-400 border-amber-600/20',
  danger: 'bg-rose-600/10 text-rose-600 dark:bg-rose-600/20 dark:text-rose-400 border-rose-600/20',
  accent: 'bg-cyan-600/10 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400 border-cyan-600/20',
};

const trendIcon: Record<'up' | 'down' | 'neutral', React.ComponentType<{ size?: number; className?: string }>> = {
  up: ChevronUp,
  down: ChevronDown,
  neutral: Minus,
};

const trendColor: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-slate-500 dark:text-slate-400',
};

export function StatCard({
  label, value, icon: Icon, color = 'primary', href, loading,
  trend,
}: {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  href?: string;
  loading?: boolean;
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string; value: string };
}) {
  let TrendIcon: React.ComponentType<any> | null = null;
  let trendCls = '';
  if (trend) {
    TrendIcon = trendIcon[trend.direction as keyof typeof trendIcon];
    trendCls = trendColor[trend.direction as keyof typeof trendColor];
  }

  const content = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{loading ? '—' : value}</p>
        </div>
        {Icon && (
          <div className={cn('shrink-0 rounded-xl p-3', colorMap[color])}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && TrendIcon && (
        <div className="flex items-center gap-1.5 pt-1">
          <TrendIcon size={12} className={trendCls} />
          <span className="text-xs font-medium {trendCls}">
            {trend.label} {trend.value}
          </span>
        </div>
      )}
    </div>
  );
  const cls = 'glass-card rounded-xl p-4 transition-all hover:border-[var(--ring)] fade-in';
  if (href) return <Link href={href} className={cls}>{content}</Link>;
  return <div className={cls}>{content}</div>;
}