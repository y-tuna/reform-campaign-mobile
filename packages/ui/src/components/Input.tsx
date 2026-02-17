/**
 * Input 컴포넌트
 * react-hook-form과 함께 사용 가능하도록 forwardRef 구현
 * 개혁신당 디자인 시스템 기반
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
          'shadow-sm placeholder:text-gray-400',
          'focus:outline-none focus:ring-1',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
          'dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-danger dark:focus:border-danger dark:focus:ring-danger'
            : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500 dark:border-border dark:focus:border-primary dark:focus:ring-primary',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
