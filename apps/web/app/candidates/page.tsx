'use client'

import React, { useState } from 'react'
import { SearchOutlined, UserOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons'
import Navigation from '../components/Navigation'

interface Candidate {
  key: string
  id: string
  name: string
  phone: string
  district: string
  status: 'active' | 'inactive'
  mode: 'candidate' | 'preliminary'
  tasksCompleted: number
  tasksTotal: number
  credits: number
  lastActive: string
}

const mockCandidates: Candidate[] = [
  {
    key: '1',
    id: '22222222-2222-2222-2222-222222222222',
    name: '김후보',
    phone: '+821098765432',
    district: '서울 강남구 을',
    status: 'active',
    mode: 'candidate',
    tasksCompleted: 15,
    tasksTotal: 20,
    credits: 1250,
    lastActive: '2시간 전'
  },
  {
    key: '2',
    id: '33333333-3333-3333-3333-333333333333',
    name: '이예비',
    phone: '+821055556666',
    district: '부산 해운대구 갑',
    status: 'active',
    mode: 'preliminary',
    tasksCompleted: 8,
    tasksTotal: 12,
    credits: 680,
    lastActive: '1일 전'
  },
  {
    key: '3',
    id: '44444444-4444-4444-4444-444444444444',
    name: '박신인',
    phone: '+821077778888',
    district: '대구 수성구 갑',
    status: 'inactive',
    mode: 'preliminary',
    tasksCompleted: 3,
    tasksTotal: 10,
    credits: 150,
    lastActive: '1주 전'
  }
]

export default function CandidatesPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredData = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         candidate.district.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockCandidates.length,
    active: mockCandidates.filter(c => c.status === 'active').length,
    avgProgress: Math.round(mockCandidates.reduce((acc, c) => acc + (c.tasksCompleted / c.tasksTotal), 0) / mockCandidates.length * 100),
    totalCredits: mockCandidates.reduce((acc, c) => acc + c.credits, 0)
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">캠페인 관리 콘솔</h1>
          <p className="text-sm text-muted-foreground">후보자 현황을 확인하고 관리하세요</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-medium">전체 후보자</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-medium">활성 후보자</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.active}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-medium">평균 진행률</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{stats.avgProgress}%</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-medium">총 크레딧</p>
            <p className="text-2xl font-bold text-primary mt-2">{stats.totalCredits.toLocaleString()}</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground">후보자 목록</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
                <ExportOutlined /> 내보내기
              </button>
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                새 후보자 추가
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-sm">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="이름 또는 선거구 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
            <button className="px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
              <FilterOutlined /> 고급 필터
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">이름</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">선거구</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">모드</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">진행률</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">크레딧</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">마지막 활동</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((candidate) => (
                  <tr key={candidate.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <UserOutlined className="text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{candidate.district}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        candidate.mode === 'candidate'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {candidate.mode === 'candidate' ? '후보자' : '예비후보'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-foreground">{candidate.tasksCompleted}/{candidate.tasksTotal}</span>
                        <div className="w-20 h-1 bg-accent rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(candidate.tasksCompleted / candidate.tasksTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-amber-600">{candidate.credits.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        candidate.status === 'active'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {candidate.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{candidate.lastActive}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          상세보기
                        </button>
                        <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          메시지
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
            총 {filteredData.length}명
          </div>
        </div>
      </div>
    </div>
  )
}
