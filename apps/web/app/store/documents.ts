import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected'
export type DocumentCategory = 'personal' | 'financial' | 'campaign' | 'legal' | 'party'

export interface Document {
  id: string
  title: string
  description: string
  required: boolean
  category: DocumentCategory
  status: DocumentStatus
  fileUrl?: string
  fileName?: string
  fileSize?: number
  uploadedAt?: string
  rejectionReason?: string
  dueDate?: string
  priority: 'high' | 'medium' | 'low'
  guideText?: string
  sampleUrl?: string
}

export interface DocumentGuideStep {
  id: string
  title: string
  description: string
  completed: boolean
  order: number
  documents: string[] // Document IDs associated with this step
}

export interface DocumentsState {
  documents: Document[]
  guideSteps: DocumentGuideStep[]
  currentStep: number
  overallProgress: number
  uploadInProgress: string[]
}

interface DocumentsActions {
  updateDocumentStatus: (id: string, status: DocumentStatus, rejectionReason?: string) => void
  uploadDocument: (id: string, file: File) => Promise<void>
  markStepCompleted: (stepId: string) => void
  setCurrentStep: (step: number) => void
  addUploadInProgress: (docId: string) => void
  removeUploadInProgress: (docId: string) => void
  calculateProgress: () => void
}

// Korean election campaign documents based on real requirements
const campaignDocuments: Document[] = [
  // Personal Documents
  {
    id: 'doc-personal-1',
    title: '주민등록등본',
    description: '최근 3개월 이내 발급된 주민등록등본 (주소지 확인용)',
    required: true,
    category: 'personal',
    status: 'pending',
    dueDate: '2024-02-15',
    priority: 'high',
    guideText: '주민센터나 온라인 민원24에서 발급 가능합니다.',
    sampleUrl: '/samples/resident-registration.pdf'
  },
  {
    id: 'doc-personal-2',
    title: '후보자 사진',
    description: '선거 공보물용 후보자 증명사진 (3x4cm, 최근 6개월 이내)',
    required: true,
    category: 'personal',
    status: 'verified',
    fileName: 'candidate-photo.jpg',
    fileSize: 125432,
    uploadedAt: '2024-01-10T10:00:00Z',
    priority: 'high'
  },
  
  // Legal Documents
  {
    id: 'doc-legal-1',
    title: '후보자등록신청서',
    description: '선거관리위원회 양식에 따른 후보자등록신청서',
    required: true,
    category: 'legal',
    status: 'pending',
    dueDate: '2024-02-10',
    priority: 'high',
    guideText: '중앙선거관리위원회 홈페이지에서 양식을 다운로드하여 작성하세요.',
    sampleUrl: '/samples/candidate-registration.pdf'
  },
  {
    id: 'doc-legal-2',
    title: '정당추천서',
    description: '개혁신당 중앙당에서 발급한 정당추천서',
    required: true,
    category: 'party',
    status: 'verified',
    fileName: 'party-recommendation.pdf',
    fileSize: 245760,
    uploadedAt: '2024-01-10T10:00:00Z',
    priority: 'high'
  },
  {
    id: 'doc-legal-3',
    title: '선거비용제한액 확인서',
    description: '해당 선거구의 선거비용 제한액 확인서',
    required: true,
    category: 'legal',
    status: 'uploaded',
    fileName: 'expense-limit.pdf',
    fileSize: 186750,
    uploadedAt: '2024-01-12T14:30:00Z',
    priority: 'high'
  },
  
  // Financial Documents
  {
    id: 'doc-financial-1',
    title: '재산신고서',
    description: '후보자 본인 및 배우자의 재산신고서',
    required: true,
    category: 'financial',
    status: 'uploaded',
    fileName: 'asset-declaration.pdf',
    fileSize: 1024000,
    uploadedAt: '2024-01-12T14:30:00Z',
    priority: 'high',
    guideText: '국세청 홈택스에서 재산신고서를 발급받으세요.'
  },
  {
    id: 'doc-financial-2',
    title: '선거비용 회계책임자 지정신고서',
    description: '선거비용 회계책임자 지정 및 신고서',
    required: true,
    category: 'financial',
    status: 'pending',
    dueDate: '2024-02-08',
    priority: 'high'
  },
  
  // Campaign Materials
  {
    id: 'doc-campaign-1',
    title: '공약서',
    description: '주요 정책 및 공약사항을 정리한 공약서',
    required: true,
    category: 'campaign',
    status: 'pending',
    dueDate: '2024-02-20',
    priority: 'medium',
    guideText: '개혁신당 정책 가이드라인에 따라 작성하세요.'
  },
  {
    id: 'doc-campaign-2',
    title: '선거공보 원고',
    description: '선거공보물에 게재될 원고 및 사진',
    required: true,
    category: 'campaign',
    status: 'pending',
    dueDate: '2024-02-25',
    priority: 'medium'
  },
  
  // Optional Documents
  {
    id: 'doc-personal-3',
    title: '학력증명서',
    description: '최종학력증명서 또는 졸업증명서',
    required: false,
    category: 'personal',
    status: 'rejected',
    fileName: 'education-cert.pdf',
    rejectionReason: '파일이 손상되었습니다. 다시 업로드해주세요.',
    priority: 'low'
  },
  {
    id: 'doc-personal-4',
    title: '경력증명서',
    description: '주요 경력사항을 증명하는 서류',
    required: false,
    category: 'personal',
    status: 'pending',
    priority: 'low'
  }
]

