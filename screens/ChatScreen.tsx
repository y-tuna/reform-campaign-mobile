import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { ChatMessage } from '../types'
import { BotIcon, UserIcon, KeyboardIcon, ReformSymbolLogo } from '../components/icons'
import AppHeader from '../components/AppHeader'

// Mock 대화
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와 드릴까요?',
    createdAt: new Date().toISOString(),
  },
]

// 자주 묻는 질문
const faqQuestions = [
  'SNS로 선거운동을 할 수 있나요?',
  '선거사무소는 몇 개까지 설치할 수 있나요?',
  '공무원도 선거운동을 할 수 있나요?',
  '예비후보자가 할 수 있는 홍보활동은?',
  '선거 관련 집회를 개최할 수 있나요?',
]

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <View style={styles.messageWrapper}>
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <View
          style={[
            styles.bubbleContent,
            isUser ? styles.userContent : styles.assistantContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.assistantText,
            ]}
          >
            {message.content}
          </Text>
          {message.sources && message.sources.length > 0 && (
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesLabel}>관련 조항:</Text>
              {message.sources.map((source, index) => (
                <TouchableOpacity key={index} style={styles.sourceLink}>
                  <Text style={styles.sourceLinkText}>• {source.code}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>자세히 보기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {!isUser && (
        <View style={styles.botInfoRow}>
          <ReformSymbolLogo size={20} />
          <Text style={styles.messageTime}>{time}</Text>
        </View>
      )}
    </View>
  )
}

function FAQSection({ onSelectQuestion }: { onSelectQuestion: (q: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.faqTitle}>자주 묻는 질문</Text>
        <Text style={styles.faqToggle}>{isExpanded ? '∧' : '∨'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqList}>
          {faqQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => onSelectQuestion(question)}
            >
              <Text style={styles.faqQuestion}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState('')

  const handleSend = (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')

    // Mock 응답
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '공직선거법 제112조에 따르면, 예비후보자는 선거구민을 대상으로 명함을 직접 배부할 수 있습니다. 단, 명함의 규격과 내용은 선관위 규정을 준수해야 합니다.',
        sources: [
          {
            code: '공직선거법 제112조',
            title: '명함 배부',
            summary: '예비후보자 명함 배부 규정',
          },
        ],
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleFAQSelect = (question: string) => {
    handleSend(question)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <AppHeader title="AI 챗봇" />

        <ScrollView
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          <FAQSection onSelectQuestion={handleFAQSelect} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <KeyboardIcon size={20} color={colors.neutral[400]} />
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="궁금한 것을 물어보세요."
              placeholderTextColor={colors.neutral[400]}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  messageWrapper: {
    marginBottom: spacing.sm,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  botInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  botLogo: {
    width: 24,
    height: 24,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
  },
  bubbleContent: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userContent: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: borderRadius.sm,
  },
  assistantContent: {
    backgroundColor: colors.neutral[100],
    borderBottomLeftRadius: borderRadius.sm,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  assistantText: {
    color: colors.neutral[800],
  },
  sourcesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  sourcesLabel: {
    fontSize: fontSize.sm,
    color: colors.neutral[500],
    marginBottom: spacing.xs,
  },
  sourceLink: {
    marginVertical: spacing.xs,
  },
  sourceLinkText: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
  },
  detailButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '600',
  },
  // FAQ 스타일
  faqContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  faqTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[700],
  },
  faqToggle: {
    fontSize: fontSize.md,
    color: colors.neutral[400],
  },
  faqList: {
    gap: spacing.sm,
  },
  faqItem: {
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  faqQuestion: {
    fontSize: fontSize.md,
    color: colors.neutral[700],
  },
  // 입력창 스타일
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.sm,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    fontSize: fontSize.md,
    color: colors.neutral[800],
    paddingVertical: spacing.sm,
    textAlignVertical: 'center',
  },
  sendButton: {
    paddingHorizontal: spacing.md,
    height: 36,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  sendButtonText: {
    color: colors.neutral[500],
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
})
