'use client'

import { FileTextOutlined, FormOutlined, CheckCircleOutlined, CalendarOutlined, RightOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function DocumentsPage() {
  const documentSections = [
    {
      href: '/guides/documents/preliminary',
      icon: FormOutlined,
      title: '예비후보자 등록 서류',
      description: '선거일 120일 전부터 등록 가능',
      deadline: '2026.02.06~',
      documents: ['예비후보자등록신청서', '기탁금 영수증', '재산신고서', '병역신고서', '전과기록 조회동의서']
    },
    {
      href: '/guides/documents/registration',
      icon: FileTextOutlined,
      title: '후보자 등록 서류',
      description: '선거일 23일 전까지 등록',
      deadline: '~2026.05.15',
      documents: ['후보자등록신청서', '기탁금 영수증', '정당추천서', '선거공약서', '재산신고서']
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">서류 가이드</h1>
          <p className="text-sm text-muted-foreground">
            선관위 예비후보자 및 후보자 등록에 필요한 서류를 안내합니다.
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            공천 확정 완료 - 선관위 등록 서류 준비 단계
          </span>
        </div>

        {/* Document Sections */}
        <div className="space-y-4 mb-8">
          {documentSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block"
            >
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <section.icon className="text-3xl text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {section.title}
                      </h3>
                      <RightOutlined className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarOutlined className="text-primary" />
                      <span className="text-sm font-medium text-primary">{section.deadline}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {section.documents.map((doc) => (
                        <span key={doc} className="px-2 py-1 bg-accent text-xs text-muted-foreground rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-base font-bold text-foreground mb-4">등록 일정</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-6">
              <div className="relative flex items-start gap-4 pl-10">
                <div className="absolute left-2.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">예비후보자 등록 시작</p>
                  <p className="text-xs text-muted-foreground">2026.02.06 (선거일 120일 전)</p>
                </div>
              </div>
              <div className="relative flex items-start gap-4 pl-10">
                <div className="absolute left-2.5 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">후보자 등록 기간</p>
                  <p className="text-xs text-muted-foreground">2026.05.14~15 (선거일 23~22일 전)</p>
                </div>
              </div>
              <div className="relative flex items-start gap-4 pl-10">
                <div className="absolute left-2.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">제9회 지방선거</p>
                  <p className="text-xs text-muted-foreground">2026.06.03 (투표일)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircleOutlined className="text-xl text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                서류 준비 팁
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 모든 서류는 제출 전 여러 부 복사해두세요</li>
                <li>• 제출 기한을 미리 확인하고 여유있게 준비하세요</li>
                <li>• 불확실한 사항은 선관위(02-2171-0145)에 문의하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
