'use client'

import React from 'react'
import { 
  Card, 
  Steps, 
  Upload, 
  Button, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Progress, 
  Alert, 
  List, 
  Badge, 
  Image,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Modal
} from 'antd'
import { 
  UploadOutlined, 
  CameraOutlined, 
  EnvironmentOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useProofsStore } from '../store/proofs'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

const proofTypeLabels = {
  activity_photo: '활동 사진',
  receipt: '영수증',
  meeting_photo: '회의 사진',
  document_photo: '서류 사진',
  other: '기타'
}

const statusLabels = {
  pending: '검토 중',
  on_hold: '보류',
  completed: '승인',
  rejected: '거부'
}

const statusColors = {
  pending: 'processing',
  on_hold: 'warning',
  completed: 'success',
  rejected: 'error'
} as const

const ProofUploadWizard = () => {
  const {
    wizardState,
    setWizardStep,
    setSelectedFile,
    setCapturedLocation,
    setIsCapturingLocation,
    setPreviewUrl,
    updateFormData,
    resetWizard,
    captureCurrentLocation,
    uploadProof
  } = useProofsStore()

  const [form] = Form.useForm()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    setPreviewUrl(previewUrl)
    return false // Prevent auto upload
  }

  const handleLocationCapture = async () => {
    try {
      const location = await captureCurrentLocation()
      message.success('위치 정보가 성공적으로 캡처되었습니다.')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '위치 정보를 가져올 수 없습니다.')
    }
  }

  const handleFormSubmit = async (values: any) => {
    updateFormData(values)
    try {
      await uploadProof(wizardState)
      message.success('증빙 자료가 성공적으로 업로드되었습니다.')
      resetWizard()
      form.resetFields()
    } catch (error) {
      message.error('업로드 중 오류가 발생했습니다.')
    }
  }

  const steps = [
    {
      title: '파일 선택',
      description: '증빙 파일을 선택하세요'
    },
    {
      title: '위치 정보',
      description: 'GPS 좌표를 캡처하세요'
    },
    {
      title: '상세 정보',
      description: '제목과 설명을 입력하세요'
    },
    {
      title: '업로드 완료',
      description: '최종 검토 후 업로드하세요'
    }
  ]

  const renderStepContent = () => {
    switch (wizardState.currentStep) {
      case 0:
        return (
          <div className="text-center py-8">
            <Upload.Dragger
              accept="image/*,.pdf"
              beforeUpload={handleFileSelect}
              showUploadList={false}
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">클릭하거나 파일을 드래그하여 업로드</p>
              <p className="ant-upload-hint">
                사진 파일(JPG, PNG) 또는 PDF 파일을 선택하세요
              </p>
            </Upload.Dragger>
            
            {wizardState.selectedFile && (
              <Card className="mt-4">
                <Text strong>선택된 파일: </Text>
                <Text>{wizardState.selectedFile.name}</Text>
                <br />
                <Text type="secondary">크기: {(wizardState.selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>
              </Card>
            )}

            <div className="mt-6">
              <Button
                type="primary"
                disabled={!wizardState.selectedFile}
                onClick={() => setWizardStep(1)}
              >
                다음 단계
              </Button>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="py-8">
            <div className="text-center mb-6">
              <EnvironmentOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>위치 정보 캡처</Title>
              <Text type="secondary">
                증빙 자료의 신뢰성을 위해 현재 위치를 기록합니다.
              </Text>
            </div>

            {wizardState.capturedLocation && (
              <Card className="mb-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>위도: </Text>
                    <Text>{wizardState.capturedLocation.latitude.toFixed(6)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>경도: </Text>
                    <Text>{wizardState.capturedLocation.longitude.toFixed(6)}</Text>
                  </Col>
                </Row>
                {wizardState.capturedLocation.address && (
                  <div className="mt-2">
                    <Text strong>주소: </Text>
                    <Text>{wizardState.capturedLocation.address}</Text>
                  </div>
                )}
                <div className="mt-2">
                  <Text strong>정확도: </Text>
                  <Text>{wizardState.capturedLocation.accuracy}m</Text>
                </div>
              </Card>
            )}

            <div className="text-center">
              <Space direction="vertical">
                <Button
                  type="primary"
                  icon={<EnvironmentOutlined />}
                  loading={wizardState.isCapturingLocation}
                  onClick={handleLocationCapture}
                  disabled={!!wizardState.capturedLocation}
                >
                  {wizardState.capturedLocation ? '위치 캡처 완료' : '현재 위치 캡처'}
                </Button>
                
                <Space>
                  <Button onClick={() => setWizardStep(0)}>이전</Button>
                  <Button
                    type="primary"
                    disabled={!wizardState.capturedLocation}
                    onClick={() => setWizardStep(2)}
                  >
                    다음 단계
                  </Button>
                </Space>
              </Space>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="py-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                updateFormData(values)
                setWizardStep(3)
              }}
            >
              <Form.Item
                name="title"
                label="제목"
                rules={[{ required: true, message: '제목을 입력해주세요' }]}
              >
                <Input placeholder="증빙 자료의 제목을 입력하세요" />
              </Form.Item>

              <Form.Item
                name="description"
                label="설명"
                rules={[{ required: true, message: '설명을 입력해주세요' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="증빙 자료에 대한 상세 설명을 입력하세요"
                />
              </Form.Item>

              <Form.Item
                name="type"
                label="유형"
                rules={[{ required: true, message: '유형을 선택해주세요' }]}
              >
                <Select placeholder="증빙 자료 유형을 선택하세요">
                  {Object.entries(proofTypeLabels).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="tags" label="태그">
                <Select
                  mode="tags"
                  placeholder="관련 태그를 입력하세요 (Enter로 추가)"
                  tokenSeparators={[',']}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button onClick={() => setWizardStep(1)}>이전</Button>
                  <Button type="primary" htmlType="submit">
                    다음 단계
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )

      case 3:
        return (
          <div className="py-8">
            <div className="text-center mb-6">
              <CheckCircleOutlined className="text-4xl text-green-500 mb-4" />
              <Title level={4}>업로드 준비 완료</Title>
              <Text type="secondary">입력하신 정보를 확인하고 업로드하세요.</Text>
            </div>

            <Card className="mb-6">
              <Title level={5}>파일 정보</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>파일명: </Text>
                  <Text>{wizardState.selectedFile?.name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>유형: </Text>
                  <Text>{proofTypeLabels[wizardState.formData.type]}</Text>
                </Col>
              </Row>
              
              <Divider />
              
              <Title level={5}>내용</Title>
              <div className="mb-2">
                <Text strong>제목: </Text>
                <Text>{wizardState.formData.title}</Text>
              </div>
              <div className="mb-2">
                <Text strong>설명: </Text>
                <Text>{wizardState.formData.description}</Text>
              </div>
              {wizardState.formData.tags.length > 0 && (
                <div>
                  <Text strong>태그: </Text>
                  <Space wrap>
                    {wizardState.formData.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </div>
              )}

              <Divider />

              {wizardState.capturedLocation && (
                <>
                  <Title level={5}>위치 정보</Title>
                  <Text type="secondary">
                    {wizardState.capturedLocation.address || 
                     `${wizardState.capturedLocation.latitude.toFixed(6)}, ${wizardState.capturedLocation.longitude.toFixed(6)}`}
                  </Text>
                </>
              )}
            </Card>

            {wizardState.previewUrl && (
              <Card className="mb-6">
                <Title level={5}>미리보기</Title>
                <Image
                  src={wizardState.previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300 }}
                />
              </Card>
            )}

            <div className="text-center">
              <Space>
                <Button onClick={() => setWizardStep(2)}>이전</Button>
                <Button type="primary" onClick={() => handleFormSubmit(wizardState.formData)}>
                  업로드
                </Button>
              </Space>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <Title level={3} className="mb-6">증빙 자료 업로드</Title>
      
      <Steps
        current={wizardState.currentStep}
        items={steps}
        className="mb-8"
      />
      
      {renderStepContent()}
    </Card>
  )
}

const ProofsList = () => {
  const { proofs, updateProofStatus, deleteProof, filters, setStatusFilter, setTypeFilter } = useProofsStore()
  const [previewModal, setPreviewModal] = React.useState<{visible: boolean, proof: any}>({
    visible: false,
    proof: null
  })

  const filteredProofs = proofs.filter(proof => {
    if (filters.status !== 'all' && proof.status !== filters.status) return false
    if (filters.type !== 'all' && proof.type !== filters.type) return false
    return true
  })

  const handleStatusChange = (proofId: string, newStatus: any) => {
    updateProofStatus(proofId, newStatus)
    message.success('상태가 업데이트되었습니다.')
  }

  const handleDelete = (proofId: string) => {
    Modal.confirm({
      title: '증빙 자료 삭제',
      content: '정말로 이 증빙 자료를 삭제하시겠습니까?',
      onOk: () => {
        deleteProof(proofId)
        message.success('증빙 자료가 삭제되었습니다.')
      }
    })
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>증빙 자료 목록</Title>
        <Space>
          <Select
            value={filters.status}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">전체 상태</Option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>
          
          <Select
            value={filters.type}
            onChange={setTypeFilter}
            style={{ width: 120 }}
          >
            <Option value="all">전체 유형</Option>
            {Object.entries(proofTypeLabels).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <List
        dataSource={filteredProofs}
        renderItem={(proof) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                onClick={() => setPreviewModal({visible: true, proof})}
              >
                상세보기
              </Button>,
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(proof.id)}
              >
                삭제
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Badge 
                  status={statusColors[proof.status]} 
                  text={statusLabels[proof.status]}
                />
              }
              title={
                <Space>
                  <span>{proof.title}</span>
                  <Tag color="blue">{proofTypeLabels[proof.type]}</Tag>
                </Space>
              }
              description={
                <div>
                  <div className="mb-2">{proof.description}</div>
                  <Space wrap>
                    {proof.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                  <div className="mt-2">
                    <Text type="secondary">
                      업로드: {new Date(proof.uploadedAt).toLocaleString('ko-KR')}
                    </Text>
                    {proof.metadata.location && (
                      <>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          위치: {proof.metadata.location.address || '좌표 정보'}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="증빙 자료 상세정보"
        open={previewModal.visible}
        onCancel={() => setPreviewModal({visible: false, proof: null})}
        footer={[
          <Select
            key="status"
            value={previewModal.proof?.status}
            onChange={(value) => {
              handleStatusChange(previewModal.proof?.id, value)
              setPreviewModal({visible: false, proof: null})
            }}
            style={{ width: 120, marginRight: 8 }}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>,
          <Button key="close" onClick={() => setPreviewModal({visible: false, proof: null})}>
            닫기
          </Button>
        ]}
        width={800}
      >
        {previewModal.proof && (
          <div>
            {previewModal.proof.fileUrl && (
              <div className="mb-4">
                <Image
                  src={previewModal.proof.fileUrl}
                  alt={previewModal.proof.title}
                  style={{ maxWidth: '100%' }}
                />
              </div>
            )}
            
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>제목: </Text>
                  <Text>{previewModal.proof.title}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>유형: </Text>
                  <Tag color="blue">{proofTypeLabels[previewModal.proof.type as keyof typeof proofTypeLabels]}</Tag>
                </Col>
              </Row>
              
              <div className="mt-3">
                <Text strong>설명: </Text>
                <Text>{previewModal.proof.description}</Text>
              </div>
              
              {previewModal.proof.metadata.location && (
                <div className="mt-3">
                  <Text strong>위치정보: </Text>
                  <Text>
                    {previewModal.proof.metadata.location.address || 
                     `${previewModal.proof.metadata.location.latitude.toFixed(6)}, ${previewModal.proof.metadata.location.longitude.toFixed(6)}`}
                  </Text>
                </div>
              )}
              
              <div className="mt-3">
                <Text strong>업로드 시간: </Text>
                <Text>{new Date(previewModal.proof.uploadedAt).toLocaleString('ko-KR')}</Text>
              </div>
              
              {previewModal.proof.rejectionReason && (
                <Alert
                  type="error"
                  message="거부 사유"
                  description={previewModal.proof.rejectionReason}
                  className="mt-3"
                />
              )}
            </Card>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default function ProofsPage() {
  const [activeTab, setActiveTab] = React.useState('upload')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>증빙 자료 관리</Title>
        <Text type="secondary">
          캠페인 활동 증빙 자료를 업로드하고 관리하세요. GPS와 타임스탬프가 자동으로 기록됩니다.
        </Text>
      </div>

      <div className="mb-6">
        <Space>
          <Button 
            type={activeTab === 'upload' ? 'primary' : 'default'}
            onClick={() => setActiveTab('upload')}
            icon={<UploadOutlined />}
          >
            증빙 업로드
          </Button>
          <Button 
            type={activeTab === 'list' ? 'primary' : 'default'}
            onClick={() => setActiveTab('list')}
            icon={<FileImageOutlined />}
          >
            자료 목록
          </Button>
        </Space>
      </div>

      {activeTab === 'upload' && <ProofUploadWizard />}
      {activeTab === 'list' && <ProofsList />}
    </div>
  )
}