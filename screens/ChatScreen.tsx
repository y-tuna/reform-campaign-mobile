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

// Mock 대화
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      '안녕하세요! 선거법에 관해 궁금한 점을 물어보세요. 공직선거법, 선관위 지침 등에 대해 답변해 드릴 수 있습니다.',
    createdAt: new Date().toISOString(),
  },
]

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      {!isUser && <Text style={styles.botIcon}>🤖</Text>}
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
      {isUser && <Text style={styles.userIcon}>👤</Text>}
    </View>
  )
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Text style={styles.title}>선거법 도우미</Text>
        </View>

        <ScrollView
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="질문을 입력하세요..."
            placeholderTextColor={colors.gray[400]}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>▶</Text>
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
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacing.md,
    gap: spacing.md,
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
  botIcon: {
    fontSize: 24,
  },
  userIcon: {
    fontSize: 24,
  },
  bubbleContent: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.sm,
  },
  assistantContent: {
    backgroundColor: colors.white,
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
    color: colors.gray[800],
  },
  sourcesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  sourcesLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  sourceLink: {
    marginVertical: spacing.xs,
  },
  sourceLinkText: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  detailButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    fontSize: fontSize.md,
    color: colors.gray[800],
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  sendButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
  },
})
