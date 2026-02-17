import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get the session on client side
    if (typeof window !== 'undefined') {
      const session = await getSession()
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// API service functions
export const authApi = {
  // Request SMS OTP
  requestOTP: async (phone: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-sms`, {
      phone
    })
    return response.data
  },

  // Verify OTP (used by NextAuth)
  verifyOTP: async (phone: string, otpTxId: string, code: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-otp`, {
      phone,
      otpTxId,
      code
    })
    return response.data
  }
}

// Protected API calls (require authentication)
export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get('/profile')
    return response.data
  },

  updateProfile: async (profileData: any) => {
    const response = await apiClient.put('/profile', profileData)
    return response.data
  }
}

export const tasksApi = {
  getTasks: async (params?: any) => {
    const response = await apiClient.get('/tasks', { params })
    return response.data
  },

  getTask: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}`)
    return response.data
  },

  createTask: async (taskData: any) => {
    const response = await apiClient.post('/tasks', taskData)
    return response.data
  },

  updateTask: async (taskId: string, taskData: any) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData)
    return response.data
  }
}

export const broadcastsApi = {
  getBroadcasts: async (params?: any) => {
    const response = await apiClient.get('/broadcasts', { params })
    return response.data
  },

  createBroadcast: async (broadcastData: any) => {
    const response = await apiClient.post('/broadcasts', broadcastData)
    return response.data
  }
}

// Mock API responses for development (will be replaced with real API)
export const mockApi = {
  requestOTP: async (phone: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      otpTxId: `mock_${Date.now()}`,
      message: 'OTP sent successfully'
    }
  },

  verifyOTP: async (phone: string, otpTxId: string, code: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation - in real implementation this would be server-side
    if (code === '123456') {
      const mockUser = {
        id: 'mock_user_id',
        phone,
        role: phone === '+821012345678' ? 'admin' : 'candidate',
        name: phone === '+821012345678' ? '관리자' : '김후보'
      }
      
      return {
        success: true,
        jwt: 'mock_jwt_token_' + Date.now(),
        user: mockUser
      }
    } else {
      throw new Error('Invalid OTP code')
    }
  }
}

export default apiClient