/**
 * AppLayout 컴포넌트
 * 디자인 토큰 기반 공통 레이아웃
 */

'use client'

import { ReactNode } from 'react';
import { Layout } from 'antd';
import { AppHeader } from './AppHeader';

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: ReactNode;
  headerTitle: string;
  user?: {
    name?: string;
    phone?: string;
    role?: string;
  };
  showLogo?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export function AppLayout({
  children,
  headerTitle,
  user,
  showLogo = true,
  maxWidth = 'xl',
  padding = true,
}: AppLayoutProps) {
  return (
    <Layout className="min-h-screen bg-background">
      <AppHeader title={headerTitle} user={user} showLogo={showLogo} />

      <Content className={padding ? 'p-6' : ''}>
        <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
          {children}
        </div>
      </Content>

      <Footer className="text-center bg-card border-t border-border">
        <div className="text-muted-foreground text-sm">
          개혁신당 유세 비서 © {new Date().getFullYear()}
        </div>
      </Footer>
    </Layout>
  );
}
