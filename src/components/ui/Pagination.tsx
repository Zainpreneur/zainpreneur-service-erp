import React from 'react';
import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const goTo = (p: number) => {
    const next = Math.max(1, Math.min(pageCount, p));
    if (next !== page) onPageChange(next);
  };

  const showLeftDots = page > 3;
  const showRightDots = page < pageCount - 2;
  const start = showLeftDots ? page - 1 : 1;
  const end = showRightDots ? page + 1 : pageCount;

  return (
    <nav className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 sm:justify-center mt-8', className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          onClick={() => goTo(page + 1)}
          disabled={page === pageCount}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 ml-2"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <button onClick={() => goTo(1)} className="rounded-lg px-3 py-2 text-sm font-medium bg-indigo-600 text-white">
            1
          </button>
        )}
        {showLeftDots && (
          <span className="rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400">…</span>
        )}
        {[...Array(end - start + 1).keys()].map((i) => {
          const p = start + i;
          if (p === 1 || p === pageCount || (!showLeftDots && p > 1) || (!showRightDots && p < pageCount)) {
            return (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
                )}
              >
                {p}
              </button>
            );
          }
          return null;
        })}
        {showRightDots && (
          <span className="rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400">…</span>
        )}
        {pageCount > 1 && page < pageCount && (
          <button onClick={() => goTo(pageCount)} className="rounded-lg px-3 py-2 text-sm font-medium bg-indigo-600 text-white">
            {pageCount}
          </button>
        )}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 sm:hidden">
        Page {page} of {pageCount}
      </div>
    </nav>
  );
}