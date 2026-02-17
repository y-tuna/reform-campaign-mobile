'use client'

import React from 'react'
import Link from 'next/link'
import {
  IdcardOutlined,
  PictureOutlined,
  FileImageOutlined,
  BookOutlined,
  RightOutlined
} from '@ant-design/icons'
import Navigation from '../components/Navigation'

interface TemplateCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  specs: string[]
  price: string
}

function TemplateCard({ href, icon, title, description, specs, price }: TemplateCardProps) {
  return (
    <Link href={href}>
      <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group h-full">
        {/* Preview Area */}
        <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl text-gray-300">{icon}</span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <RightOutlined className="text-muted-foreground text-xs group-hover:text-primary transition-colors" />
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex flex-wrap gap-1">
            {specs.map((spec) => (
              <span key={spec} className="px-2 py-0.5 bg-accent text-xs text-muted-foreground rounded">
                {spec}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">제작비: </span>
            <span className="text-base font-semibold text-primary">{price}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const templates = [
  {
    href: '/templates/business-card',
    icon: <IdcardOutlined />,
    title: '명함',
    description: '후보자 정보가 담긴 명함을 제작합니다.',
    specs: ['90x50mm', '양면 인쇄', '250g 고급지'],
    price: '100장 25,000원~'
  },
  {
    href: '/templates/banner',
    icon: <PictureOutlined />,
    title: '현수막',
    description: '거리 유세용 현수막을 제작합니다.',
    specs: ['900x1800mm', '900x3600mm', '천 소재'],
    price: '1장 35,000원~'
  },
  {
    href: '/templates/poster',
    icon: <FileImageOutlined />,
    title: '포스터',
    description: '선거 포스터를 제작합니다.',
    specs: ['A2', 'A3', '150g 고급지'],
    price: '100장 45,000원~'
  },
  {
    href: '/templates/brochure',
    icon: <BookOutlined />,
    title: '공보물 (리플렛)',
    description: '선거공보물을 제작합니다. 선관위 규격 준수.',
    specs: ['8p', '16p', '선관위 규격'],
    price: '1,000부 150,000원~'
  }
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-muted">
      <Navigation role="candidate" />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/campaign-shop" className="text-sm text-primary hover:text-primary/80 font-medium mb-2 inline-block transition-colors">
            ← 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">공보물 제작</h1>
          <p className="text-sm text-muted-foreground">
            템플릿을 선택하고 정보를 입력하면 전문 업체에서 제작해드립니다.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <TemplateCard key={template.href} {...template} />
          ))}
        </div>

        {/* Process Info */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4">제작 프로세스</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-2">1</div>
              <p className="text-sm font-medium text-foreground">템플릿 선택</p>
              <p className="text-xs text-muted-foreground mt-1">원하는 공보물 선택</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-2">2</div>
              <p className="text-sm font-medium text-foreground">정보 입력</p>
              <p className="text-xs text-muted-foreground mt-1">이름, 사진, 슬로건 등</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-2">3</div>
              <p className="text-sm font-medium text-foreground">결제</p>
              <p className="text-xs text-muted-foreground mt-1">광고천하 결제 페이지</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-2">4</div>
              <p className="text-sm font-medium text-foreground">배송</p>
              <p className="text-xs text-muted-foreground mt-1">전문 디자인 후 배송</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl text-amber-500">
              <BookOutlined />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                광고천하 제휴 안내
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                입력하신 정보는 광고천하로 전송되어 전문 디자이너가 제작합니다.
                결제 시 광고천하 결제 페이지로 이동하며, 세금계산서는 선관위 기준에 맞춰 발행됩니다.
              </p>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>• 제작 기간: 결제 후 3~5일</li>
                <li>• 수정 횟수: 2회 무료</li>
                <li>• 배송비: 3만원 이상 무료</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
