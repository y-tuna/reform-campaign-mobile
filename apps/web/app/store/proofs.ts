import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProofStatus = 'pending' | 'on_hold' | 'completed' | 'rejected'
export type ProofType = 'activity_photo' | 'receipt' | 'meeting_photo' | 'document_photo' | 'other'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
  address?: string
}

export interface ProofMetadata {
  timestamp: string
  location?: LocationData
  deviceInfo: {
    userAgent: string
    platform: string
    language: string
  }
  fileSize: number
  fileType: string
  dimensions?: {
    width: number
    height: number
  }
}

export interface ProofUpload {
  id: string
  title: string
  description: string
  type: ProofType
  status: ProofStatus
  fileUrl?: string
  fileName?: string
  thumbnailUrl?: string
  metadata: ProofMetadata
  uploadedAt: string
  verifiedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  tags: string[]
  relatedTaskId?: string
  verificationNotes?: string
}

export interface ProofUploadWizardState {
  currentStep: number
  selectedFile: File | null
  capturedLocation: LocationData | null
  isCapturingLocation: boolean
  previewUrl: string | null
  formData: {
    title: string
    description: string
    type: ProofType
    tags: string[]
  }
}

export interface ProofsState {
  proofs: ProofUpload[]
  wizardState: ProofUploadWizardState
  uploadInProgress: string[]
  filters: {
    status: ProofStatus | 'all'
    type: ProofType | 'all'
    dateRange: [string?, string?]
  }
}

interface ProofsActions {
  // Wizard actions
  setWizardStep: (step: number) => void
  setSelectedFile: (file: File | null) => void
  setCapturedLocation: (location: LocationData | null) => void
  setIsCapturingLocation: (capturing: boolean) => void
  setPreviewUrl: (url: string | null) => void
  updateFormData: (data: Partial<ProofUploadWizardState['formData']>) => void
  resetWizard: () => void
  
  // Proof management
  uploadProof: (wizardData: ProofUploadWizardState) => Promise<string>
  updateProofStatus: (id: string, status: ProofStatus, notes?: string) => void
  deleteProof: (id: string) => void
  
  // Location services
  captureCurrentLocation: () => Promise<LocationData>
  reverseGeocode: (lat: number, lng: number) => Promise<string>
  
  // Filters
  setStatusFilter: (status: ProofStatus | 'all') => void
  setTypeFilter: (type: ProofType | 'all') => void
  setDateRangeFilter: (range: [string?, string?]) => void
  
  // Utility
  addUploadInProgress: (id: string) => void
  removeUploadInProgress: (id: string) => void
}

