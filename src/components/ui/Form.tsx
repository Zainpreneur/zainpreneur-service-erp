import type { KeyboardEvent, ReactNode } from 'react';
import {
  Content as SelectContent,
  Item as SelectItem,
  ItemText as SelectItemText,
  Portal as SelectPortal,
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Value as SelectValue,
} from '@radix-ui/react-select';
import { cn } from '@/lib/cn';
import { AlertTriangle, ChevronDown } from 'lucide-react';

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className = '',
  children,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('field mb-4', className)}>
      {label ? (
        <label className="label mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-rose-600 ml-1">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="error-text mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <AlertTriangle className="size-3.5 shrink-0" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  type = 'text',
  invalid,
  disabled,
  min,
  max,
  maxLength,
  step,
  autoComplete,
  inputMode,
  list,
  'aria-label': ariaLabel,
}: {
  id?: string;
  'aria-label'?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  invalid?: boolean;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  maxLength?: number;
  step?: number | string;
  autoComplete?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'search' | 'url';
  list?: string;
}) {
  const charCount = maxLength ? `${value.length}/${maxLength}` : null;
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`input-base w-full min-h-[44px] px-3 py-2 text-sm ${maxLength ? 'pb-6' : ''} ${invalid ? 'input-invalid' : ''}`}
      />
      {charCount ? (
        <span className="pointer-events-none absolute right-3 bottom-2.5 text-[0.6875rem] tabular-nums text-slate-400">
          {charCount}
        </span>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  invalid,
  disabled,
  rows = 4,
  maxLength,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div className="relative">
      <textarea
        id={id}
        rows={rows}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`input-base w-full min-h-[44px] px-3 py-2 text-sm resize-y leading-relaxed ${invalid ? 'input-invalid' : ''} ${
          maxLength ? 'pb-8' : ''
        }`}
      />
      {maxLength ? (
        <span className="pointer-events-none absolute right-3 bottom-2.5 text-[0.6875rem] tabular-nums text-slate-400">
          {value.length}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  options = [],
  children,
  placeholder = 'Select…',
  invalid,
  disabled,
  'aria-label': ariaLabel,
}: {
  id?: string;
  'aria-label'?: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  children?: ReactNode;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  return (
    <SelectRoot
      value={value}
      onValueChange={(next: string) => onChange(next)}
      disabled={disabled}
      required={invalid}
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        type="button"
        className="input-base w-full min-h-[44px] px-3 py-2 text-sm items-center justify-between gap-2 text-left relative z-1"
      >
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper"
          align="start"
          sideOffset={6}
          className="glass-strong flex max-h-80 w-auto min-w-full max-w-sm flex-col overflow-hidden rounded-xl shadow-xl"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition disabled:pointer-events-none disabled:opacity-40"
              >
                <SelectItemText>{option.label}</SelectItemText>
              </SelectItem>
            ))
          ) : children || (
            <SelectItem value="" disabled>
              <SelectItemText>No options</SelectItemText>
            </SelectItem>
          )}
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
        checked ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/50' : 'border-slate-200 dark:border-slate-700 bg-panel dark:bg-panel hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-md border transition ${
          checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-600 bg-panel dark:bg-panel'
        }`}
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="m2.5 6.2 2.2 2.2 4.8-4.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </span>
    </label>
  );
}

export function RadioCards({
  name,
  value,
  onChange,
  options,
  columns = 2,
  invalid,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; hint?: string }[];
  columns?: 2 | 3 | 4;
  invalid?: boolean;
}) {
  const grid = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    <div
      role="radiogroup"
      aria-invalid={invalid || undefined}
      className={`grid grid-cols-1 gap-2 ${grid} ${invalid ? 'rounded-xl ring-1 ring-rose-300' : ''}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
              active
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 ring-4 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-panel dark:bg-panel hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{option.label}</span>
              {option.hint ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{option.hint}</span> : null}
            </span>
            <span
              className={`absolute top-3 right-3 flex size-4 items-center justify-center rounded-full ring-1 transition ${
                active ? 'bg-indigo-600 ring-indigo-600' : 'bg-panel ring-slate-300 dark:ring-slate-700'
              }`}
            >
              {active ? (
                <svg viewBox="0 0 12 12" className="size-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.4}>
                  <path d="m2.5 6.2 2.2 2.2 4.8-4.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl border p-5 mb-5">
      {title && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        </div>
      )}
      {description && <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function FormFooter({
  children,
  cancel,
}: {
  children: ReactNode;
  cancel?: ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      {cancel ? (
        <button type="button" className="btn-ghost flex-1 sm:w-auto">
          {cancel}
        </button>
      ) : null}
      <div className="flex items-end gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Grid helper for responsive form layouts.
 * Stacks on mobile, columns from sm upward.
 */
export function FormGrid({
  cols = 2,
  children,
}: {
  cols?: 1 | 2 | 3 | 4;
  children: ReactNode;
}) {
  const colMap: Record<1 | 2 | 3 | 4, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  return (
    <div className={cn('grid gap-4 sm:gap-5', colMap[cols])}>
      {children}
    </div>
  );
}