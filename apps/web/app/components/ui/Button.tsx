/**
 * Button 컴포넌트
 * 디자인 토큰 기반 버튼 컴포넌트
 *
 * @example
 * <Button variant="primary">Primary</Button>
 * <Button variant="secondary" size="lg">Large Secondary</Button>
 * <Button variant="danger" isLoading>Loading...</Button>
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary disabled:bg-primary/50',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring disabled:bg-secondary/50',
  ghost:
    'bg-transparent hover:bg-muted focus-visible:ring-ring disabled:hover:bg-transparent',
  danger:
    'bg-danger text-danger-foreground hover:bg-danger/90 focus-visible:ring-danger disabled:bg-danger/50',
  success:
    'bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success disabled:bg-success/50',
  warning:
    'bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning disabled:bg-warning/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingOutlined className="text-base" spin />}
      {children}
    </button>
  );
}
