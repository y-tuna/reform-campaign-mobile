import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { Notification } from '../types'
import { AlertIcon, CalendarIcon, AnnouncementIcon } from '../components/icons'
import AppHeader from '../components/AppHeader'

// Mock 데이터
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'broadcast',
    title: '[긴급] 선거법 개정 안내',
    body: '2024년 12월 개정된 선거법 내용을 확인하세요.',
    severity: 'critical',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    type: 'schedule_reminder',
    title: '14:00 삼성역 유세',
    body: '30분 후 유세 일정이 있습니다.',
    severity: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'broadcast',
    title: '이번 주 유세 지침',
    body: '출퇴근 시간대 지하철역 중심 유세를 권장합니다.',
    severity: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: 'user1',
    type: 'broadcast',
    title: '당 정책 브리핑',
    body: '12월 정책 브리핑 자료가 업로드되었습니다.',
    severity: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function getTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

function getNotificationIcon(type: Notification['type'], severity: Notification['severity']) {
  if (severity === 'critical') return <AlertIcon size={20} color={colors.error[500]} />
  if (type === 'schedule_reminder') return <CalendarIcon size={20} color={colors.primary[500]} />
  return <AnnouncementIcon size={20} color={colors.neutral[500]} />
}

function NotificationItem({ notification }: { notification: Notification }) {
  const icon = getNotificationIcon(notification.type, notification.severity)
  const severityColor = colors.severity[notification.severity]

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unread,
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              notification.severity === 'critical' && { color: severityColor },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={styles.time}>{getTimeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function NotificationsScreen() {
  const todayNotifications = mockNotifications.filter((n) => {
    const diff = Date.now() - new Date(n.createdAt).getTime()
    return diff < 24 * 60 * 60 * 1000
  })

  const olderNotifications = mockNotifications.filter((n) => {
    const diff = Date.now() - new Date(n.createdAt).getTime()
    return diff >= 24 * 60 * 60 * 1000
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="알림" showNotification={false} />

      <ScrollView style={styles.scrollView}>
        {todayNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오늘</Text>
            {todayNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        )}

        {olderNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이번 주</Text>
            {olderNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.neutral[500],
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    gap: spacing.sm,
  },
  unread: {
    backgroundColor: colors.neutral[50],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
    marginLeft: spacing.sm,
  },
  body: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    lineHeight: 20,
  },
})
