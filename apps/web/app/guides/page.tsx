'use client'

import { BookOutlined, CheckSquareOutlined, PlayCircleOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function GuidesPage() {
  const guides = [
    {
      href: '/guides/election-law',
      icon: <BookOutlined className="text-4xl text-primary" />,
      title: '선거법 Q&A',
      description: '선거운동, 기부행위, 공보물 등 자주 묻는 질문'
    },
    {
      href: '/guides/checklist',
      icon: <CheckSquareOutlined className="text-4xl text-primary" />,
      title: '유세 체크리스트',
      description: '예비후보자/후보자 시기별 준비사항'
    },
    {
      href: '/guides/education',
      icon: <PlayCircleOutlined className="text-4xl text-primary" />,
      title: '후보자 교육',
      description: '당 자체 교육 콘텐츠 및 매너 가이드'
    },
    {
      href: '/guides/documents',
      icon: <FileTextOutlined className="text-4xl text-primary" />,
      title: '서류 가이드',
      description: '후보자 등록 및 제출 서류 안내'
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">가이드라인</h1>
          <p className="text-sm text-muted-foreground">
            선거 캠페인에 필요한 법률, 규정, 교육 자료를 확인하세요
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block"
            >
              <div className="bg-card border border-border rounded-xl p-8 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-xl text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                가이드 활용 팁
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 선거법 Q&A는 실제 사례 기반으로 작성되었습니다</li>
                <li>• 체크리스트를 활용하여 빠짐없이 준비하세요</li>
                <li>• 교육 콘텐츠는 수시로 업데이트됩니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* External Resources */}
        <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            외부 자료
          </h3>
          <div className="space-y-2">
            <a
              href="https://www.nec.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:text-primary/80 transition-colors"
            >
              • 중앙선거관리위원회 - 공식 선거법 안내 및 양식
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
