/**
 * Alert 컴포넌트
 * 사용자에게 피드백을 제공하는 알림 박스
 * 개혁신당 디자인 시스템 기반
 * variant: info(기본), success, warning, danger
 */

import { ReactNode } from 'react';
import { cn } from '../lib/utils';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-info/10 dark:border-info/30 dark:text-info',
  success: 'bg-green-50 border-green-200 text-green-700 dark:bg-success/10 dark:border-success/30 dark:text-success',
  warning: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-warning/10 dark:border-warning/30 dark:text-warning',
  danger: 'bg-red-50 border-red-200 text-red-700 dark:bg-danger/10 dark:border-danger/30 dark:text-danger',
};

const iconSvgs: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  danger: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}: AlertProps) {
  const Icon = iconSvgs[variant];

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {Icon}
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
