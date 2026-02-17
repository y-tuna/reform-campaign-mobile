'use client'

import React, { useState } from 'react'
import { CheckSquareOutlined, CalendarOutlined, LinkOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface ChecklistItem {
  id: string
  title: string
  description?: string
  tag?: string
  tagColor?: string
  link?: string
}

interface ChecklistSection {
  title: string
  items: ChecklistItem[]
}

// 예비후보자 체크리스트
const preliminaryChecklist: ChecklistSection[] = [
  {
    title: '예비후보자 등록',
    items: [
      { id: 'p1', title: '예비후보자 등록신청서 작성', tag: '필수', tagColor: 'orange', description: '선관위 양식 사용' },
      { id: 'p2', title: '기탁금 납부', tag: '필수', tagColor: 'orange', description: '선거별 기탁금 확인' },
      { id: 'p3', title: '후보자 사진 촬영', tag: '권장', tagColor: 'blue', description: '규격: 가로 5cm × 세로 7cm' },
      { id: 'p4', title: '학력·경력 증빙서류 준비', description: '졸업증명서, 경력증명서 등' },
    ]
  },
  {
    title: '캠페인 준비',
    items: [
      { id: 'p5', title: '명함 제작', description: '규격: 9cm × 5cm 이내', link: '/campaign-shop' },
      { id: 'p6', title: '어깨띠 제작', link: '/campaign-shop', description: '예비후보자 표시' },
      { id: 'p7', title: '선거사무소 설치', description: '1개소만 가능' },
      { id: 'p8', title: '선거사무원 선임', description: '정수 범위 내' },
    ]
  },
  {
    title: '공천 관련',
    items: [
      { id: 'p9', title: '공천 신청서 제출', tag: '완료', tagColor: 'green' },
      { id: 'p10', title: '공천 면접', tag: '완료', tagColor: 'green' },
      { id: 'p11', title: '공천 확정 통보', tag: '완료', tagColor: 'green' },
    ]
  }
]

// 후보자 체크리스트
const candidateChecklist: ChecklistSection[] = [
  {
    title: '후보자 등록',
    items: [
      { id: 'c1', title: '후보자등록신청서 작성', tag: '필수', tagColor: 'orange', description: '선관위 양식 사용' },
      { id: 'c2', title: '정당추천서 수령', tag: '필수', tagColor: 'orange', description: '개혁신당 중앙당 발급' },
      { id: 'c3', title: '기탁금 납부', tag: '필수', tagColor: 'orange', description: '선거별 기탁금 확인' },
      { id: 'c4', title: '재산신고서 제출', description: '본인 및 배우자' },
      { id: 'c5', title: '병역신고서 제출', description: '남성 후보자' },
    ]
  },
  {
    title: '선거운동 준비',
    items: [
      { id: 'c6', title: '공보물 제작', description: '선관위 규격 준수', link: '/campaign-shop' },
      { id: 'c7', title: '현수막 제작', description: '수량 제한 확인', link: '/campaign-shop' },
      { id: 'c8', title: '선거운동원 교육', description: '선거법 준수 교육' },
      { id: 'c9', title: '유세 일정 계획', description: '확성기 사용 시간 확인' },
    ]
  },
  {
    title: '선거 당일',
    items: [
      { id: 'c10', title: '투표 참관인 배치', description: '투표소별 1명' },
      { id: 'c11', title: '개표 참관인 배치', description: '개표소별 2명' },
      { id: 'c12', title: '선거사무소 운영', description: '개표 현황 모니터링' },
    ]
  }
]

// 주요 일정
const keyDates = [
  { title: '예비후보자 등록', date: '선거일 120일전부터', highlight: true },
  { title: '후보자 등록', date: '선거일 24~21일', highlight: false },
  { title: '공식 선거운동 시작', date: '선거일 14일', highlight: false },
  { title: '선거일', date: 'D-Day', highlight: false },
]

// 관련 링크
const relatedLinks = [
  { title: '서류 제출 가이드', href: '/documents' },
  { title: '공보물 제작', href: '/campaign-shop' },
  { title: '유세용품 구매', href: '/campaign-shop' },
  { title: '선거법 Q&A', href: '/guides/election-law' },
]

export default function ChecklistPage() {
  const [activeTab, setActiveTab] = useState<'preliminary' | 'candidate'>('preliminary')
  const [checkedItems, setCheckedItems] = useState<string[]>(['p9', 'p10', 'p11'])

  const currentChecklist = activeTab === 'preliminary' ? preliminaryChecklist : candidateChecklist
  const totalItems = currentChecklist.reduce((acc, section) => acc + section.items.length, 0)
  const checkedCount = currentChecklist.reduce((acc, section) =>
    acc + section.items.filter(item => checkedItems.includes(item.id)).length, 0
  )
  const progressPercent = Math.round((checkedCount / totalItems) * 100)

  const handleCheck = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getTagClasses = (color?: string) => {
    switch (color) {
      case 'orange':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'blue':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'green':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/guides" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">유세 체크리스트</h1>
          <p className="text-sm text-muted-foreground">
            시기별 해야 할 일을 확인하고 체크하세요.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('preliminary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preliminary'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            예비후보자
          </button>
          <button
            onClick={() => setActiveTab('candidate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'candidate'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            후보자
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist */}
          <div className="lg:col-span-2 space-y-4">
            {currentChecklist.map((section, sectionIndex) => {
              const sectionChecked = section.items.filter(item => checkedItems.includes(item.id)).length
              return (
                <div key={sectionIndex} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
                    <span className="text-sm text-muted-foreground">{sectionChecked}/{section.items.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`px-5 py-4 flex items-start gap-3 hover:bg-accent/30 transition-colors ${
                          checkedItems.includes(item.id) ? 'bg-accent/20' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(item.id)}
                          onChange={() => handleCheck(item.id)}
                          className="w-5 h-5 rounded border-border mt-0.5 accent-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium ${checkedItems.includes(item.id) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {item.title}
                            </span>
                            {item.tag && (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getTagClasses(item.tagColor)}`}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                        {item.link && (
                          <Link
                            href={item.link}
                            className="text-xs text-primary hover:text-primary/80 font-medium flex-shrink-0"
                          >
                            바로가기
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Progress */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 text-center">전체 진행률</h3>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-accent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${progressPercent * 2.51} 251`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{checkedCount}/{totalItems}</strong> 완료
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTab === 'preliminary' ? '예비후보자' : '후보자'} 체크리스트
                </p>
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarOutlined className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">주요 일정</h3>
              </div>
              <div className="space-y-3">
                {keyDates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {date.highlight && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                      <span className={`text-sm ${date.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {date.title}
                      </span>
                    </div>
                    <span className={`text-xs ${date.highlight ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {date.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <LinkOutlined className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">관련 링크</h3>
              </div>
              <div className="space-y-2">
                {relatedLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    • {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
