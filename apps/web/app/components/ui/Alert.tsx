/**
 * Alert 컴포넌트
 * 디자인 토큰 기반 알림/경고 컴포넌트
 *
 * @example
 * <Alert variant="info" title="알림">정보 메시지</Alert>
 * <Alert variant="danger" title="오류">에러 메시지</Alert>
 */

import { ReactNode } from 'react';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: ReactNode }> = {
  info: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    text: 'text-info',
    icon: <InfoCircleOutlined />,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: <CheckCircleOutlined />,
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: <ExclamationCircleOutlined />,
  },
  danger: {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    text: 'text-danger',
    icon: <CloseCircleOutlined />,
  },
};

export function Alert({ variant = 'info', title, children, onClose }: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex gap-3 p-4 rounded-lg border
        ${styles.bg} ${styles.border}
      `}
    >
      <div className={`flex-shrink-0 text-lg ${styles.text}`}>
        {styles.icon}
      </div>
      <div className="flex-1">
        {title && (
          <h5 className={`font-semibold mb-1 ${styles.text}`}>
            {title}
          </h5>
        )}
        <div className="text-sm text-foreground">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 text-lg ${styles.text} hover:opacity-70 transition-opacity`}
        >
          ×
        </button>
      )}
    </div>
  );
}
