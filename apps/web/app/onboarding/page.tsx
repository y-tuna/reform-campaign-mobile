'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Steps, 
  Form, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col,
  Radio,
  Slider,
  Switch,
  Progress,
  message
} from 'antd'
import { 
  UserOutlined, 
  SettingOutlined, 
  CheckCircleOutlined,
  MobileOutlined,
  CarOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth'
import { useProfileStore, ProfileIntensity, MobilityType, ReligionPreference } from '../store/profile'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Step } = Steps

const steps = [
  {
    title: '기본 정보',
    description: '이름과 기본 정보를 입력하세요',
    icon: <UserOutlined />
  },
  {
    title: '캠페인 설정',
    description: '활동 강도와 이동 방식을 설정하세요',
    icon: <SettingOutlined />
  },
  {
    title: 'UI 설정',
    description: '화면 설정을 완료하세요',
    icon: <MobileOutlined />
  },
  {
    title: '완료',
    description: '설정이 완료되었습니다',
    icon: <CheckCircleOutlined />
  }
]

const intensityOptions = [
  { 
    value: 'light' as ProfileIntensity, 
    label: '여유 모드',
    description: '선택적 일정만, 여유로운 페이스'
  },
  { 
    value: 'normal' as ProfileIntensity, 
    label: '보통 모드',
    description: '일반적인 캠페인 강도'
  },
  { 
    value: 'hard' as ProfileIntensity, 
    label: '집중 모드',
    description: '하루 풀 스케줄 (08:00~22:00)'
  }
]

const mobilityOptions = [
  { value: 'walk' as MobilityType, label: '도보', icon: '🚶' },
  { value: 'bike' as MobilityType, label: '자전거', icon: '🚲' },
  { value: 'trike' as MobilityType, label: '오토바이', icon: '🛵' },
  { value: 'car' as MobilityType, label: '승용차', icon: '🚗' },
  { value: 'pickup' as MobilityType, label: '승합차', icon: '🚐' }
]

