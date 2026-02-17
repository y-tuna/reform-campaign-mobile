'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '안녕하세요! 선거법 Q&A 챗봇입니다.\n\n선거운동, 기부행위, 공보물, 온라인 홍보 등 선거법 관련 궁금한 점을 물어보세요.',
    timestamp: new Date()
  }
]

const SAMPLE_RESPONSES: Record<string, string> = {
  '명함': `명함 관련 규정을 안내해 드립니다.

📌 규격
• 크기: 가로 9cm × 세로 5cm 이내
• 인쇄: 단면 또는 양면 가능

📌 배부 방법
• 예비후보자/후보자 본인이 직접 주고받는 방식으로만 가능
• 선거사무관계자 배부 금지
• 우편 발송, 문틈에 끼워두기 금지

더 궁금한 점이 있으시면 말씀해 주세요!`,
  '기부': `기부행위 관련 규정입니다.

📌 금지되는 기부행위
• 경조사비 지급 (축의금, 조의금 등)
• 마을 행사 등에 금품 제공
• 후원회 명의로 기부
• 제3자를 통한 기부

📌 허용되는 경우
• 의례적 행위로서 통상적인 범위 내
• 직계존비속에 대한 행위
• 친목회 회칙에 따른 행위

주의: 선거구민에 대한 식사 대접도 기부행위로 간주될 수 있습니다.`,
  'SNS': `SNS 선거운동 규정입니다.

✅ 허용 사항
• 본인 계정에서 정책, 공약 홍보
• 지지 호소 게시물 작성
• 실시간 방송

❌ 금지 사항
• 허위사실 유포
• 비방 게시물 작성
• 선거일 당일 선거운동

⚠️ 주의사항
• 댓글, 공유 시에도 허위사실 유포 금지
• 상대 후보에 대한 근거 없는 비방 금지`,
  'default': `해당 질문에 대해 검토 중입니다.

관련 정보를 찾아보고 있으니 잠시만 기다려 주세요.
정확한 법률 해석이 필요한 경우 중앙선거관리위원회(02-2171-0145)로 문의하시는 것을 권장합니다.

다른 질문이 있으시면 말씀해 주세요!`
}

// 싱글턴 인스턴스를 위한 전역 상태
let chatbotInstance: {
  messages: Message[]
  isOpen: boolean
} | null = null

function getChatbotInstance() {
  if (!chatbotInstance) {
    chatbotInstance = {
      messages: [...INITIAL_MESSAGES],
      isOpen: false
    }
  }
  return chatbotInstance
}

export default function ElectionLawChatbot() {
  const instance = getChatbotInstance()
  const [isOpen, setIsOpen] = useState(instance.isOpen)
  const [messages, setMessages] = useState<Message[]>(instance.messages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    instance.isOpen = isOpen
    instance.messages = messages
  }, [isOpen, messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // 데모용 응답 시뮬레이션
    setTimeout(() => {
      const keywords = Object.keys(SAMPLE_RESPONSES).filter(k => k !== 'default')
      const matchedKeyword = keywords.find(keyword =>
        input.includes(keyword)
      )

      const responseContent = matchedKeyword
        ? SAMPLE_RESPONSES[matchedKeyword]
        : SAMPLE_RESPONSES['default']

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isOpen ? (
          <CloseOutlined className="text-white text-xl" />
        ) : (
          <MessageOutlined className="text-white text-xl" />
        )}
      </button>

      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <RobotOutlined className="text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">선거법 AI 상담</h3>
              <p className="text-xs opacity-80">선관위 질의응답 기반</p>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border text-foreground rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 */}
          <div className="px-3 py-2 border-t border-border bg-card">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['명함 규격', 'SNS 홍보', '기부행위'].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-1 bg-accent text-xs text-muted-foreground rounded-full whitespace-nowrap hover:bg-accent/80 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="px-3 py-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="선거법 관련 질문을 입력하세요..."
                className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <SendOutlined />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              본 AI 상담은 참고용이며, 정확한 법률 해석은 선관위에 문의하세요.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