const documentGuideSteps: DocumentGuideStep[] = [
  {
    id: 'step-1',
    title: '필수 서류 확인',
    description: '선거 출마에 필요한 필수 서류 목록을 확인하고 준비하세요.',
    completed: true,
    order: 1,
    documents: []
  },
  {
    id: 'step-2', 
    title: '개인 신분 서류 준비',
    description: '주민등록등본, 후보자 사진 등 개인 신분 관련 서류를 준비하세요.',
    completed: false,
    order: 2,
    documents: ['doc-personal-1', 'doc-personal-2', 'doc-personal-3', 'doc-personal-4']
  },
  {
    id: 'step-3',
    title: '법적 서류 준비',
    description: '후보자등록신청서, 정당추천서 등 법적 효력이 있는 서류를 준비하세요.',
    completed: false,
    order: 3,
    documents: ['doc-legal-1', 'doc-legal-2', 'doc-legal-3']
  },
  {
    id: 'step-4',
    title: '재정 관련 서류 준비',
    description: '재산신고서, 회계책임자 지정서 등 재정 관련 서류를 준비하세요.',
    completed: false,
    order: 4,
    documents: ['doc-financial-1', 'doc-financial-2']
  },
  {
    id: 'step-5',
    title: '캠페인 자료 준비',
    description: '공약서, 선거공보 원고 등 캠페인 관련 자료를 준비하세요.',
    completed: false,
    order: 5,
    documents: ['doc-campaign-1', 'doc-campaign-2']
  },
  {
    id: 'step-6',
    title: '최종 검토 및 제출',
    description: '모든 서류를 최종 검토하고 선거관리위원회에 제출하세요.',
    completed: false,
    order: 6,
    documents: []
  }
]

export const useDocumentsStore = create<DocumentsState & DocumentsActions>()(
  persist(
    (set, get) => ({
      documents: campaignDocuments,
      guideSteps: documentGuideSteps,
      currentStep: 1,
      overallProgress: 0,
      uploadInProgress: [],

      updateDocumentStatus: (id, status, rejectionReason) =>
        set((state) => ({
          documents: state.documents.map(doc =>
            doc.id === id 
              ? { 
                  ...doc, 
                  status,
                  rejectionReason: status === 'rejected' ? rejectionReason : undefined,
                  uploadedAt: status === 'uploaded' || status === 'verified' ? new Date().toISOString() : doc.uploadedAt
                } 
              : doc
          )
        })),

      uploadDocument: async (id, file) => {
        const { addUploadInProgress, removeUploadInProgress, updateDocumentStatus } = get()
        addUploadInProgress(id)
        
        try {
          // Simulate file upload with progress
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Update document with file info
          set((state) => ({
            documents: state.documents.map(doc =>
              doc.id === id ? {
                ...doc,
                status: 'uploaded' as DocumentStatus,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                fileUrl: URL.createObjectURL(file)
              } : doc
            )
          }))
          
          // Auto-verify some documents after upload (simulation)
          setTimeout(() => {
            if (Math.random() > 0.3) { // 70% success rate
              updateDocumentStatus(id, 'verified')
            }
          }, 3000)
          
        } catch (error) {
          updateDocumentStatus(id, 'rejected', '업로드 중 오류가 발생했습니다.')
          throw error
        } finally {
          removeUploadInProgress(id)
          get().calculateProgress()
        }
      },

      markStepCompleted: (stepId) => {
        set((state) => ({
          guideSteps: state.guideSteps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        }))
        get().calculateProgress()
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      addUploadInProgress: (docId) =>
        set((state) => ({
          uploadInProgress: [...state.uploadInProgress, docId]
        })),

      removeUploadInProgress: (docId) =>
        set((state) => ({
          uploadInProgress: state.uploadInProgress.filter(id => id !== docId)
        })),

      calculateProgress: () => {
        const { documents, guideSteps } = get()
        
        // Calculate document progress
        const requiredDocs = documents.filter(doc => doc.required)
        const completedDocs = requiredDocs.filter(doc => 
          doc.status === 'verified' || doc.status === 'uploaded'
        )
        const docProgress = (completedDocs.length / requiredDocs.length) * 70 // 70% weight for documents
        
        // Calculate step progress
        const completedSteps = guideSteps.filter(step => step.completed)
        const stepProgress = (completedSteps.length / guideSteps.length) * 30 // 30% weight for steps
        
        const overallProgress = Math.round(docProgress + stepProgress)
        
        set({ overallProgress })
      }
    }),
    {
      name: 'documents-storage-v2'
    }
  )
)

// Initialize progress calculation
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useDocumentsStore.getState().calculateProgress()
  }, 100)
}