export default function OnboardingPage() {
  const [form] = Form.useForm()
  const router = useRouter()
  const { user } = useAuth()
  const { updateProfile, completeOnboarding, setOnboardingStep, ...profile } = useProfileStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  // Auto-detect senior mode based on font preference
  useEffect(() => {
    if (fontSize >= 20) {
      updateProfile({ senior_ui_mode: true })
    } else {
      updateProfile({ senior_ui_mode: false })
    }
  }, [fontSize, updateProfile])

  const handleNext = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      
      // Update profile with current step values
      updateProfile(values)
      setOnboardingStep(currentStep + 1)
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      message.error('입력 정보를 확인해주세요.')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setOnboardingStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const finalValues = form.getFieldsValue()
      updateProfile({
        ...finalValues,
        senior_ui_mode: fontSize >= 20
      })
      completeOnboarding()
      
      message.success('프로필 설정이 완료되었습니다!')
      router.push('/home')
    } catch (error) {
      message.error('설정 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>환영합니다!</Title>
              <Paragraph>
                개혁신당 유세 비서에 오신 것을 환영합니다.<br />
                효율적인 캠페인을 위해 기본 정보를 설정해주세요.
              </Paragraph>
            </div>

            <Form.Item
              name="name"
              label="성명"
              rules={[{ required: true, message: '성명을 입력해주세요' }]}
              initialValue={user?.name}
            >
              <Input 
                size="large"
                placeholder="홍길동"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="이메일"
              rules={[
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
              ]}
            >
              <Input 
                size="large"
                placeholder="example@reform.kr"
              />
            </Form.Item>

            <Form.Item
              name="district"
              label="출마 지역"
              rules={[{ required: true, message: '출마 지역을 입력해주세요' }]}
            >
              <Input 
                size="large"
                placeholder="서울특별시 강남구 을"
              />
            </Form.Item>

            <Form.Item
              name="is_candidate_mode"
              label="후보자 등록 상태"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch 
                checkedChildren="후보자" 
                unCheckedChildren="예비후보"
                size="default"
              />
            </Form.Item>
          </Space>
        )

      case 1: // Campaign Settings
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>캠페인 설정</Title>
              <Paragraph>
                캠페인 활동 강도와 이동 방식을 설정하세요.<br />
                언제든지 설정에서 변경할 수 있습니다.
              </Paragraph>
            </div>

            <Form.Item
              name="intensity"
              label="활동 강도"
              rules={[{ required: true }]}
              initialValue="normal"
            >
              <Radio.Group size="large">
                <Space direction="vertical" size="middle">
                  {intensityOptions.map(option => (
                    <Radio key={option.value} value={option.value}>
                      <div>
                        <strong>{option.label}</strong>
                        <br />
                        <Text type="secondary">{option.description}</Text>
                      </div>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="mobility"
              label="주요 이동 수단"
              rules={[{ required: true }]}
              initialValue="car"
            >
              <Select size="large" placeholder="이동 수단을 선택하세요">
                {mobilityOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <Space>
                      <span>{option.icon}</span>
                      {option.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name={['religion_pref', 'preference']}
              label="종교 기관 방문 선호"
              initialValue="none"
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="none">구분하지 않음</Radio>
                  <Radio value="exclude">특정 종교 제외</Radio>
                  <Radio value="only">특정 종교만</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Space>
        )

      case 2: // UI Settings
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>화면 설정</Title>
              <Paragraph>
                보기 편한 화면으로 설정해주세요.<br />
                글자 크기를 조정하면 시니어 모드가 자동으로 활성화됩니다.
              </Paragraph>
            </div>

            <Form.Item label="글자 크기">
              <div style={{ padding: '20px 0' }}>
                <Slider
                  min={14}
                  max={24}
                  value={fontSize}
                  onChange={setFontSize}
                  marks={{
                    14: '작게',
                    16: '보통',
                    20: '크게',
                    24: '매우 크게'
                  }}
                />
                <div 
                  style={{ 
                    fontSize: fontSize, 
                    marginTop: 16,
                    padding: 16,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    textAlign: 'center'
                  }}
                >
                  이런 크기로 글자가 보입니다
                </div>
              </div>
            </Form.Item>

            {fontSize >= 20 && (
              <div style={{
                padding: 16,
                backgroundColor: '#e6f7ff',
                borderRadius: 6,
                border: '1px solid #91caff'
              }}>
                <Text style={{ color: '#1890ff' }}>
                  <CheckCircleOutlined style={{ marginRight: 8 }} />
                  시니어 모드가 활성화되어 더 큰 버튼과 간단한 화면으로 설정됩니다.
                </Text>
              </div>
            )}

            <Form.Item>
              <Button 
                size="large" 
                block 
                style={{ fontSize: fontSize }}
              >
                이 크기의 버튼입니다
              </Button>
            </Form.Item>
          </Space>
        )

      case 3: // Complete
        return (
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            <Title level={2}>설정 완료!</Title>
            <Paragraph>
              프로필 설정이 완료되었습니다.<br />
              이제 캠페인을 시작할 준비가 되었습니다.
            </Paragraph>

            <Card style={{ textAlign: 'left', marginTop: 24 }}>
              <Title level={4}>설정 요약</Title>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>이름:</Text>
                </Col>
                <Col span={16}>
                  <Text>{form.getFieldValue('name')}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>지역:</Text>
                </Col>
                <Col span={16}>
                  <Text>{form.getFieldValue('district')}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>활동 강도:</Text>
                </Col>
                <Col span={16}>
                  <Text>{intensityOptions.find(o => o.value === form.getFieldValue('intensity'))?.label}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>이동 수단:</Text>
                </Col>
                <Col span={16}>
                  <Text>{mobilityOptions.find(o => o.value === form.getFieldValue('mobility'))?.label}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>시니어 모드:</Text>
                </Col>
                <Col span={16}>
                  <Text>{fontSize >= 20 ? '활성화' : '비활성화'}</Text>
                </Col>
              </Row>
            </Card>
          </Space>
        )
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card>
          <div style={{ marginBottom: 32 }}>
            <Progress 
              percent={((currentStep + 1) / steps.length) * 100}
              showInfo={false}
              strokeColor="#2563EB"
            />
            <div style={{ marginTop: 16 }}>
              <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Step
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            size="middle"
          >
            {renderStepContent()}

            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <Space size="large">
                {currentStep > 0 && (
                  <Button size="large" onClick={handlePrevious}>
                    이전
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={handleNext}
                  >
                    다음
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    size="large" 
                    loading={loading}
                    onClick={handleComplete}
                  >
                    시작하기
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}