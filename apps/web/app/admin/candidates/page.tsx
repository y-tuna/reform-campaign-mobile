'use client'

import React, { useState } from 'react'
import { SearchOutlined, UserOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, EyeOutlined, FireOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface Candidate {
  key: string
  id: string
  name: string
  region: string
  district: string
  phone: string
  email: string
  status: 'active' | 'pending' | 'inactive'
  activityScore: number
  totalActivities: number
  lastActiveAt: string
}

const mockCandidates: Candidate[] = [
  {
    key: '1',
    id: 'cand_001',
    name: '김철수',
    region: '서울특별시',
    district: '강남구',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    status: 'active',
    activityScore: 2840,
    totalActivities: 142,
    lastActiveAt: '2024-01-20 14:30'
  },
  {
    key: '2',
    id: 'cand_002',
    name: '이영희',
    region: '경기도',
    district: '수원시 영통구',
    phone: '010-2345-6789',
    email: 'lee@example.com',
    status: 'active',
    activityScore: 2650,
    totalActivities: 128,
    lastActiveAt: '2024-01-20 13:15'
  },
  {
    key: '3',
    id: 'cand_003',
    name: '박민수',
    region: '부산광역시',
    district: '해운대구',
    phone: '010-3456-7890',
    email: 'park@example.com',
    status: 'active',
    activityScore: 2480,
    totalActivities: 115,
    lastActiveAt: '2024-01-20 11:45'
  },
  {
    key: '4',
    id: 'cand_004',
    name: '정수연',
    region: '인천광역시',
    district: '남동구',
    phone: '010-4567-8901',
    email: 'jung@example.com',
    status: 'pending',
    activityScore: 0,
    totalActivities: 0,
    lastActiveAt: '-'
  },
  {
    key: '5',
    id: 'cand_005',
    name: '최동욱',
    region: '대구광역시',
    district: '수성구',
    phone: '010-5678-9012',
    email: 'choi@example.com',
    status: 'active',
    activityScore: 2180,
    totalActivities: 97,
    lastActiveAt: '2024-01-20 10:00'
  },
  {
    key: '6',
    id: 'cand_006',
    name: '강미영',
    region: '광주광역시',
    district: '서구',
    phone: '010-6789-0123',
    email: 'kang@example.com',
    status: 'inactive',
    activityScore: 850,
    totalActivities: 32,
    lastActiveAt: '2024-01-15 09:30'
  }
]

export default function AdminCandidatesPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')

  const filteredData = mockCandidates.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.district.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesRegion = regionFilter === 'all' || item.region === regionFilter
    return matchesSearch && matchesStatus && matchesRegion
  })

  const regions = [...new Set(mockCandidates.map(c => c.region))]

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: '활동 중' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '대기' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: '비활성' }
    }
    const config = configs[status]
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const totalCandidates = mockCandidates.length
  const activeCandidates = mockCandidates.filter(c => c.status === 'active').length

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">후보자 관리</h1>
            <p className="text-sm text-muted-foreground">전체 후보자 현황을 확인하고 관리합니다</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">전체 </span>
              <span className="text-lg font-bold text-foreground">{totalCandidates}</span>
              <span className="text-sm text-muted-foreground">명</span>
            </div>
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-sm text-green-600">활동 중 </span>
              <span className="text-lg font-bold text-green-700">{activeCandidates}</span>
              <span className="text-sm text-green-600">명</span>
            </div>
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
                placeholder="후보자명 또는 지역구 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 지역</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">전체 상태</option>
              <option value="active">활동 중</option>
              <option value="pending">대기</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">후보자</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">지역구</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">연락처</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">활동 점수</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">총 활동</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">최근 활동</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((candidate) => (
                  <tr key={candidate.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserOutlined className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <EnvironmentOutlined className="text-muted-foreground text-xs" />
                        <div>
                          <p className="text-foreground">{candidate.district}</p>
                          <p className="text-xs text-muted-foreground">{candidate.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <PhoneOutlined className="text-muted-foreground text-xs" />
                        <span className="text-muted-foreground">{candidate.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(candidate.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <FireOutlined className={candidate.activityScore > 2000 ? 'text-orange-500' : 'text-muted-foreground'} />
                        <span className="font-medium text-foreground">{candidate.activityScore.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{candidate.totalActivities}건</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{candidate.lastActiveAt}</td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/candidates/${candidate.id}`}>
                        <button className="p-1.5 text-primary hover:text-primary/80 transition-colors">
                          <EyeOutlined />
                        </button>
                      </Link>
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
