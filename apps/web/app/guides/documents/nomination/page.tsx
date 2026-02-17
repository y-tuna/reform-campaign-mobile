'use client'

import { FileTextOutlined, DownloadOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function NominationDocumentsPage() {
  const documents = [
    {
      id: 1,
      title: '공천신청서',
      required: true,
      description: '개혁신당 공천 신청을 위한 기본 신청서',
      details: [
        '성명, 주민등록번호, 연락처 등 기본정보 기재',
        '공천 희망 선거구 및 직위 명시',
        '본인 서명 필수'
      ]
    },
    {
      id: 2,
      title: '주민등록등본',
      required: true,
      description: '3개월 이내 발급본',
      details: [
        '주민센터 또는 민원24에서 발급',
        '주소 이력 포함',
        '선거구 거주요건 확인용'
      ]
    },
    {
      id: 3,
      title: '재산신고서',
      required: true,
      description: '본인 및 가족 재산 내역',
      details: [
        '부동산, 금융자산, 부채 등 모든 재산 기재',
        '배우자 및 직계존비속 재산 포함',
        '허위 기재 시 불이익 가능'
      ]
    },
    {
      id: 4,
      title: '범죄경력조회 동의서',
      required: true,
      description: '결격사유 확인을 위한 동의서',
      details: [
        '본인 서명 필수',
        '범죄경력 조회 동의',
        '결격사유 없음 확인용'
      ]
    },
    {
      id: 5,
      title: '병역사항 증명서',
      required: false,
      description: '남성의 경우 병역 이행 확인 (선택)',
      details: [
        '병무청 또는 민원24에서 발급',
        '병역 이행 내역 확인용',
        '미제출시 다른 방법으로 확인 가능'
      ]
    },
    {
      id: 6,
      title: '경력증명서',
      required: false,
      description: '주요 경력 증빙 자료 (선택)',
      details: [
        '직장 경력증명서, 재직증명서 등',
        '사회활동 경력 증빙',
        '공천 심사 참고용'
      ]
    },
    {
      id: 7,
      title: '학력증명서',
      required: false,
      description: '최종학력 졸업증명서 (선택)',
      details: [
        '대학교 또는 학교 발급',
        '학력 확인용',
        '공천 심사 참고용'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/guides/documents" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 서류 가이드
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">공천 서류</h1>
          <p className="text-sm text-muted-foreground">
            개혁신당 공천 신청에 필요한 서류 목록입니다
          </p>
        </div>

        {/* Required vs Optional Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-xl text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                제출 안내
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong className="text-danger">필수</strong> 서류는 반드시 제출해야 합니다</li>
                <li>• <strong className="text-warning">선택</strong> 서류는 공천 심사 시 가점 요소로 활용됩니다</li>
                <li>• 모든 서류는 최근 3개월 이내 발급본을 제출하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <FileTextOutlined className="text-2xl text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-foreground">
                        {doc.title}
                      </h3>
                      {doc.required ? (
                        <span className="px-2 py-0.5 bg-danger/10 text-danger text-xs font-semibold rounded border border-danger/20">
                          필수
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-semibold rounded border border-warning/20">
                          선택
                        </span>
                      )}
                    </div>
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
                  양식 다운
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            서류 제출 문의
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-foreground">개혁신당 공천관리위원회</strong></p>
            <p>전화: 02-785-2012 (내선 3번)</p>
            <p>이메일: nomination@reform.kr</p>
            <p>운영시간: 평일 09:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
