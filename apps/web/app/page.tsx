'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import type { UserRole } from './api/auth/[...nextauth]/route'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.push('/auth/login')
      return
    }

    // Redirect based on user role
    const userRole = session.user?.role as UserRole
    
    if (userRole === 'candidate') {
      router.push('/home')
    } else if (userRole === 'admin' || userRole === 'viewer') {
      router.push('/candidates')
    } else {
      // Fallback for unknown roles
      router.push('/auth/login')
    }
  }, [session, status, router])

  // Show loading while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Spin size="large" tip="로딩 중..." />
    </div>
  )
}