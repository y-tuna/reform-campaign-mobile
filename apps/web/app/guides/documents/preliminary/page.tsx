'use client'

import { FileTextOutlined, DownloadOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function PreliminaryDocumentsPage() {
  const documents = [
    {
      id: 1,
      title: '예비후보자등록신청서',
      description: '선관위 공식 양식 사용',
      details: ['선관위 홈페이지 다운로드', '본인 서명', '사진 부착 (3×4cm)']
    },
    {
      id: 2,
      title: '기탁금 납부 영수증',
      description: '선거구별 상이 (300만원~600만원)',
      details: ['선관위 지정 계좌 납부', '후보자 등록 시 보전', '반환 조건 확인']
    },
    {
      id: 3,
      title: '재산신고서',
      description: '본인 및 배우자, 직계존비속 재산',
      details: ['부동산, 예금, 주식 등', '배우자 재산 포함', '허위 신고 시 처벌']
    },
    {
      id: 4,
      title: '병역신고서',
      description: '남성 후보자 필수',
      details: ['병역 이행 상황', '면제 사유 해당 시 증빙', '병무청 확인']
    },
    {
      id: 5,
      title: '전과기록 조회 동의서',
      description: '결격사유 확인용',
      details: ['본인 서명 필수', '선관위에서 조회', '범죄경력 확인']
    },
    {
      id: 6,
      title: '세금납부 증명서',
      description: '체납 여부 확인',
      details: ['국세/지방세 납부 증명', '홈택스 또는 세무서 발급', '체납 없음 확인']
    },
    {
      id: 7,
      title: '주민등록표등본',
      description: '거주요건 확인용 (3개월 이내 발급)',
      details: ['주소 이력 포함', '거주기간 확인', '정부24 발급 가능']
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/guides/documents" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 서류 가이드
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">예비후보자 등록 서류</h1>
          <p className="text-sm text-muted-foreground">
            선관위 예비후보자 등록에 필요한 서류입니다
          </p>
        </div>

        {/* 등록 기간 안내 */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CalendarOutlined className="text-xl text-green-600" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                예비후보자 등록 기간
              </p>
              <p className="text-sm text-muted-foreground">
                2026년 2월 6일부터 ~ (선거일 120일 전부터 등록 가능)
              </p>
            </div>
          </div>
        </div>

        {/* 중요 안내 */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-xl text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                중요 안내
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 예비후보자로 등록하면 선거운동을 사전에 시작할 수 있습니다</li>
                <li>• 명함 배포, 어깨띠 착용 등 제한적 선거운동 가능</li>
                <li>• 기탁금은 후보자 등록 시 보전 또는 반환됩니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 서류 목록 */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileTextOutlined className="text-2xl text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {doc.description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-0.5">
                      {doc.details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 flex-shrink-0 ml-4">
                  <DownloadOutlined />
                  양식
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 문의처 */}
        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            관할 선관위 문의
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-foreground">중앙선거관리위원회</strong></p>
            <p>전화: 02-2171-0145</p>
            <p>웹사이트: www.nec.go.kr</p>
            <p>운영시간: 평일 09:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
