'use client'

import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, NotificationOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Broadcast {
  key: string
  id: string
  title: string
  category: string
  recipients: string
  readCount: number
  totalRecipients: number
  status: 'sent' | 'draft'
  sentAt: string
}

const mockBroadcasts: Broadcast[] = [
  {
    key: '1',
    id: 'bc_001',
    title: '서류 제출 마감 안내',
    category: '중요',
    recipients: '전체 후보자',
    readCount: 18,
    totalRecipients: 24,
    status: 'sent',
    sentAt: '2024-01-20 14:30'
  },
  {
    key: '2',
    id: 'bc_002',
    title: '캠페인 가이드라인 업데이트',
    category: '일반',
    recipients: '전체 후보자',
    readCount: 15,
    totalRecipients: 24,
    status: 'sent',
    sentAt: '2024-01-18 10:00'
  },
  {
    key: '3',
    id: 'bc_003',
    title: '시스템 점검 완료 안내',
    category: '공지',
    recipients: '전체 후보자',
    readCount: 22,
    totalRecipients: 24,
    status: 'sent',
    sentAt: '2024-01-15 16:45'
  },
  {
    key: '4',
    id: 'bc_004',
    title: '신규 교육 자료 업로드',
    category: '일반',
    recipients: '활성 후보자',
    readCount: 0,
    totalRecipients: 18,
    status: 'draft',
    sentAt: '-'
  }
]

export default function AdminBroadcastsPage() {
  const [searchText, setSearchText] = useState('')

  const filteredData = mockBroadcasts.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  )

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      '중요': { bg: 'bg-red-100', text: 'text-red-700' },
      '일반': { bg: 'bg-blue-100', text: 'text-blue-700' },
      '공지': { bg: 'bg-green-100', text: 'text-green-700' }
    }
    const color = colors[category] || { bg: 'bg-gray-100', text: 'text-gray-600' }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${color.bg} ${color.text}`}>
        {category}
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
            <h1 className="text-2xl font-bold text-foreground mb-2">공지사항 관리</h1>
            <p className="text-sm text-muted-foreground">후보자에게 전달할 공지사항을 관리합니다</p>
          </div>
          <Link href="/admin/broadcasts/new">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <PlusOutlined /> 새 공지 작성
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="제목 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">제목</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">분류</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">수신 대상</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">읽음/전체</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">발송 시간</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((broadcast) => (
                  <tr key={broadcast.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <NotificationOutlined className="text-primary" />
                        <span className="font-medium text-foreground">{broadcast.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getCategoryBadge(broadcast.category)}</td>
                    <td className="py-3 px-4">{broadcast.recipients}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium">{broadcast.readCount}</span>
                        <span className="text-muted-foreground"> / {broadcast.totalRecipients}</span>
                        <div className="w-20 h-1 bg-accent rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(broadcast.readCount / broadcast.totalRecipients) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        broadcast.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {broadcast.status === 'sent' ? '발송완료' : '임시저장'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{broadcast.sentAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <EditOutlined />
                        </button>
                        <button className="p-1.5 text-red-500 hover:text-red-600 transition-colors">
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-sm text-muted-foreground">
            총 {filteredData.length}개
          </div>
        </div>
      </div>
    </div>
  )
}
