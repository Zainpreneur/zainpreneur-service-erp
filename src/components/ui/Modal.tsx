'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Modal({
  open, onOpenChange, title, description, children, footer, size = 'md',
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeCls = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  const width = { sm: 'sm:max-w-md', md: 'sm:max-w-2xl', lg: 'sm:max-w-4xl', xl: 'sm:max-w-6xl' }[size];
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" />
        <Dialog.Content
          className={cn('glass-panel fixed inset-x-0 bottom-0 z-50 m-0 max-h-[92dvh] w-full rounded-t-2xl p-0 sm:static sm:inset-auto sm:m-auto sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl', width)}
        >
          <div className="flex max-h-[92dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl">
            {(title || description) && (
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/60 dark:border-slate-700/60 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  {title && <Dialog.Title className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</Dialog.Title>}
                  {description && <Dialog.Description className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</Dialog.Description>}
                </div>
                <Dialog.Close className="rounded-md p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
                  <X size={16} />
                </Dialog.Close>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">{children}</div>
            {footer && (
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200/60 dark:border-slate-700/60 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-5">
                {footer}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
