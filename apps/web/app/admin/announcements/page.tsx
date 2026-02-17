'use client'

import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined, PushpinOutlined, SendOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Announcement {
  key: string
  id: string
  title: string
  content: string
  priority: 'urgent' | 'important' | 'normal'
  targetGroup: string
  isPinned: boolean
  status: 'published' | 'draft' | 'scheduled'
  publishedAt: string
  author: string
}

const mockAnnouncements: Announcement[] = [
  {
    key: '1',
    id: 'ann_001',
    title: '[긴급] 서류 제출 마감일 안내',
    content: '예비후보 등록 서류 제출 마감일이 2월 15일입니다.',
    priority: 'urgent',
    targetGroup: '전체 후보자',
    isPinned: true,
    status: 'published',
    publishedAt: '2024-01-20 09:00',
    author: '중앙당 사무국'
  },
  {
    key: '2',
    id: 'ann_002',
    title: '공보물 제작 가이드라인 업데이트',
    content: '새로운 공보물 제작 가이드라인이 업데이트되었습니다.',
    priority: 'important',
    targetGroup: '전체 후보자',
    isPinned: true,
    status: 'published',
    publishedAt: '2024-01-19 14:30',
    author: '홍보팀'
  },
  {
    key: '3',
    id: 'ann_003',
    title: '캠페인 활동 우수 사례 공유',
    content: '이번 주 캠페인 활동 우수 사례를 공유드립니다.',
    priority: 'normal',
    targetGroup: '전체 후보자',
    isPinned: false,
    status: 'published',
    publishedAt: '2024-01-18 11:00',
    author: '전략팀'
  },
  {
    key: '4',
    id: 'ann_004',
    title: '시스템 정기 점검 안내',
    content: '1월 25일 새벽 2시~4시 시스템 정기 점검이 예정되어 있습니다.',
    priority: 'normal',
    targetGroup: '전체 후보자',
    isPinned: false,
    status: 'scheduled',
    publishedAt: '2024-01-24 18:00 (예정)',
    author: '운영팀'
  },
  {
    key: '5',
    id: 'ann_005',
    title: '서울 지역 후보자 간담회',
    content: '서울 지역 후보자 대상 온라인 간담회를 개최합니다.',
    priority: 'important',
    targetGroup: '서울 지역',
    isPinned: false,
    status: 'draft',
    publishedAt: '-',
    author: '지역협력팀'
  }
]

export default function AdminAnnouncementsPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredData = mockAnnouncements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityBadge = (priority: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      urgent: { bg: 'bg-red-100', text: 'text-red-700', label: '긴급' },
      important: { bg: 'bg-orange-100', text: 'text-orange-700', label: '중요' },
      normal: { bg: 'bg-gray-100', text: 'text-gray-600', label: '일반' }
    }
    const config = configs[priority]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      published: { bg: 'bg-green-100', text: 'text-green-700', label: '게시됨' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: '임시저장' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: '예약됨' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">공지사항</h1>
            <p className="text-sm text-muted-foreground">후보자에게 전달할 공지사항을 관리합니다</p>
          </div>
          <Link href="/admin/announcements/new">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <PlusOutlined /> 새 공지 작성
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="제목 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 중요도</option>
              <option value="urgent">긴급</option>
              <option value="important">중요</option>
              <option value="normal">일반</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="published">게시됨</option>
              <option value="draft">임시저장</option>
              <option value="scheduled">예약됨</option>
            </select>
          </div>

          {/* Announcements List */}
          <div className="space-y-3">
            {filteredData.map((announcement) => (
              <div
                key={announcement.key}
                className={`p-4 border rounded-lg hover:shadow-sm transition-all ${
                  announcement.isPinned ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.isPinned && (
                        <PushpinOutlined className="text-primary" />
                      )}
                      <BellOutlined className="text-muted-foreground" />
                      <h3 className="font-medium text-foreground truncate">{announcement.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{announcement.content}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {getPriorityBadge(announcement.priority)}
                      {getStatusBadge(announcement.status)}
                      <span className="text-xs text-muted-foreground">• {announcement.targetGroup}</span>
                      <span className="text-xs text-muted-foreground">• {announcement.author}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{announcement.publishedAt}</span>
                    <div className="flex gap-1">
                      {announcement.status === 'draft' && (
                        <button className="p-1.5 text-primary hover:text-primary/80 transition-colors" title="발송">
                          <SendOutlined />
                        </button>
                      )}
                      <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="수정">
                        <EditOutlined />
                      </button>
                      <button className="p-1.5 text-red-500 hover:text-red-600 transition-colors" title="삭제">
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-sm text-muted-foreground">
            총 {filteredData.length}건
          </div>
        </div>
      </div>
    </div>
  )
}
