'use client'

import React, { Suspense } from 'react'
import { Result, Button, Spin } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'

const errorMessages: Record<string, { title: string; subTitle: string }> = {
  Configuration: {
    title: '서버 설정 오류',
    subTitle: '인증 서버 설정에 문제가 있습니다. 관리자에게 문의하세요.'
  },
  AccessDenied: {
    title: '접근 권한 없음',
    subTitle: '이 리소스에 접근할 권한이 없습니다.'
  },
  Verification: {
    title: '인증 실패',
    subTitle: '인증번호가 올바르지 않거나 만료되었습니다.'
  },
  Default: {
    title: '로그인 오류',
    subTitle: '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
  }
}

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  
  const { title, subTitle } = errorMessages[error] || errorMessages.Default

  const handleRetry = () => {
    router.push('/auth/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={[
        <Button type="primary" key="retry" onClick={handleRetry}>
          다시 로그인
        </Button>,
        <Button key="home" onClick={handleGoHome}>
          홈으로
        </Button>
      ]}
    />
  )
}

export default function AuthErrorPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <Suspense fallback={<Spin size="large" />}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}