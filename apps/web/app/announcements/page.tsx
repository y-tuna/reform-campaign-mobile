'use client'

import { useState } from 'react'
import { SearchOutlined, NotificationOutlined, CalendarOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../components/Navigation'

interface Announcement {
  id: number
  title: string
  content: string
  category: '중요' | '일반' | '교육' | '선거법'
  isNew: boolean
  createdAt: string
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '중앙당 주간 전술 브리핑 (12/23)',
    content: '이번 주 선거 전략 및 주요 이슈 브리핑 자료입니다. 모든 후보자분들은 필히 확인해주세요.',
    category: '중요',
    isNew: true,
    createdAt: '2024-12-23'
  },
  {
    id: 2,
    title: '선거법 주요 변경사항 안내',
    content: '2025년부터 적용되는 선거법 개정 내용을 안내드립니다. 유세 활동 시 참고해주세요.',
    category: '선거법',
    isNew: true,
    createdAt: '2024-12-22'
  },
  {
    id: 3,
    title: '유세 차량 운영 가이드 업데이트',
    content: '유세 차량 운영 관련 가이드라인이 업데이트되었습니다. 변경사항을 확인해주세요.',
    category: '일반',
    isNew: false,
    createdAt: '2024-12-20'
  },
  {
    id: 4,
    title: '후보자 필수 교육 일정 안내',
    content: '예비후보자 및 후보자 대상 필수 교육 일정을 안내드립니다.',
    category: '교육',
    isNew: false,
    createdAt: '2024-12-18'
  },
  {
    id: 5,
    title: '선거 사무소 개설 관련 안내',
    content: '선거 사무소 개설 시 필요한 서류 및 절차에 대해 안내드립니다.',
    category: '일반',
    isNew: false,
    createdAt: '2024-12-15'
  },
  {
    id: 6,
    title: '정책 자료집 배포 안내',
    content: '개혁신당 정책 자료집이 배포되었습니다. 유세 활동에 활용해주세요.',
    category: '중요',
    isNew: false,
    createdAt: '2024-12-12'
  },
  {
    id: 7,
    title: '선거운동 SNS 가이드라인',
    content: 'SNS를 활용한 선거운동 시 주의사항 및 가이드라인입니다.',
    category: '선거법',
    isNew: false,
    createdAt: '2024-12-10'
  },
  {
    id: 8,
    title: '후보자 온라인 교육 영상 업로드',
    content: '후보자 대상 온라인 교육 영상이 업로드되었습니다. 교육 자료 페이지에서 확인해주세요.',
    category: '교육',
    isNew: false,
    createdAt: '2024-12-08'
  }
]

export default function AnnouncementsPage() {
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      '중요': { bg: 'bg-red-100', text: 'text-red-700' },
      '일반': { bg: 'bg-blue-100', text: 'text-blue-700' },
      '교육': { bg: 'bg-green-100', text: 'text-green-700' },
      '선거법': { bg: 'bg-purple-100', text: 'text-purple-700' }
    }
    const color = colors[category] || { bg: 'bg-gray-100', text: 'text-gray-600' }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${color.bg} ${color.text}`}>
        {category}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/home" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            ← 돌아가기
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">중앙당 공지</h1>
            <p className="text-sm text-muted-foreground">개혁신당 중앙당에서 전달하는 공지사항입니다</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-sm">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="공지사항 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 분류</option>
              <option value="중요">중요</option>
              <option value="일반">일반</option>
              <option value="교육">교육</option>
              <option value="선거법">선거법</option>
            </select>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent rounded-lg">
                    <NotificationOutlined className="text-lg text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(announcement.category)}
                      {announcement.isNew && (
                        <span className="px-2 py-0.5 bg-danger/10 text-danger text-xs font-semibold rounded border border-danger/20">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <CalendarOutlined />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <NotificationOutlined className="text-4xl text-gray-300 mb-3" />
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </div>
          )}

          {/* Pagination Info */}
          <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
            총 {filteredAnnouncements.length}개의 공지사항
          </div>
        </div>
      </div>
    </div>
  )
}
