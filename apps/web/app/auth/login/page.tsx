'use client'

import React, { useState, FormEvent } from 'react'
import { Card as AntCard, Typography, message } from 'antd'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'

const { Title, Text } = Typography

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  /**
   * 이메일 로그인 핸들러
   * 공천 시스템(apply-reform)과 연동하여 status=pass인 후보자만 로그인 가능
   */
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 클라이언트 검증
      if (!formData.email || !formData.password) {
        setError('이메일과 비밀번호를 모두 입력해주세요.')
        setLoading(false)
        return
      }

      // NextAuth 이메일 로그인
      // TODO: 실제 공천 시스템 DB와 연동하여 status 확인
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.ok) {
        message.success('로그인 성공!')

        // 세션 정보로 역할별 리다이렉트
        const session = await getSession()

        if (session?.user?.role === 'candidate') {
          router.push('/home')
        } else if (session?.user?.role === 'party_admin' || session?.user?.role === 'admin' || session?.user?.role === 'viewer') {
          router.push('/admin/dashboard')
        } else if (session?.user?.role === 'super_admin') {
          router.push('/super-admin/dashboard')
        } else if (session?.user?.role === 'vendor') {
          router.push('/vendor/orders')
        } else {
          router.push('/')
        }
      } else {
        // 공천 미확정 유저는 unauthorized 페이지로 리다이렉트
        if (result?.error === 'NOMINATION_NOT_CONFIRMED') {
          router.push('/auth/unauthorized')
          return
        }
        setError(result?.error || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 상단 헤더 */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/reform-party-logo.png"
              alt="개혁신당 로고"
              width={32}
              height={32}
            />
            <span className="text-sm font-medium text-muted-foreground">
              홈으로 돌아가기
            </span>
          </a>
        </div>
      </header>

      {/* 메인 로그인 영역 */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* 로고 & 타이틀 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/reform-party-logo.png"
                alt="개혁신당 로고"
                width={160}
                height={40}
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              유세관리 시스템
            </h1>
            <p className="text-sm text-muted-foreground">
              개혁신당 후보자를 위한 캠페인 관리 서비스
            </p>
          </div>

          {/* 로그인 카드 */}
          <AntCard className="bg-card border-border shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* 에러 메시지 */}
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {/* 이메일 입력 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  이메일
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@reform-party.or.kr"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={loading}
                  required
                  className="bg-background"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  비밀번호
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={loading}
                  required
                  className="bg-background"
                />
              </div>

              {/* 비밀번호 찾기 링크 */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    message.info('비밀번호 찾기 기능은 준비 중입니다.')
                  }}
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                disabled={loading}
                fullWidth
              >
                로그인
              </Button>
            </form>
          </AntCard>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              공천 시스템에서 최종 승인받은 후보자만 이용 가능합니다.
            </p>
          </div>

          {/* 개발 환경 테스트 계정 */}
          <div className="mt-4 p-4 bg-accent/5 border border-border rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              개발 환경 테스트 계정
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setFormData({ email: 'candidate@example.com', password: 'test1234' })}
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">후보자:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">candidate@example.com / test1234</code>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'pending@example.com', password: 'test1234' })}
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">공천 확정 X:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">pending@example.com / test1234</code>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@example.com', password: 'test1234' })}
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">중앙당 관리자:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">admin@example.com / test1234</code>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@chamchi.kr', password: 'test1234' })}
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">슈퍼 관리자:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">admin@chamchi.kr / test1234</code>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'vendor@example.com', password: 'test1234' })}
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">인쇄업체:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">vendor@example.com / test1234</code>
              </button>
            </div>
            <p className="text-xs text-muted-foreground/70 text-center mt-2">
              클릭하면 계정 정보가 자동으로 입력됩니다
            </p>
          </div>

          {/* 공천 신청 안내 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              아직 공천을 받지 않으셨나요?{' '}
              <a
                href="https://apply.chamchi.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                공천 신청하기
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 개혁신당. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
