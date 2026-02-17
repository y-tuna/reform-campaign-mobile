/**
 * Card 컴포넌트
 * 디자인 토큰 기반 카드 레이아웃 컴포넌트
 *
 * @example
 * <Card>
 *   <CardHeader title="제목" description="설명" />
 *   <CardContent>내용</CardContent>
 *   <CardFooter>푸터</CardFooter>
 * </Card>
 */

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-card border border-border shadow-sm',
    elevated: 'bg-card border border-border shadow-md hover:shadow-lg transition-shadow',
  };

  return (
    <div
      className={`rounded-lg p-6 ${variantStyles[variant]} ${className}`}
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

export function CardHeader({ title, description, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
  return <div className={className}>{children}</div>;
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
    <div className={`mt-4 flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
