'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'
import type { UserRole } from '../api/auth/[...nextauth]/route'

// Hook to get current user and role
export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    role: session?.user?.role as UserRole | undefined,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    accessToken: session?.accessToken
  }
}

// Hook to check if user has specific role
export function useRole(requiredRole: UserRole | UserRole[]) {
  const { role } = useAuth()
  
  if (Array.isArray(requiredRole)) {
    return role ? requiredRole.includes(role) : false
  }
  
  return role === requiredRole
}

// Component to conditionally render content based on role
interface RoleGuardProps {
  allowedRoles: UserRole | UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const hasRole = useRole(allowedRoles)
  
  return hasRole ? <>{children}</> : <>{fallback}</>
}

// Component to conditionally render content for admin only
export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Component to conditionally render content for candidates only
export function CandidateOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles="candidate" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Component to conditionally render content for admin and viewer
export function ManagementOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'viewer']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

// Higher-order component to protect pages
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles?: UserRole | UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, role } = useAuth()
    
    if (isLoading) {
      return <div>Loading...</div>
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>
    }
    
    if (requiredRoles) {
      const hasRequiredRole = Array.isArray(requiredRoles) 
        ? role && requiredRoles.includes(role)
        : role === requiredRoles
      
      if (!hasRequiredRole) {
        return <div>You don't have permission to access this page.</div>
      }
    }
    
    return <WrappedComponent {...props} />
  }
}

// Permission helper functions
export const can = {
  viewUsers: (role?: UserRole) => role === 'admin',
  manageUsers: (role?: UserRole) => role === 'admin',
  viewCandidates: (role?: UserRole) => ['admin', 'viewer'].includes(role || ''),
  manageCandidates: (role?: UserRole) => role === 'admin',
  viewProofs: (role?: UserRole) => ['admin', 'viewer'].includes(role || ''),
  approveProofs: (role?: UserRole) => role === 'admin',
  viewBroadcasts: (role?: UserRole) => ['admin', 'viewer'].includes(role || ''),
  createBroadcasts: (role?: UserRole) => role === 'admin',
  viewOwnProfile: (role?: UserRole) => Boolean(role),
  viewOwnTasks: (role?: UserRole) => role === 'candidate',
  viewEducation: (role?: UserRole) => role === 'candidate',
  accessChat: (role?: UserRole) => Boolean(role),
  viewAuditLogs: (role?: UserRole) => role === 'admin',
  manageSettings: (role?: UserRole) => role === 'admin'
}

export default useAuth