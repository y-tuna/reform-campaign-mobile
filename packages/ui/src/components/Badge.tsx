/**
 * Badge 컴포넌트
 * 상태, 태그, 레이블 표시용 뱃지
 * 개혁신당 디자인 시스템 기반
 */

import { ReactNode } from 'react';
import { cn } from '../lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground',
  primary: 'bg-orange-100 text-orange-700 dark:bg-primary/10 dark:text-primary',
  secondary: 'bg-blue-100 text-blue-700 dark:bg-secondary/10 dark:text-secondary-foreground',
  success: 'bg-green-100 text-green-700 dark:bg-success/10 dark:text-success',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-warning/10 dark:text-warning',
  danger: 'bg-red-100 text-red-700 dark:bg-danger/10 dark:text-danger',
  info: 'bg-blue-100 text-blue-700 dark:bg-info/10 dark:text-info',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-orange-500',
  secondary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
