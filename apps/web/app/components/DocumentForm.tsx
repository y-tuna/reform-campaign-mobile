'use client'

import React from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Alert,
  message
} from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

// Zod validation schema
const documentFormSchema = z.object({
  title: z.string().min(1, '서류명을 입력해주세요'),
  category: z.enum(['personal', 'financial', 'campaign', 'legal']),
  description: z.string().min(10, '설명을 10자 이상 입력해주세요'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  isRequired: z.boolean()
})

type DocumentFormData = z.infer<typeof documentFormSchema>

interface DocumentFormProps {
  onSubmit: (data: DocumentFormData) => void
  loading?: boolean
  initialData?: Partial<DocumentFormData>
}

const categoryOptions = [
  { value: 'personal', label: '개인 서류' },
  { value: 'financial', label: '재정 서류' },
  { value: 'campaign', label: '캠페인 자료' },
  { value: 'legal', label: '법적 서류' }
]

const priorityOptions = [
  { value: 'high', label: '긴급' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' }
]

export default function DocumentForm({ onSubmit, loading = false, initialData }: DocumentFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'personal',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate || '',
      notes: initialData?.notes || '',
      priority: initialData?.priority || 'medium' as const,
      isRequired: initialData?.isRequired || false
    },
    mode: 'onChange'
  })

  const watchedCategory = watch('category')

  const onFormSubmit = (data: DocumentFormData) => {
    try {
      onSubmit(data)
      message.success('서류 정보가 저장되었습니다.')
      reset()
    } catch (error) {
      message.error('저장 중 오류가 발생했습니다.')
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'personal':
        return '주민등록등본, 학력증명서 등 개인 신분 관련 서류'
      case 'financial':
        return '재산신고서, 후원금 관련 서류 등 재정 관련 서류'
      case 'campaign':
        return '공약서, 정책 제안서 등 캠페인 관련 자료'
      case 'legal':
        return '후보자등록신청서, 정당추천서 등 법적 효력이 있는 서류'
      default:
        return ''
    }
  }

  return (
    <Form layout="vertical" size="large">
      {/* Title Field */}
      <Form.Item
        label="서류명"
        validateStatus={errors.title ? 'error' : ''}
        help={errors.title?.message}
        required
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="예: 주민등록등본"
              size="large"
            />
          )}
        />
      </Form.Item>

      {/* Category Field */}
      <Form.Item
        label="카테고리"
        validateStatus={errors.category ? 'error' : ''}
        help={errors.category?.message}
        required
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="서류 카테고리를 선택하세요"
              size="large"
              onChange={(value) => field.onChange(value)}
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      {/* Category Description */}
      {watchedCategory && (
        <Alert
          message={getCategoryDescription(watchedCategory)}
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Description Field */}
      <Form.Item
        label="상세 설명"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
        required
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              placeholder="서류에 대한 상세한 설명을 입력하세요 (최소 10자)"
              rows={3}
              showCount
              maxLength={200}
            />
          )}
        />
      </Form.Item>

      <Space direction="horizontal" size="large" style={{ width: '100%' }}>
        {/* Priority Field */}
        <Form.Item
          label="우선순위"
          style={{ flex: 1 }}
        >
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                onChange={(value) => field.onChange(value)}
              >
                {priorityOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Due Date Field */}
        <Form.Item
          label="마감일"
          style={{ flex: 1 }}
        >
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                placeholder="마감일을 선택하세요"
                size="large"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            )}
          />
        </Form.Item>
      </Space>

      {/* Notes Field */}
      <Form.Item label="추가 메모">
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              placeholder="추가적인 메모나 특이사항을 입력하세요"
              rows={2}
              showCount
              maxLength={150}
            />
          )}
        />
      </Form.Item>

      {/* Form Actions */}
      <Form.Item>
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit(onFormSubmit)}
            loading={loading}
            disabled={!isValid}
          >
            저장하기
          </Button>
          <Button
            size="large"
            onClick={() => reset()}
            disabled={loading}
          >
            초기화
          </Button>
        </Space>
      </Form.Item>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert
          message="입력 오류가 있습니다"
          description={
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error.message}</li>
              ))}
            </ul>
          }
          type="error"
          style={{ marginTop: 16 }}
        />
      )}
    </Form>
  )
}