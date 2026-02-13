import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { useSettingsStore, Notification } from '../stores'
import { CalendarIcon, InfoIcon, GpsIcon } from './icons'

interface NotificationDrawerProps {
  visible: boolean
  onClose: () => void
}

function NotificationItem({ notification }: { notification: Notification }) {
  const markAsRead = useSettingsStore((state) => state.markAsRead)

  const getIcon = () => {
    switch (notification.type) {
      case 'schedule':
        return <CalendarIcon size={20} color={colors.primary[500]} />
      case 'system':
        return <InfoIcon size={20} color={colors.neutral[500]} />
      case 'gps_verify':
        return <GpsIcon size={20} color={colors.success[500]} />
      default:
        return <InfoIcon size={20} color={colors.neutral[500]} />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !notification.isRead && styles.unreadItem]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>{formatTime(notification.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function NotificationDrawer({ visible, onClose }: NotificationDrawerProps) {
  const notifications = useSettingsStore((state) => state.notifications)
  const unreadCount = useSettingsStore((state) => state.unreadCount)
  const markAllAsRead = useSettingsStore((state) => state.markAllAsRead)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>알림</Text>
              <View style={styles.headerActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={markAllAsRead}
                  >
                    <Text style={styles.markAllText}>모두 읽음</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notification List */}
            <ScrollView style={styles.notificationList}>
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>알림이 없습니다</Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
    minHeight: '50%',
  },
  safeArea: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  drawerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  markAllButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  markAllText: {
    fontSize: fontSize.sm,
    color: colors.primary[500],
    fontWeight: '500',
  },
  closeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  closeText: {
    fontSize: fontSize.md,
    color: colors.neutral[500],
    fontWeight: '500',
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  unreadItem: {
    backgroundColor: colors.primary[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[500],
  },
  notificationMessage: {
    fontSize: fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: fontSize.xs,
    color: colors.neutral[400],
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.neutral[400],
  },
})
