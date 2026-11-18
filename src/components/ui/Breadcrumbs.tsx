import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn('flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400', className)} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {isLast ? (
              <span className="text-slate-900 dark:text-slate-100 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={12} />}
          </span>
        );
      })}
    </nav>
  );
}