// Mock proof data for development
const mockProofs: ProofUpload[] = [
  {
    id: 'proof-1',
    title: '아침 거리 캠페인 현장',
    description: '강남역 2번 출구에서 아침 출근길 유권자들과 인사',
    type: 'activity_photo',
    status: 'completed',
    fileName: 'street_campaign_0801.jpg',
    fileUrl: '/mock-images/street_campaign.jpg',
    thumbnailUrl: '/mock-images/street_campaign_thumb.jpg',
    metadata: {
      timestamp: '2024-08-01T07:30:00Z',
      location: {
        latitude: 37.4979,
        longitude: 127.0276,
        accuracy: 10,
        timestamp: '2024-08-01T07:30:00Z',
        address: '서울특별시 강남구 강남대로 지하철 2호선 강남역 2번 출구'
      },
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        platform: 'iPhone',
        language: 'ko-KR'
      },
      fileSize: 2048576,
      fileType: 'image/jpeg',
      dimensions: { width: 1920, height: 1080 }
    },
    uploadedAt: '2024-08-01T07:35:00Z',
    verifiedAt: '2024-08-01T09:15:00Z',
    tags: ['거리캠페인', '강남역', '아침', '유권자만남'],
    relatedTaskId: 'task-1',
    verificationNotes: '활동 내용이 명확히 확인되었습니다.'
  },
  {
    id: 'proof-2',
    title: '홍보물 인쇄 영수증',
    description: '선거 전단지 5000장 인쇄 영수증',
    type: 'receipt',
    status: 'on_hold',
    fileName: 'printing_receipt_0802.pdf',
    fileUrl: '/mock-images/receipt.pdf',
    metadata: {
      timestamp: '2024-08-02T14:20:00Z',
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        platform: 'Windows',
        language: 'ko-KR'
      },
      fileSize: 156789,
      fileType: 'application/pdf'
    },
    uploadedAt: '2024-08-02T14:25:00Z',
    tags: ['영수증', '홍보물', '인쇄비'],
    relatedTaskId: 'task-2',
    verificationNotes: '영수증 항목 중 일부 내용 확인 필요'
  },
  {
    id: 'proof-3',
    title: '상인회 간담회 사진',
    description: '강남상가번영회와의 정책 간담회',
    type: 'meeting_photo',
    status: 'pending',
    fileName: 'meeting_merchants_0803.jpg',
    fileUrl: '/mock-images/meeting.jpg',
    thumbnailUrl: '/mock-images/meeting_thumb.jpg',
    metadata: {
      timestamp: '2024-08-03T15:00:00Z',
      location: {
        latitude: 37.4981,
        longitude: 127.0278,
        accuracy: 8,
        timestamp: '2024-08-03T15:00:00Z',
        address: '서울특별시 강남구 강남상가번영회 회의실'
      },
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        platform: 'iPhone',
        language: 'ko-KR'
      },
      fileSize: 3145728,
      fileType: 'image/jpeg',
      dimensions: { width: 2048, height: 1536 }
    },
    uploadedAt: '2024-08-03T15:30:00Z',
    tags: ['간담회', '상인회', '정책협의']
  },
  {
    id: 'proof-4',
    title: '선거 비용 지출 영수증',
    description: '현수막 제작비 영수증',
    type: 'receipt',
    status: 'rejected',
    fileName: 'banner_receipt_0804.jpg',
    fileUrl: '/mock-images/banner_receipt.jpg',
    metadata: {
      timestamp: '2024-08-04T11:45:00Z',
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Android 14; Mobile)',
        platform: 'Android',
        language: 'ko-KR'
      },
      fileSize: 896432,
      fileType: 'image/jpeg',
      dimensions: { width: 1080, height: 1920 }
    },
    uploadedAt: '2024-08-04T12:00:00Z',
    rejectedAt: '2024-08-04T16:30:00Z',
    rejectionReason: '영수증 이미지가 흐려서 내용을 정확히 확인할 수 없습니다. 더 선명한 사진으로 다시 업로드해 주세요.',
    tags: ['영수증', '현수막', '제작비']
  }
]

const initialWizardState: ProofUploadWizardState = {
  currentStep: 0,
  selectedFile: null,
  capturedLocation: null,
  isCapturingLocation: false,
  previewUrl: null,
  formData: {
    title: '',
    description: '',
    type: 'activity_photo',
    tags: []
  }
}

