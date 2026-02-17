'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ConfigProvider, App } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import koKR from 'antd/locale/ko_KR'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#2563EB', // Trust Navy from design guide
    borderRadius: 6,
    colorBgContainer: '#ffffff',
  },
  components: {
    Layout: {
      bodyBg: '#f5f5f5',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#2563EB',
    },
    Button: {
      primaryShadow: 'none',
    }
  }
}

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider 
          locale={koKR}
          theme={theme}
        >
          <App>
            {children}
          </App>
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}