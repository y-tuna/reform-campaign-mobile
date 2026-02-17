'use client'

import React, { useState } from 'react'
import Navigation from '../components/Navigation'
import {
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  MessageOutlined
} from '@ant-design/icons'

interface Voter {
  id: string
  name: string
  phone: string
  region: string
  tag: string
  memo: string
  createdAt: string
}

// Mock 유권자 데이터
const initialVoters: Voter[] = [
  { id: '1', name: '홍길동', phone: '010-1234-5678', region: '서울 강남구', tag: '지지자', memo: '적극적 지지 의사', createdAt: '2024-12-20' },
  { id: '2', name: '김철수', phone: '010-2345-6789', region: '서울 강남구', tag: '관심', memo: '정책 관련 문의', createdAt: '2024-12-19' },
  { id: '3', name: '이영희', phone: '010-3456-7890', region: '서울 서초구', tag: '지지자', memo: '', createdAt: '2024-12-18' },
  { id: '4', name: '박민수', phone: '010-4567-8901', region: '서울 강남구', tag: '중립', memo: '추후 연락 필요', createdAt: '2024-12-17' },
  { id: '5', name: '정수진', phone: '010-5678-9012', region: '서울 송파구', tag: '지지자', memo: '', createdAt: '2024-12-16' },
]

const tagColors: Record<string, { bg: string; text: string }> = {
  '지지자': { bg: 'bg-green-100', text: 'text-green-700' },
  '관심': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '중립': { bg: 'bg-gray-100', text: 'text-gray-700' },
}

