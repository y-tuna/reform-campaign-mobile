'use client'

import { FileTextOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function RegistrationDocumentsPage() {
  const documents = [
    {
      id: 1,
      title: '후보자등록신청서',
      description: '선관위 공식 양식 사용',
      details: ['선관위 홈페이지 다운로드', '본인 및 추천인 서명', '사진 부착']
    },
    {
      id: 2,
      title: '정당추천서',
      description: '개혁신당 발행',
      details: ['당 중앙당에서 발급', '공천 확정 후 수령', '원본 제출']
    },
    {
      id: 3,
      title: '주민등록표등본',
      description: '거주요건 확인용 (3개월 이내 발급)',
      details: ['주소 이력 포함', '선거구 거주기간 확인', '민원24 발급 가능']
    },
    {
      id: 4,
      title: '호적등본 또는 가족관계증명서',
      description: '본인 확인용',
      details: ['대법원 전자가족관계등록시스템', '최근 발급본', '신분 확인용']
    },
    {
      id: 5,
      title: '범죄경력조회서',
      description: '결격사유 확인',
      details: ['경찰서 또는 민원24', '본인 조회 동의 필요', '범죄경력 없음 확인']
    },
    {
      id: 6,
      title: '재산등록 신고서',
      description: '본인 및 배우자 재산',
      details: ['부동산, 예금, 주식 등', '배우자 재산 포함', '허위 신고 처벌']
    },
    {
      id: 7,
      title: '선거사무장·회계책임자 선임서',
      description: '필수 선임 인력',
      details: ['선거사무장 1명', '회계책임자 1명', '본인 서명']
    },
    {
      id: 8,
      title: '선거비용제한액 준수 서약서',
      description: '선거법 준수 서약',
      details: ['본인 서명', '법정 비용한도 확인', '위반 시 처벌']
    },
    {
      id: 9,
      title: '선거사무소 설치 신고서',
      description: '선거사무소 위치 신고',
      details: ['주소 및 연락처', '임대차 계약서 사본', '소방 안전 확인']
    },
    {
      id: 10,
      title: '기탁금 납부 영수증',
      description: '선거구별 상이 (1,500만원~3,000만원)',
      details: ['선관위 지정 계좌', '유효득표 15% 이상 시 반환', '영수증 원본']
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Link href="/guides/documents" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 서류 가이드
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">후보자 등록 서류</h1>
          <p className="text-sm text-muted-foreground">
            선관위 후보자 등록에 필요한 서류입니다 (선거일 23일 전까지)
          </p>
        </div>

        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-xl text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                중요 안내
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 모든 서류는 선거일 기준 필수 제출입니다</li>
                <li>• 등록 기간 내 미제출 시 후보 등록이 불가합니다</li>
                <li>• 서류 누락 방지를 위해 체크리스트를 활용하세요</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileTextOutlined className="text-2xl text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {doc.description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
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

        <div className="mt-8 bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            관할 선관위 문의
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-foreground">중앙선거관리위원회</strong></p>
            <p>전화: 1390 (선거 종합 상담센터)</p>
            <p>웹사이트: www.nec.go.kr</p>
            <p>운영시간: 평일 09:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
