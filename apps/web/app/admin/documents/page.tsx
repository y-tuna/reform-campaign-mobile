'use client'

import React, { useState } from 'react'
import { SearchOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons'
import Navigation from '../../components/Navigation'

interface Document {
  key: string
  id: string
  candidateName: string
  documentType: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt: string
  reviewer: string
}

const mockDocuments: Document[] = [
  {
    key: '1',
    id: 'doc_001',
    candidateName: '김후보',
    documentType: '신분증명서',
    status: 'pending',
    submittedAt: '2024-01-20 10:30',
    reviewedAt: '-',
    reviewer: '-'
  },
  {
    key: '2',
    id: 'doc_002',
    candidateName: '이예비',
    documentType: '경력증명서',
    status: 'approved',
    submittedAt: '2024-01-19 14:20',
    reviewedAt: '2024-01-19 15:30',
    reviewer: '관리자'
  },
  {
    key: '3',
    id: 'doc_003',
    candidateName: '박신인',
    documentType: '학력증명서',
    status: 'rejected',
    submittedAt: '2024-01-19 09:15',
    reviewedAt: '2024-01-19 11:00',
    reviewer: '관리자'
  },
  {
    key: '4',
    id: 'doc_004',
    candidateName: '김후보',
    documentType: '재산신고서',
    status: 'pending',
    submittedAt: '2024-01-20 11:45',
    reviewedAt: '-',
    reviewer: '-'
  }
]

export default function AdminDocumentsPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredData = mockDocuments.filter(item => {
    const matchesSearch = item.candidateName.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.documentType.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = mockDocuments.filter(d => d.status === 'pending').length

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '검토 대기' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '승인' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '반려' }
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
            <h1 className="text-2xl font-bold text-foreground mb-2">서류 관리</h1>
            <p className="text-sm text-muted-foreground">후보자가 제출한 서류를 검토합니다</p>
          </div>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">
              검토 대기 {pendingCount}건
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 md:max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="후보자명 또는 서류 유형 검색"
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
              <option value="pending">검토 대기</option>
              <option value="approved">승인</option>
              <option value="rejected">반려</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">후보자</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">서류 유형</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">제출 시간</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">검토 시간</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">검토자</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((doc) => (
                  <tr key={doc.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{doc.candidateName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-primary" />
                        <span>{doc.documentType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.submittedAt}</td>
                    <td className="py-3 px-4 text-muted-foreground">{doc.reviewedAt}</td>
                    <td className="py-3 px-4">{doc.reviewer}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <EyeOutlined />
                        </button>
                        {doc.status === 'pending' && (
                          <>
                            <button className="p-1.5 text-green-600 hover:text-green-700 transition-colors">
                              <CheckCircleOutlined />
                            </button>
                            <button className="p-1.5 text-red-500 hover:text-red-600 transition-colors">
                              <CloseCircleOutlined />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
