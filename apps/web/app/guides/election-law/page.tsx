'use client'

import React, { useState } from 'react'
import {
  SearchOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  SoundOutlined,
  GiftOutlined,
  TeamOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import ElectionLawChatbot from '../../components/ElectionLawChatbot'

interface FAQItem {
  id: string
  question: string
  answer: string
  tags: string[]
  category: string
}

const faqData: FAQItem[] = [
  // 선거운동
  {
    id: '1',
    category: 'campaign',
    question: '예비후보자로서 할 수 있는 선거운동은?',
    answer: `예비후보자는 다음과 같은 선거운동을 할 수 있습니다:

1. 명함 배부: 예비후보자 본인이 직접 주고받는 방식으로 배부 가능
2. 어깨띠 사용: 예비후보자임을 나타내는 어깨띠 착용 가능
3. 전화·문자: 선거운동 전화와 문자메시지 발송 가능 (단, 자동동보통신 제외)
4. 인터넷 홍보: 인터넷 홈페이지, SNS를 통한 선거운동 가능

※ 확성기 사용, 현수막 게시 등은 공식 선거운동 기간부터 가능합니다.`,
    tags: ['예비후보자', '명함', '어깨띠', 'SNS']
  },
  {
    id: '2',
    category: 'campaign',
    question: '선거운동 기간은 언제부터 언제까지인가요?',
    answer: `공식 선거운동 기간: 선거일 전 14일부터 선거일 전일까지

예비후보자는 예비후보자 등록일부터 일부 선거운동이 가능합니다.

• 예비후보자 활동: 예비후보자 등록일 ~ 후보자 등록일
• 공식 선거운동: 선거일 전 14일 ~ 선거일 전일

※ 선거일 당일에는 선거운동이 금지됩니다.`,
    tags: ['선거기간', '일정']
  },
  {
    id: '3',
    category: 'campaign',
    question: '확성기 사용 규정은 어떻게 되나요?',
    answer: `확성기 사용 규정:

1. 사용 가능 시간: 오전 7시 ~ 오후 10시
2. 사용 장소: 공개장소에서 합동연설회, 공개장소에서의 연설·대담
3. 출력 제한: 일정 출력 이하의 휴대용 확성기만 허용

금지 사항:
• 주거 밀집 지역에서의 과도한 소음
• 병원, 학교 주변 등 정온 구역에서의 사용 제한
• 심야시간(오후 10시 이후) 사용 금지`,
    tags: ['확성기', '유세', '소음']
  },
  // 기부행위
  {
    id: '4',
    category: 'donation',
    question: '기부행위의 정의와 제한은?',
    answer: `기부행위란?
선거구민에게 금전, 물품, 음식물, 향응, 그 밖의 재산상 이익을 제공하는 행위

금지되는 기부행위 예시:
• 경조사비 지급 (축의금, 조의금 등)
• 마을 행사 등에 금품 제공
• 후원회 명의로 기부
• 제3자를 통한 기부

허용되는 경우:
• 의례적 행위로서 통상적인 범위 내
• 직계존비속에 대한 행위
• 친목회 회칙에 따른 행위`,
    tags: ['기부행위', '금지', '제한']
  },
  {
    id: '5',
    category: 'donation',
    question: '식사 대접이 가능한가요?',
    answer: `원칙적으로 금지입니다.

선거구민에게 식사를 대접하는 것은 기부행위에 해당하여 금지됩니다.

예외 사항:
• 직계 가족에 대한 식사 대접
• 선거사무관계자(선거사무원 등)에 대한 다과 제공
• 통상적인 의례의 범위 내에서 친지·지인에 대한 식사

주의사항:
선거구민이라면 친구나 지인이라도 식사 대접 시 기부행위로 오해받을 수 있으므로 주의가 필요합니다.`,
    tags: ['식사', '기부행위', '제한']
  },
  // 공보물
  {
    id: '6',
    category: 'materials',
    question: '명함 규격과 배부 방법은?',
    answer: `명함 규격:
• 크기: 가로 9cm × 세로 5cm 이내
• 인쇄: 단면 또는 양면 가능
• 내용: 성명, 사진, 학력, 경력, 정견 등

배부 방법:
• 예비후보자/후보자 본인이 직접 주고받는 방식
• 선거사무관계자가 배부하는 것은 금지

주의사항:
• 우편 발송 금지
• 현관 문 등에 끼워두는 것 금지
• 불특정 다수에게 살포하는 것 금지`,
    tags: ['명함', '규격', '배부']
  },
  {
    id: '7',
    category: 'materials',
    question: '현수막 게시 규정은?',
    answer: `현수막 게시 규정:

1. 게시 가능 시기: 공식 선거운동 기간 (선거일 전 14일부터)
2. 수량 제한: 선거구별로 정해진 수량
3. 크기 제한: 가로 50cm × 세로 150cm 이내
4. 게시 장소: 선관위가 지정한 게시대에만 가능

금지 사항:
• 지정 장소 외 게시
• 규격 초과
• 허위 사실 기재`,
    tags: ['현수막', '규격', '게시']
  },
  // 온라인
  {
    id: '8',
    category: 'online',
    question: 'SNS 선거운동 시 주의사항은?',
    answer: `SNS 선거운동 허용 사항:
• 본인 계정에서 정책, 공약 홍보
• 지지 호소 게시물 작성
• 실시간 방송

금지 사항:
• 허위사실 유포
• 비방 게시물 작성
• 선거일 당일 선거운동

주의사항:
• 댓글, 공유 시에도 허위사실 유포 금지
• 상대 후보에 대한 근거 없는 비방 금지
• 실명 활동 권장`,
    tags: ['SNS', '인터넷', '온라인']
  },
  {
    id: '9',
    category: 'online',
    question: '유튜브/틱톡 등 영상 홍보가 가능한가요?',
    answer: `가능합니다.

인터넷을 통한 영상 홍보는 허용되며, 다음 사항을 준수해야 합니다:

허용 사항:
• 정책, 공약 소개 영상
• 유세 현장 촬영 영상
• 라이브 방송

주의사항:
• 허위사실 포함 금지
• 상대 후보 비방 금지
• 선거일 당일 새로운 영상 업로드 금지

권장 사항:
• 영상 내 출처 및 후보자 정보 명시
• 팩트 체크 후 업로드`,
    tags: ['유튜브', '영상', '홍보']
  }
]

const categories = [
  { key: 'all', label: '전체', icon: QuestionCircleOutlined },
  { key: 'campaign', label: '선거운동', icon: TeamOutlined },
  { key: 'donation', label: '기부행위', icon: GiftOutlined },
  { key: 'materials', label: '공보물', icon: FileTextOutlined },
  { key: 'online', label: '온라인', icon: SoundOutlined }
]

export default function ElectionLawPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />
      <ElectionLawChatbot />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/guides" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 가이드라인
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">선거법 Q&A</h1>
          <p className="text-sm text-muted-foreground">
            자주 묻는 선거법 관련 질문과 답변입니다.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="질문, 답변, 태그로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <cat.icon />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-base font-semibold text-foreground">
                  질문 목록 ({filteredFAQs.length}건)
                </h2>
              </div>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id}>
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        className="w-full px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-2">{faq.question}</p>
                            <div className="flex flex-wrap gap-1">
                              {faq.tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 bg-accent text-xs text-muted-foreground rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {expandedId === faq.id ? (
                            <DownOutlined className="text-muted-foreground flex-shrink-0 mt-1" />
                          ) : (
                            <RightOutlined className="text-muted-foreground flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                      {expandedId === faq.id && (
                        <div className="px-5 pb-4">
                          <div className="p-4 bg-accent/50 rounded-lg text-sm text-foreground whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">빠른 링크</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://www.nec.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:text-primary/80 transition-colors"
                >
                  • 중앙선거관리위원회
                </a>
                <a
                  href="https://www.law.go.kr/lsSc.do?section=&menuId=1&subMenuId=15&tabMenuId=81&eventGubun=060101&query=%EA%B3%B5%EC%A7%81%EC%84%A0%EA%B1%B0%EB%B2%95#undefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:text-primary/80 transition-colors"
                >
                  • 공직선거법 원문
                </a>
                <Link href="/documents" className="block text-primary hover:text-primary/80 transition-colors">
                  • 서류 양식 다운로드
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">문의처</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">중앙선거관리위원회</p>
                  <p className="text-muted-foreground">전화: 02-2171-0145</p>
                  <p className="text-muted-foreground">평일 09:00 - 18:00</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="font-medium text-foreground">개혁신당 중앙당</p>
                  <p className="text-muted-foreground">전화: 02-785-2012</p>
                  <p className="text-muted-foreground">이메일: info@reform.kr</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                ⚠️ 본 내용은 참고용이며, 정확한 법률 해석은 선거관리위원회 또는
                법률 전문가에게 문의하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
