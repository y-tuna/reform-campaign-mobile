'use client'

import { TrophyOutlined, TeamOutlined, IdcardOutlined, SoundOutlined, ShoppingOutlined, BellOutlined, FireOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function AdminDashboard() {
  // Mock data - 실제로는 API에서 가져올 데이터
  const topCandidates = [
    { id: 1, name: '김철수', region: '서울 강남구', score: 2840, activities: 142, rank: 1 },
    { id: 2, name: '이영희', region: '경기 수원시', score: 2650, activities: 128, rank: 2 },
    { id: 3, name: '박민수', region: '부산 해운대구', score: 2480, activities: 115, rank: 3 },
    { id: 4, name: '정수연', region: '인천 남동구', score: 2310, activities: 108, rank: 4 },
    { id: 5, name: '최동욱', region: '대구 수성구', score: 2180, activities: 97, rank: 5 }
  ]

  const pendingOrders = [
    { id: 1, candidate: '김철수', item: '명함 (5,000매)', status: 'pending' },
    { id: 2, candidate: '이영희', item: '현수막 (20개)', status: 'pending' },
    { id: 3, candidate: '박민수', item: '어깨띠 (50개)', status: 'pending' }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="admin" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">관리자 대시보드</h1>
          <p className="text-sm text-muted-foreground">
            전국 후보자들의 유세 활동 현황을 확인하고 관리하세요
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">전체 후보자</p>
                <p className="text-2xl font-bold text-foreground mt-2">24</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TeamOutlined className="text-2xl text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">금일 유세 활동</p>
                <p className="text-2xl font-bold text-foreground mt-2">342</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <FireOutlined className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">승인 대기</p>
                <p className="text-2xl font-bold text-foreground mt-2">3</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <ShoppingOutlined className="text-2xl text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">총 명함 배포</p>
                <p className="text-2xl font-bold text-foreground mt-2">15.2K</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <IdcardOutlined className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Campaign Activity Rankings */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                <TrophyOutlined className="mr-2 text-yellow-500" />
                유세 활동 랭킹
              </h2>
              <Link href="/admin/candidates" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-3">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center font-bold shadow-sm">
                    {candidate.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{candidate.score}점</p>
                    <p className="text-xs text-muted-foreground">{candidate.activities}건 활동</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                승인 대기
              </h2>
              <Link href="/admin/materials" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                  <p className="text-sm font-semibold text-foreground">{order.candidate}</p>
                  <p className="text-xs text-muted-foreground mb-3">{order.item}</p>
                  <button className="w-full px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors shadow-sm">
                    승인하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/candidates">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg inline-flex mb-3 group-hover:bg-primary/20 transition-colors">
                <TeamOutlined className="text-2xl text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">후보자 관리</h3>
              <p className="text-xs text-muted-foreground">활동 현황 및 통계</p>
            </div>
          </Link>

          <Link href="/admin/materials">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg inline-flex mb-3 group-hover:bg-primary/20 transition-colors">
                <ShoppingOutlined className="text-2xl text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">물품 발주 승인</h3>
              <p className="text-xs text-muted-foreground">디자인 및 문구 검토</p>
            </div>
          </Link>

          <Link href="/admin/announcements">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg inline-flex mb-3 group-hover:bg-primary/20 transition-colors">
                <BellOutlined className="text-2xl text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">공지사항</h3>
              <p className="text-xs text-muted-foreground">중앙 전술 및 알림</p>
            </div>
          </Link>

          <Link href="/admin/tactics">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg inline-flex mb-3 group-hover:bg-primary/20 transition-colors">
                <SoundOutlined className="text-2xl text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">중앙 전술</h3>
              <p className="text-xs text-muted-foreground">전술 가이드 배포</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
