/**
 * Card 컴포넌트
 * 공통 카드 레이아웃 컴포넌트
 * 개혁신당 디자인 시스템 기반
 *
 * @example
 * <Card>
 *   <CardHeader title="제목" description="설명" />
 *   <CardContent>내용</CardContent>
 *   <CardFooter>푸터</CardFooter>
 * </Card>
 */

import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm',
    elevated: 'bg-white dark:bg-card border border-gray-200 dark:border-border shadow-md hover:shadow-lg transition-shadow',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - 카드 상단 헤더 영역
 */
interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  action,
  className = ''
}: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * CardContent - 카드 본문 영역
 */
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

/**
 * CardFooter - 카드 하단 영역
 */
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={cn('mt-4 flex items-center justify-end gap-2', className)}>
      {children}
    </div>
  );
}