export default function VoterCRMPage() {
  const [voters, setVoters] = useState<Voter[]>(initialVoters)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVoters, setSelectedVoters] = useState<string[]>([])
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [smsMessage, setSmsMessage] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVoter, setNewVoter] = useState({ name: '', phone: '', region: '', tag: '지지자', memo: '' })
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // 검색 필터링
  const filteredVoters = voters.filter(voter =>
    voter.name.includes(searchTerm) ||
    voter.phone.includes(searchTerm) ||
    voter.region.includes(searchTerm)
  )

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedVoters.length === filteredVoters.length) {
      setSelectedVoters([])
    } else {
      setSelectedVoters(filteredVoters.map(v => v.id))
    }
  }

  // 개별 선택
  const handleSelect = (id: string) => {
    setSelectedVoters(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  // 유권자 추가
  const handleAddVoter = () => {
    if (!newVoter.name || !newVoter.phone) return

    const voter: Voter = {
      id: Date.now().toString(),
      ...newVoter,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setVoters([voter, ...voters])
    setNewVoter({ name: '', phone: '', region: '', tag: '지지자', memo: '' })
    setShowAddModal(false)
  }

  // 유권자 삭제
  const handleDeleteSelected = () => {
    if (selectedVoters.length === 0) return
    if (!confirm(`선택한 ${selectedVoters.length}명의 유권자를 삭제하시겠습니까?`)) return
    setVoters(voters.filter(v => !selectedVoters.includes(v.id)))
    setSelectedVoters([])
  }

  // 유권자 수정 모달 열기
  const handleEditVoter = (voter: Voter) => {
    setEditingVoter({ ...voter })
    setShowEditModal(true)
  }

  // 유권자 수정 저장
  const handleSaveEdit = () => {
    if (!editingVoter || !editingVoter.name || !editingVoter.phone) return
    setVoters(voters.map(v => v.id === editingVoter.id ? editingVoter : v))
    setShowEditModal(false)
    setEditingVoter(null)
  }

  // 개별 유권자 삭제
  const handleDeleteVoter = (id: string) => {
    if (!confirm('이 유권자를 삭제하시겠습니까?')) return
    setVoters(voters.filter(v => v.id !== id))
  }

  // 단체 문자 발송
  const handleSendSms = () => {
    if (!smsMessage.trim() || selectedVoters.length === 0) return
    alert(`${selectedVoters.length}명에게 문자를 발송했습니다.\n\n내용: ${smsMessage}`)
    setShowSmsModal(false)
    setSmsMessage('')
    setSelectedVoters([])
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">유권자 CRM</h1>
          <p className="text-sm text-muted-foreground">
            유권자 연락처를 관리하고 단체 문자를 발송하세요.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">전체 유권자</p>
            <p className="text-2xl font-bold text-foreground">{voters.length}명</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">지지자</p>
            <p className="text-2xl font-bold text-green-600">{voters.filter(v => v.tag === '지지자').length}명</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">관심</p>
            <p className="text-2xl font-bold text-blue-600">{voters.filter(v => v.tag === '관심').length}명</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">이번 달 추가</p>
            <p className="text-2xl font-bold text-primary">{voters.filter(v => v.createdAt >= '2024-12-01').length}명</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="이름, 전화번호, 지역으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <PlusOutlined />
                유권자 추가
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                <UploadOutlined />
                엑셀 업로드
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                <DownloadOutlined />
                내보내기
              </button>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedVoters.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">{selectedVoters.length}명</strong> 선택됨
              </span>
              <button
                onClick={() => setShowSmsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <SendOutlined />
                단체 문자 발송
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-3 py-1.5 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90 transition-colors"
              >
                <DeleteOutlined />
                삭제
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50 border-b border-border">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVoters.length === filteredVoters.length && filteredVoters.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">이름</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">전화번호</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">지역</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">구분</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">메모</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">등록일</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter) => (
                  <tr key={voter.id} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedVoters.includes(voter.id)}
                        onChange={() => handleSelect(voter.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{voter.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{voter.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{voter.region}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${tagColors[voter.tag]?.bg || 'bg-gray-100'} ${tagColors[voter.tag]?.text || 'text-gray-700'}`}>
                        {voter.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{voter.memo || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{voter.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditVoter(voter)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          title="수정"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => handleDeleteVoter(voter.id)}
                          className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded transition-colors"
                          title="삭제"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVoters.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 유권자가 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 유권자 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-foreground mb-4">유권자 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">이름 *</label>
                  <input
                    type="text"
                    value={newVoter.name}
                    onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">전화번호 *</label>
                  <input
                    type="text"
                    value={newVoter.phone}
                    onChange={(e) => setNewVoter({ ...newVoter, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">지역</label>
                  <input
                    type="text"
                    value={newVoter.region}
                    onChange={(e) => setNewVoter({ ...newVoter, region: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="예: 서울 강남구"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">구분</label>
                  <select
                    value={newVoter.tag}
                    onChange={(e) => setNewVoter({ ...newVoter, tag: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="지지자">지지자</option>
                    <option value="관심">관심</option>
                    <option value="중립">중립</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">메모</label>
                  <textarea
                    value={newVoter.memo}
                    onChange={(e) => setNewVoter({ ...newVoter, memo: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={2}
                    placeholder="메모를 입력하세요"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-card border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddVoter}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 단체 문자 모달 */}
        {showSmsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-2 mb-4">
                <MessageOutlined className="text-xl text-green-600" />
                <h3 className="text-lg font-bold text-foreground">단체 문자 발송</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                선택한 <strong className="text-foreground">{selectedVoters.length}명</strong>에게 문자를 발송합니다.
              </p>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">문자 내용</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={5}
                  placeholder="유세 인사말을 입력하세요...&#10;&#10;예: 안녕하세요, 김후보입니다. 지역 발전을 위해 최선을 다하겠습니다. 많은 관심 부탁드립니다."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {smsMessage.length}/90자 (90자 초과 시 장문 문자로 발송)
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-amber-700">
                  ⚠️ 선거법에 따라 문자 메시지 발송 시 발신자 정보가 포함되어야 합니다.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="flex-1 px-4 py-2 bg-card border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSendSms}
                  disabled={!smsMessage.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendOutlined className="mr-2" />
                  발송하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 유권자 수정 모달 */}
        {showEditModal && editingVoter && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-foreground mb-4">유권자 수정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">이름 *</label>
                  <input
                    type="text"
                    value={editingVoter.name}
                    onChange={(e) => setEditingVoter({ ...editingVoter, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">전화번호 *</label>
                  <input
                    type="text"
                    value={editingVoter.phone}
                    onChange={(e) => setEditingVoter({ ...editingVoter, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">지역</label>
                  <input
                    type="text"
                    value={editingVoter.region}
                    onChange={(e) => setEditingVoter({ ...editingVoter, region: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="예: 서울 강남구"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">구분</label>
                  <select
                    value={editingVoter.tag}
                    onChange={(e) => setEditingVoter({ ...editingVoter, tag: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="지지자">지지자</option>
                    <option value="관심">관심</option>
                    <option value="중립">중립</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">메모</label>
                  <textarea
                    value={editingVoter.memo}
                    onChange={(e) => setEditingVoter({ ...editingVoter, memo: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={2}
                    placeholder="메모를 입력하세요"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingVoter(null)
                  }}
                  className="flex-1 px-4 py-2 bg-card border border-border text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
