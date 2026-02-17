'use client'

import React, { useState, useCallback } from 'react'
import {
  Upload,
  Modal,
  Progress,
  Alert,
  Space,
  Button,
  Typography,
  Image,
  message,
  List,
  Card
} from 'antd'
import {
  UploadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const { Dragger } = Upload
const { Text, Paragraph } = Typography

// File validation schema
const fileUploadSchema = z.object({
  files: z.array(z.any()).min(1, '최소 1개 파일을 선택해주세요')
})

type FileUploadData = z.infer<typeof fileUploadSchema>

interface DocumentUploadProps {
  documentId: string
  documentTitle: string
  maxFiles?: number
  maxSize?: number // MB
  acceptedTypes?: string[]
  onUploadComplete: (files: UploadedFile[]) => void
  onUploadProgress?: (progress: number) => void
  multiple?: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: 'uploading' | 'success' | 'error'
  progress: number
}

const defaultAcceptedTypes = [
  'application/pdf',
  'image/jpeg', 
  'image/jpg',
  'image/png'
]

const getFileIcon = (type: string) => {
  if (type === 'application/pdf') {
    return <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
  } else if (type.startsWith('image/')) {
    return <FileImageOutlined style={{ fontSize: 24, color: '#52c41a' }} />
  }
  return <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function DocumentUpload({
  documentId,
  documentTitle,
  maxFiles = 1,
  maxSize = 10,
  acceptedTypes = defaultAcceptedTypes,
  onUploadComplete,
  onUploadProgress,
  multiple = false
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FileUploadData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: { files: [] }
  })

  const watchedFiles = watch('files')

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기가 ${maxSize}MB를 초과합니다.`
    }

    // Check duplicate names
    if (uploadedFiles.some(f => f.name === file.name)) {
      return '같은 이름의 파일이 이미 존재합니다.'
    }

    return null
  }, [acceptedTypes, maxSize, uploadedFiles])

  const simulateUpload = async (file: File): Promise<UploadedFile> => {
    const fileId = `${documentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      uploadedFile.progress = progress
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress } : f)
      )
      
      if (onUploadProgress) {
        onUploadProgress(progress)
      }
    }

    uploadedFile.status = 'success'
    return uploadedFile
  }

  const handleFileUpload = async (fileList: File[]) => {
    if (uploadedFiles.length + fileList.length > maxFiles) {
      message.error(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)

    try {
      const validFiles: File[] = []
      
      // Validate all files first
      for (const file of fileList) {
        const error = validateFile(file)
        if (error) {
          message.error(`${file.name}: ${error}`)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) {
        setUploading(false)
        return
      }

      // Initialize upload status
      const initialFiles: UploadedFile[] = validFiles.map((file, index) => ({
        id: `${documentId}-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        status: 'uploading' as const,
        progress: 0
      }))

      setUploadedFiles(prev => [...prev, ...initialFiles])

      // Upload files
      const uploadPromises = validFiles.map(async (file, index) => {
        try {
          const uploadedFile = await simulateUpload(file)
          setUploadedFiles(prev =>
            prev.map(f => f.id === initialFiles[index].id ? uploadedFile : f)
          )
          return uploadedFile
        } catch (error) {
          setUploadedFiles(prev =>
            prev.map(f => 
              f.id === initialFiles[index].id 
                ? { ...f, status: 'error' as const } 
                : f
            )
          )
          throw error
        }
      })

      const results = await Promise.allSettled(uploadPromises)
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<UploadedFile> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)

      if (successfulUploads.length > 0) {
        message.success(`${successfulUploads.length}개 파일이 성공적으로 업로드되었습니다.`)
        onUploadComplete(successfulUploads)
      }

      const failedCount = results.filter(result => result.status === 'rejected').length
      if (failedCount > 0) {
        message.error(`${failedCount}개 파일 업로드에 실패했습니다.`)
      }

    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handlePreview = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      setPreviewImage(file.url)
      setPreviewVisible(true)
    } else {
      message.info('미리보기는 이미지 파일만 지원합니다.')
    }
  }

  const customRequest = ({ file, onSuccess }: any) => {
    handleFileUpload([file])
    onSuccess('ok')
  }

  return (
    <div>
      <Alert
        message={`${documentTitle} 업로드`}
        description={`파일 형식: PDF, JPG, PNG | 최대 크기: ${maxSize}MB | 최대 개수: ${maxFiles}개`}
        type="info"
        style={{ marginBottom: 16 }}
      />

      {/* Upload Area */}
      <Dragger
        name="files"
        multiple={multiple}
        customRequest={customRequest}
        showUploadList={false}
        accept={acceptedTypes.join(',')}
        disabled={uploading || uploadedFiles.length >= maxFiles}
        style={{ marginBottom: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          파일을 드래그하거나 클릭하여 업로드하세요
        </p>
        <p className="ant-upload-hint">
          {acceptedTypes.includes('application/pdf') && 'PDF, '}
          {acceptedTypes.includes('image/jpeg') && 'JPG, '}
          {acceptedTypes.includes('image/png') && 'PNG'} 
          {' '}파일 지원 (최대 {maxSize}MB)
        </p>
      </Dragger>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card title="업로드된 파일" size="small">
          <List
            dataSource={uploadedFiles}
            renderItem={(file) => (
              <List.Item
                actions={[
                  file.type.startsWith('image/') && file.status === 'success' && (
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(file)}
                    >
                      미리보기
                    </Button>
                  ),
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={file.status === 'uploading'}
                  >
                    삭제
                  </Button>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={getFileIcon(file.type)}
                  title={
                    <Space>
                      <Text strong>{file.name}</Text>
                      {file.status === 'success' && (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      )}
                      {file.status === 'uploading' && (
                        <LoadingOutlined style={{ color: '#1890ff' }} />
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">{formatFileSize(file.size)}</Text>
                      {file.status === 'uploading' && (
                        <Progress 
                          percent={file.progress} 
                          size="small" 
                          style={{ marginTop: 4 }}
                        />
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Upload Guidelines */}
      <Alert
        message="업로드 가이드"
        description={
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>문서는 스캔 또는 고화질 사진으로 준비하세요</li>
            <li>텍스트가 선명하게 읽힐 수 있도록 확인하세요</li>
            <li>개인정보가 포함된 부분은 블러 처리를 고려하세요</li>
            <li>파일명은 문서 종류를 알 수 있게 명명하세요</li>
          </ul>
        }
        type="warning"
        style={{ marginTop: 16 }}
      />

      {/* Error Display */}
      {errors.files && (
        <Alert
          message="파일 업로드 오류"
          description={errors.files.message}
          type="error"
          style={{ marginTop: 16 }}
        />
      )}

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="이미지 미리보기"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
      >
        <Image
          alt="미리보기"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  )
}