export const useProofsStore = create<ProofsState & ProofsActions>()(
  persist(
    (set, get) => ({
      proofs: mockProofs,
      wizardState: initialWizardState,
      uploadInProgress: [],
      filters: {
        status: 'all',
        type: 'all',
        dateRange: [undefined, undefined]
      },

      // Wizard actions
      setWizardStep: (step) =>
        set((state) => ({
          wizardState: { ...state.wizardState, currentStep: step }
        })),

      setSelectedFile: (file) =>
        set((state) => ({
          wizardState: { ...state.wizardState, selectedFile: file }
        })),

      setCapturedLocation: (location) =>
        set((state) => ({
          wizardState: { ...state.wizardState, capturedLocation: location }
        })),

      setIsCapturingLocation: (capturing) =>
        set((state) => ({
          wizardState: { ...state.wizardState, isCapturingLocation: capturing }
        })),

      setPreviewUrl: (url) =>
        set((state) => ({
          wizardState: { ...state.wizardState, previewUrl: url }
        })),

      updateFormData: (data) =>
        set((state) => ({
          wizardState: {
            ...state.wizardState,
            formData: { ...state.wizardState.formData, ...data }
          }
        })),

      resetWizard: () =>
        set((state) => ({
          wizardState: initialWizardState
        })),

      // Location services
      captureCurrentLocation: async () => {
        const { setIsCapturingLocation, setCapturedLocation, reverseGeocode } = get()
        
        setIsCapturingLocation(true)
        
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            setIsCapturingLocation(false)
            reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'))
            return
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString()
              }

              try {
                // Try to get address (mock implementation)
                const address = await reverseGeocode(locationData.latitude, locationData.longitude)
                locationData.address = address
              } catch (error) {
                console.warn('Failed to get address:', error)
              }

              setCapturedLocation(locationData)
              setIsCapturingLocation(false)
              resolve(locationData)
            },
            (error) => {
              setIsCapturingLocation(false)
              let errorMessage = '위치 정보를 가져올 수 없습니다.'
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = '위치 정보 접근이 거부되었습니다.'
                  break
                case error.POSITION_UNAVAILABLE:
                  errorMessage = '위치 정보를 사용할 수 없습니다.'
                  break
                case error.TIMEOUT:
                  errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
                  break
              }
              
              reject(new Error(errorMessage))
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000
            }
          )
        })
      },

      reverseGeocode: async (lat: number, lng: number): Promise<string> => {
        // Mock geocoding - in real app would use Google Maps or Kakao Maps API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock Korean addresses based on coordinates
        if (lat > 37.49 && lat < 37.51 && lng > 127.02 && lng < 127.03) {
          return '서울특별시 강남구 역삼동'
        } else if (lat > 37.56 && lat < 37.58 && lng > 126.96 && lng < 126.98) {
          return '서울특별시 중구 명동'
        } else {
          return `서울특별시 (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        }
      },

      // Proof management
      uploadProof: async (wizardData) => {
        const { addUploadInProgress, removeUploadInProgress } = get()
        const proofId = `proof-${Date.now()}`
        
        addUploadInProgress(proofId)

        try {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 2000))

          const newProof: ProofUpload = {
            id: proofId,
            title: wizardData.formData.title,
            description: wizardData.formData.description,
            type: wizardData.formData.type,
            status: 'pending',
            fileName: wizardData.selectedFile?.name,
            fileUrl: wizardData.previewUrl || undefined,
            thumbnailUrl: wizardData.previewUrl || undefined,
            metadata: {
              timestamp: new Date().toISOString(),
              location: wizardData.capturedLocation || undefined,
              deviceInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
              },
              fileSize: wizardData.selectedFile?.size || 0,
              fileType: wizardData.selectedFile?.type || 'unknown',
              dimensions: undefined // Would be extracted from image in real app
            },
            uploadedAt: new Date().toISOString(),
            tags: wizardData.formData.tags
          }

          set((state) => ({
            proofs: [newProof, ...state.proofs]
          }))

          return proofId
        } finally {
          removeUploadInProgress(proofId)
        }
      },

      updateProofStatus: (id, status, notes) =>
        set((state) => ({
          proofs: state.proofs.map(proof =>
            proof.id === id
              ? {
                  ...proof,
                  status,
                  verifiedAt: status === 'completed' ? new Date().toISOString() : proof.verifiedAt,
                  rejectedAt: status === 'rejected' ? new Date().toISOString() : proof.rejectedAt,
                  verificationNotes: notes || proof.verificationNotes
                }
              : proof
          )
        })),

      deleteProof: (id) =>
        set((state) => ({
          proofs: state.proofs.filter(proof => proof.id !== id)
        })),

      // Filters
      setStatusFilter: (status) =>
        set((state) => ({
          filters: { ...state.filters, status }
        })),

      setTypeFilter: (type) =>
        set((state) => ({
          filters: { ...state.filters, type }
        })),

      setDateRangeFilter: (range) =>
        set((state) => ({
          filters: { ...state.filters, dateRange: range }
        })),

      // Utility
      addUploadInProgress: (id) =>
        set((state) => ({
          uploadInProgress: [...state.uploadInProgress, id]
        })),

      removeUploadInProgress: (id) =>
        set((state) => ({
          uploadInProgress: state.uploadInProgress.filter(uploadId => uploadId !== id)
        }))
    }),
    {
      name: 'proofs-storage',
      // Don't persist file objects and preview URLs
      partialize: (state) => ({
        proofs: state.proofs,
        filters: state.filters,
        wizardState: {
          ...state.wizardState,
          selectedFile: null,
          previewUrl: null
        }
      })
    }
  )
)