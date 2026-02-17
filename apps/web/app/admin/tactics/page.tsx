'use client'

import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SoundOutlined, EnvironmentOutlined, CalendarOutlined, TeamOutlined, SendOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Tactic {
  key: string
  id: string
  title: string
  description: string
  type: 'location' | 'timing' | 'method' | 'general'
  targetRegion: string
  targetGroup: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'scheduled' | 'expired' | 'draft'
  startDate: string
  endDate: string
  createdBy: string
}

const mockTactics: Tactic[] = [
  {
    key: '1',
    id: 'tac_001',
    title: '오후 5시 지하철역 출구 집중 유세',
    description: '퇴근 시간대 지하철 역사 출구에서의 명함 배포 집중 권장. 특히 2호선 역사 우선.',
    type: 'location',
    targetRegion: '서울 전역',
    targetGroup: '서울 지역 후보자',
    priority: 'high',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-02-15',
    createdBy: '전략기획팀'
  },
  {
    key: '2',
    id: 'tac_002',
    title: '전통시장 장날 집중 방문',
    description: '지역별 전통시장 장날에 맞춰 시장 방문 및 상인 인사 권장.',
    type: 'timing',
    targetRegion: '전국',
    targetGroup: '전체 후보자',
    priority: 'high',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-01',
    createdBy: '전략기획팀'
  },
  {
    key: '3',
    id: 'tac_003',
    title: '경로당/복지관 오전 방문 권장',
    description: '어르신 계층 접촉을 위해 오전 10시~12시 사이 경로당 및 복지관 방문 권장.',
    type: 'method',
    targetRegion: '전국',
    targetGroup: '전체 후보자',
    priority: 'medium',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-06-01',
    createdBy: '전략기획팀'
  },
  {
    key: '4',
    id: 'tac_004',
    title: '설 연휴 귀성객 대상 유세',
    description: '설 연휴 기간 고속버스터미널, 기차역 등에서 귀성객 대상 인사 캠페인.',
    type: 'timing',
    targetRegion: '전국',
    targetGroup: '전체 후보자',
    priority: 'high',
    status: 'scheduled',
    startDate: '2024-02-08',
    endDate: '2024-02-12',
    createdBy: '전략기획팀'
  },
  {
    key: '5',
    id: 'tac_005',
    title: '대학가 점심시간 유세 가이드',
    description: '대학가 주변 점심시간(11:30~13:30) 청년층 대상 명함 배포 및 인사.',
    type: 'location',
    targetRegion: '전국 대학가',
    targetGroup: '대학가 인근 후보자',
    priority: 'medium',
    status: 'draft',
    startDate: '-',
    endDate: '-',
    createdBy: '청년위원회'
  }
]

export default function AdminTacticsPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredData = mockTactics.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const activeCount = mockTactics.filter(t => t.status === 'active').length

  const getTypeBadge = (type: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      location: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <EnvironmentOutlined />, label: '장소' },
      timing: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <CalendarOutlined />, label: '시간대' },
      method: { bg: 'bg-green-100', text: 'text-green-700', icon: <TeamOutlined />, label: '방법' },
      general: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <SoundOutlined />, label: '일반' }
    }
    const config = configs[type]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded inline-flex items-center gap-1 ${config.bg} ${config.text}`}>
        {config.icon} {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      high: { bg: 'bg-red-100', text: 'text-red-700', label: '높음' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: '보통' },
      low: { bg: 'bg-gray-100', text: 'text-gray-600', label: '낮음' }
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
      active: { bg: 'bg-green-100', text: 'text-green-700', label: '진행중' },
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: '예정' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-500', label: '종료' },
      draft: { bg: 'bg-amber-100', text: 'text-amber-700', label: '초안' }
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
            <h1 className="text-2xl font-bold text-foreground mb-2">중앙 전술</h1>
            <p className="text-sm text-muted-foreground">후보자에게 배포할 캠페인 전술 가이드를 관리합니다</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
              진행중 {activeCount}건
            </span>
            <Link href="/admin/tactics/new">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                <PlusOutlined /> 새 전술 작성
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="전술 제목 또는 내용 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 유형</option>
              <option value="location">장소</option>
              <option value="timing">시간대</option>
              <option value="method">방법</option>
              <option value="general">일반</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="active">진행중</option>
              <option value="scheduled">예정</option>
              <option value="draft">초안</option>
              <option value="expired">종료</option>
            </select>
          </div>

          {/* Tactics List */}
          <div className="space-y-4">
            {filteredData.map((tactic) => (
              <div
                key={tactic.key}
                className={`p-5 border rounded-xl hover:shadow-sm transition-all ${
                  tactic.status === 'active' ? 'bg-green-50/50 border-green-200' : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <SoundOutlined className="text-primary" />
                      <h3 className="font-semibold text-foreground">{tactic.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{tactic.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {getTypeBadge(tactic.type)}
                      {getPriorityBadge(tactic.priority)}
                      {getStatusBadge(tactic.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <EnvironmentOutlined /> {tactic.targetRegion}
                      </span>
                      <span className="flex items-center gap-1">
                        <TeamOutlined /> {tactic.targetGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarOutlined /> {tactic.startDate} ~ {tactic.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">{tactic.createdBy}</span>
                    <div className="flex gap-1">
                      {tactic.status === 'draft' && (
                        <button className="p-1.5 text-primary hover:text-primary/80 transition-colors" title="배포">
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
