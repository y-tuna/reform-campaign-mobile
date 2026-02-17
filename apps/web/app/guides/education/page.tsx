'use client'

import { PlayCircleOutlined, FileTextOutlined, InfoCircleOutlined, BookOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function EducationPage() {
  const educationModules = [
    {
      id: 1,
      title: '선거법 기초',
      type: '영상',
      duration: '25분',
      description: '선거운동, 기부행위, 공보물 규정 등 필수 선거법 이해',
      topics: ['선거운동 제한', '기부행위 금지', '공보물 규격', '온라인 선거운동'],
      required: true
    },
    {
      id: 2,
      title: '명함 전달 매너',
      type: '영상',
      duration: '15분',
      description: '효과적이고 예의바른 명함 전달 방법',
      topics: ['명함 전달 시 자세', '인사말 멘트', '금지사항', '실전 연습'],
      required: true
    },
    {
      id: 3,
      title: '유세 톤앤매너',
      type: '영상',
      duration: '20분',
      description: '개혁신당의 유세 스타일과 커뮤니케이션 가이드',
      topics: ['당의 이미지', '말투와 태도', '복장 가이드', '금지 표현'],
      required: true
    },
    {
      id: 4,
      title: '거리 유세 노하우',
      type: '영상',
      duration: '30분',
      description: '거리 유세 시 주의사항과 효과적인 방법',
      topics: ['장소 선정', '시간대 전략', '확성기 사용법', '주민 응대'],
      required: false
    },
    {
      id: 5,
      title: '언론 인터뷰 대응',
      type: '문서',
      duration: undefined,
      description: '언론 인터뷰 시 준비사항과 답변 요령',
      topics: ['인터뷰 전 준비', '핵심 메시지', '위기 대응', 'NG 발언'],
      required: false
    },
    {
      id: 6,
      title: 'SNS 활용 가이드',
      type: '문서',
      duration: undefined,
      description: '소셜미디어를 통한 효과적인 선거운동',
      topics: ['플랫폼별 전략', '콘텐츠 기획', '댓글 관리', '악성 댓글 대응'],
      required: false
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/guides" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 가이드라인
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">후보자 교육</h1>
          <p className="text-sm text-muted-foreground">
            당 자체 교육 콘텐츠로 효과적인 캠페인을 준비하세요
          </p>
        </div>

        {/* Info Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-xl text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                교육 이수 안내
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 필수 교육(선거법 기초, 명함 전달 매너, 유세 톤앤매너)은 반드시 이수해주세요</li>
                <li>• 교육 영상은 언제든지 다시 볼 수 있습니다</li>
                <li>• 추가 교육 콘텐츠는 계속 업데이트됩니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Modules */}
        <div className="space-y-4">
          {educationModules.map((module) => (
            <div
              key={module.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {module.type === '영상' ? (
                    <PlayCircleOutlined className="text-2xl text-primary mt-0.5" />
                  ) : (
                    <FileTextOutlined className="text-2xl text-primary mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {module.title}
                      </h3>
                      {module.required && (
                        <span className="px-2 py-0.5 bg-danger/10 text-danger text-xs font-medium rounded border border-danger/20">
                          필수
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-accent text-muted-foreground text-xs rounded">
                        {module.type}
                      </span>
                      {module.duration && (
                        <span className="text-xs text-muted-foreground">
                          {module.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {module.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent text-xs text-muted-foreground rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0 ml-4">
                  {module.type === '영상' ? '영상 보기' : '문서 보기'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <BookOutlined className="text-xl text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                추가 학습 자료
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <Link href="/guides/election-law" className="text-primary hover:text-primary/80 transition-colors">
                    • 선거법 Q&A - 자주 묻는 선거법 질문
                  </Link>
                </li>
                <li>
                  <Link href="/guides/checklist" className="text-primary hover:text-primary/80 transition-colors">
                    • 유세 체크리스트 - 단계별 준비사항
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="text-primary hover:text-primary/80 transition-colors">
                    • 서류 가이드 - 필요 서류 목록 및 양식
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            교육 문의
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-foreground">개혁신당 교육위원회</strong></p>
            <p>전화: 02-785-2012</p>
            <p>이메일: education@reform.kr</p>
            <p>운영시간: 평일 09:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
