/**
 * Badge 컴포넌트
 * 디자인 토큰 기반 뱃지/태그 컴포넌트
 *
 * @example
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="success">완료</Badge>
 * <Badge variant="danger">긴급</Badge>
 */

import { ReactNode, HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/30',
  secondary: 'bg-secondary text-secondary-foreground border-border',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-info/10 text-info border-info/30',
};

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs font-medium
        border
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
