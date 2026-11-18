import React from 'react';
import Link from 'next/link';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

export function PageHeader({
  title,
  description,
  action,
  back,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  back?: { href: string; label?: string };
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-2" />
      )}
      <div>
        {back && (
          <Link href={back.href} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-1">
            <span className="size-4">←</span> {back.label ?? 'Back'}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}