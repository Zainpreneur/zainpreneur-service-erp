import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  const baseClasses = 'input-field';
  const errorClasses = error ? 'border-red-500 dark:border-red-400 shadow-red-500/10' : '';
  
  return (
    <input ref={ref} className={cn(baseClasses, errorClasses, className)} {...props} />
  );
});
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>(({ className, error, ...props }, ref) => {
  const baseClasses = 'textarea-field';
  const errorClasses = error ? 'border-red-500 dark:border-red-400 shadow-red-500/10' : '';
  
  return (
    <textarea ref={ref} className={cn(baseClasses, errorClasses, className)} {...props} />
  );
});
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, InputProps>(({ className, error, ...props }, ref) => {
  const baseClasses = 'select-field';
  const errorClasses = error ? 'border-red-500 dark:border-red-400 shadow-red-500/10' : '';
  
  return (
    <select ref={ref} className={cn(baseClasses, errorClasses, className)} {...props} />
  );
});
Select.displayName = 'Select';