import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'
import { NotificationIcon } from './icons'
import { useSettingsStore } from '../stores'
import NotificationDrawer from './NotificationDrawer'

interface AppHeaderProps {
  title: string
  showNotification?: boolean
}

export default function AppHeader({ title, showNotification = true }: AppHeaderProps) {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const unreadCount = useSettingsStore((state) => state.unreadCount)

  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftSpacer} />
        <Text style={styles.title}>{title}</Text>
        {showNotification ? (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setDrawerVisible(true)}
          >
            <NotificationIcon size={24} color={colors.neutral[600]} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      <NotificationDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  leftSpacer: {
    width: 40,
  },
  rightSpacer: {
    width: 40,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.neutral[800],
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
})
