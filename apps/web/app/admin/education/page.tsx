'use client'

import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import Navigation from '../../components/Navigation'

interface EducationMaterial {
  key: string
  id: string
  title: string
  category: string
  type: string
  views: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

const mockEducationMaterials: EducationMaterial[] = [
  {
    key: '1',
    id: 'edu_001',
    title: '선거법 기초',
    category: '법률',
    type: 'PDF',
    views: 245,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    key: '2',
    id: 'edu_002',
    title: '캠페인 전략 가이드',
    category: '전략',
    type: 'Video',
    views: 189,
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    key: '3',
    id: 'edu_003',
    title: '미디어 대응 매뉴얼',
    category: '홍보',
    type: 'PDF',
    views: 156,
    status: 'active',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15'
  },
  {
    key: '4',
    id: 'edu_004',
    title: '후보자 윤리 강령',
    category: '윤리',
    type: 'Document',
    views: 301,
    status: 'active',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  }
]

export default function AdminEducationPage() {
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const filteredData = mockEducationMaterials.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">교육 자료 관리</h1>
            <p className="text-sm text-muted-foreground">후보자를 위한 교육 자료를 관리합니다</p>
          </div>
          <button
            onClick={() => setIsModalVisible(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <PlusOutlined /> 새 자료 등록
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="제목 또는 카테고리 검색"
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">카테고리</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">유형</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">조회수</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">수정일</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((material) => (
                  <tr key={material.key} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-primary" />
                        <span className="font-medium text-foreground">{material.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {material.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        {material.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{material.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        material.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {material.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{material.updatedAt}</td>
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

        {/* Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-foreground mb-4">새 교육 자료 등록</h3>
              <p className="text-sm text-muted-foreground mb-6">
                교육 자료 등록 폼이 여기에 표시됩니다.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
