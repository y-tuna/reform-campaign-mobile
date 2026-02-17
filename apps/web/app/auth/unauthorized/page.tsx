'use client'

import Link from 'next/link'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 상단 헤더 */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/reform-party-logo.png"
              alt="개혁신당 로고"
              width={32}
              height={32}
            />
            <span className="text-sm font-medium text-muted-foreground">
              홈으로 돌아가기
            </span>
          </Link>
        </div>
      </header>

      {/* 메인 영역 */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
              <ExclamationCircleOutlined className="text-4xl text-primary" />
            </div>
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-bold text-foreground mb-3">
            이용 권한이 없습니다
          </h1>

          {/* 설명 */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            유세 비서는 개혁신당 공천 시스템을 통해<br />
            <span className="font-semibold text-foreground">공천 확정된 후보자</span>만 이용할 수 있습니다.
          </p>

          {/* 안내 카드 */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6 text-left">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              서비스 이용을 위해 확인해주세요
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>공천 신청이 완료되었는지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>공천 심사가 진행 중인 경우 결과를 기다려주세요</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>공천 확정 후 자동으로 이용이 가능해집니다</span>
              </li>
            </ul>
          </div>

          {/* 버튼 그룹 */}
          <div className="space-y-3">
            <a
              href="https://apply.chamchi.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              공천 신청하러 가기
            </a>
            <Link
              href="/auth/login"
              className="block w-full py-3 px-4 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
            >
              다른 계정으로 로그인
            </Link>
          </div>

          {/* 문의 안내 */}
          <div className="mt-8 p-4 bg-muted/30 border border-border rounded-lg">
            <p className="text-xs text-muted-foreground">
              공천 관련 문의사항이 있으시면<br />
              <a href="mailto:support@reformparty.kr" className="text-primary hover:underline">
                support@reformparty.kr
              </a>
              로 연락해주세요.
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
