/**
 * AppHeader 컴포넌트
 * 디자인 토큰 기반 헤더 레이아웃
 */

'use client'

import { Layout, Typography, Space, Tag } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/Button';

const { Header } = Layout;
const { Title, Text } = Typography;

interface AppHeaderProps {
  title: string;
  user?: {
    name?: string;
    phone?: string;
    role?: string;
  };
  showLogo?: boolean;
}

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'admin':
      return '관리자';
    case 'candidate':
      return '후보자';
    case 'viewer':
      return '뷰어';
    default:
      return '사용자';
  }
};

const getRoleColor = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'red';
    case 'candidate':
      return 'green';
    case 'viewer':
      return 'purple';
    default:
      return 'default';
  }
};

export function AppHeader({ title, user, showLogo = true }: AppHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showLogo && (
          <img
            src="/reform-party-logo.png"
            alt="개혁신당"
            style={{ height: '40px', width: 'auto' }}
          />
        )}
        <Title level={3} style={{ margin: 0, color: 'hsl(var(--primary))' }}>
          {title}
        </Title>
      </div>

      {user && (
        <Space>
          <Text>
            <UserOutlined /> {user.name || user.phone}
            {user.role && (
              <Tag color={getRoleColor(user.role)} style={{ marginLeft: 8 }}>
                {getRoleLabel(user.role)}
              </Tag>
            )}
          </Text>
          <Button variant="ghost" onClick={handleLogout}>
            <LogoutOutlined /> 로그아웃
          </Button>
        </Space>
      )}
    </Header>
  );
}
