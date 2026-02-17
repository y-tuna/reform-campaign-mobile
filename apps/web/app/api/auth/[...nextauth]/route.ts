import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import axios from 'axios'

// Define user roles according to data contracts
export type UserRole = 'candidate' | 'admin' | 'viewer'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: UserRole
      name?: string
      nominationStatus?: string // 공천 시스템에서의 status (pass, pending, rejected)
    }
    accessToken: string
  }

  interface User {
    id: string
    email: string
    role: UserRole
    name?: string
    nominationStatus?: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    role: UserRole
    name?: string
    nominationStatus?: string
    accessToken: string
  }
}

/**
 * 공천 시스템 연동 함수 (Mock)
 * TODO: 실제 공천 시스템 DB와 연동 필요
 *
 * @param email - 사용자 이메일
 * @returns 공천 신청 정보 (status, name 등)
 */
async function checkNominationStatus(email: string): Promise<{
  status: string
  name: string
  candidateId: string
} | null> {
  // Mock implementation - 실제로는 공천 시스템 DB 조회
  // TODO: Supabase나 별도 DB에서 공천 시스템 candidates 테이블 조회

  // 테스트 계정 데이터
  const mockNominationData: Record<string, { status: string; name: string; candidateId: string }> = {
    'candidate@example.com': {
      status: 'pass',
      name: '김후보',
      candidateId: 'candidate_001'
    },
    'pending@example.com': {
      status: 'pending',
      name: '박지원',
      candidateId: 'candidate_002'
    },
    'rejected@example.com': {
      status: 'rejected',
      name: '이낙선',
      candidateId: 'candidate_003'
    }
  }

  return mockNominationData[email] || null
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.')
        }

        try {
          // 비밀번호 검증
          if (credentials.password !== 'test1234') {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
          }

          // 테스트 계정 정의
          const testAccounts: Record<string, { id: string; role: UserRole; name: string }> = {
            'admin@example.com': { id: 'admin_001', role: 'admin', name: '중앙당 관리자' },
            'admin@chamchi.kr': { id: 'super_admin_001', role: 'admin', name: '슈퍼 관리자' },
            'vendor@example.com': { id: 'vendor_001', role: 'admin', name: '인쇄업체' },
            'candidate@example.com': { id: 'candidate_001', role: 'candidate', name: '김후보' },
            'pending@example.com': { id: 'candidate_002', role: 'candidate', name: '박지원' },
            'rejected@example.com': { id: 'candidate_003', role: 'candidate', name: '이낙선' }
          }

          // 테스트 계정 체크
          const account = testAccounts[credentials.email]
          if (account) {
            return {
              id: account.id,
              email: credentials.email,
              role: account.role,
              name: account.name,
              accessToken: 'mock_jwt_token_' + Date.now()
            } as User
          }

          // 테스트 계정이 아닌 경우 공천 시스템 체크
          const nominationInfo = await checkNominationStatus(credentials.email)

          if (!nominationInfo) {
            throw new Error('공천 시스템에 등록되지 않은 이메일입니다.')
          }

          // status가 pass가 아니면 로그인 불가
          if (nominationInfo.status !== 'pass') {
            throw new Error('NOMINATION_NOT_CONFIRMED')
          }

          // 공천 승인된 후보자 로그인 성공
          return {
            id: nominationInfo.candidateId,
            email: credentials.email,
            role: 'candidate',
            name: nominationInfo.name,
            nominationStatus: nominationInfo.status,
            accessToken: 'mock_jwt_token_' + Date.now()
          } as User

        } catch (error) {
          console.error('Login failed:', error)
          if (error instanceof Error) {
            throw error
          }
          throw new Error('로그인 중 오류가 발생했습니다.')
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.name = user.name
        token.nominationStatus = user.nominationStatus
        token.accessToken = user.accessToken
      }
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        name: token.name,
        nominationStatus: token.nominationStatus
      }
      session.accessToken = token.accessToken
      return session
    }
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }