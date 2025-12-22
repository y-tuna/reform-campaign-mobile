import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'

import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Text, View, StyleSheet } from 'react-native'

import {
  HomeScreen,
  DashboardScreen,
  ChatScreen,
  NotificationsScreen,
  ProfileScreen,
  LoginScreen,
  OnboardingScreen,
} from './screens'
import { colors } from './constants/theme'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {icon}
      </Text>
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: '대시보드',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: '챗봇',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💬" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: '알림',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔔" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  // Auth state - replace with actual auth logic later
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setHasCompletedOnboarding(false)
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLogin={handleLogin}
                    onNavigateToOnboarding={() => {
                      setIsAuthenticated(true)
                      setHasCompletedOnboarding(false)
                    }}
                  />
                )}
              </Stack.Screen>
            </>
          ) : !hasCompletedOnboarding ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  onComplete={handleOnboardingComplete}
                  onBack={() => setIsAuthenticated(false)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
})
