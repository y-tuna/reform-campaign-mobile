/**
 * Input 컴포넌트
 * 디자인 토큰 기반 입력 필드 컴포넌트
 *
 * @example
 * <Input label="이름" placeholder="이름을 입력하세요" />
 * <Input type="email" error="이메일 형식이 올바르지 않습니다" />
 */

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-md px-3 py-2
            bg-background text-foreground
            border border-input
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
