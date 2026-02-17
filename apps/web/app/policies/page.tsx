'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Input, 
  Select, 
  Space, 
  List, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Collapse,
  Table,
  Badge,
  Tabs,
  Button,
  Statistic,
  Divider,
  Modal,
  Tooltip,
  message
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  BookOutlined, 
  FileTextOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined,
  ReadOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { usePoliciesStore, ContentCategory, ContentPriority, PolicyContent } from '../store/policies'
import { debounce } from 'lodash'

const { Search } = Input
const { Option } = Select
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const categoryLabels: Record<ContentCategory, string> = {
  policy: '정책',
  election_law: '선거법',
  faq: 'FAQ',
  case_study: '사례연구',
  guide: '가이드'
}

const categoryIcons: Record<ContentCategory, React.ReactNode> = {
  policy: <BookOutlined />,
  election_law: <FileTextOutlined />,
  faq: <QuestionCircleOutlined />,
  case_study: <ExperimentOutlined />,
  guide: <ReadOutlined />
}

const priorityColors: Record<ContentPriority, string> = {
  high: 'red',
  medium: 'orange', 
  low: 'green'
}

const priorityLabels: Record<ContentPriority, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음'
}

const SearchAndFilters = () => {
  const {
    filters,
    setSearchTerm,
    setCategoryFilter,
    setPriorityFilter,
    setBookmarkedOnly,
    clearFilters
  } = usePoliciesStore()

  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm)

  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    [setSearchTerm]
  )

  useEffect(() => {
    debouncedSearch(localSearchTerm)
    return () => {
      debouncedSearch.cancel()
    }
  }, [localSearchTerm, debouncedSearch])

  return (
    <Card className="mb-6">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex justify-between items-center">
          <Title level={4} className="mb-0">
            <FilterOutlined className="mr-2" />
            검색 및 필터
          </Title>
          <Button size="small" onClick={clearFilters}>
            필터 초기화
          </Button>
        </div>
        
        <Search
          placeholder="정책명, 내용, 태그로 검색하세요"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          size="large"
          enterButton={<SearchOutlined />}
        />
        
        <Row gutter={16}>
          <Col span={6}>
            <Select
              value={filters.category}
              onChange={setCategoryFilter}
              placeholder="카테고리 선택"
              style={{ width: '100%' }}
            >
              <Option value="all">전체 카테고리</Option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  {categoryIcons[key as ContentCategory]} {label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={6}>
            <Select
              value={filters.priority}
              onChange={setPriorityFilter}
              placeholder="우선순위 선택"
              style={{ width: '100%' }}
            >
              <Option value="all">전체 우선순위</Option>
              {Object.entries(priorityLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  <Badge status={priorityColors[key as ContentPriority] as any} text={label} />
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={6}>
            <Button
              type={filters.bookmarkedOnly ? 'primary' : 'default'}
              icon={filters.bookmarkedOnly ? <StarFilled /> : <StarOutlined />}
              onClick={() => setBookmarkedOnly(!filters.bookmarkedOnly)}
              style={{ width: '100%' }}
            >
              즐겨찾기만 보기
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  )
}

const ContentCard = ({ content }: { content: PolicyContent }) => {
  const { toggleBookmark, viewContent, setSelectedContent } = usePoliciesStore()

  const handleView = () => {
    viewContent(content.id)
    setSelectedContent(content)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(content.id)
    message.success(content.isBookmarked ? '즐겨찾기에서 제거했습니다' : '즐겨찾기에 추가했습니다')
  }

  return (
    <Card
      hoverable
      className="mb-4"
      onClick={handleView}
      extra={
        <Tooltip title={content.isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}>
          <Button
            type="text"
            icon={content.isBookmarked ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
            onClick={handleBookmark}
          />
        </Tooltip>
      }
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {categoryIcons[content.category]}
          <Badge 
            status={priorityColors[content.priority] as any} 
            text={priorityLabels[content.priority]}
          />
          <Tag color="blue">{categoryLabels[content.category]}</Tag>
        </div>
        <Space>
          <Tooltip title="조회수">
            <span className="text-gray-500">
              <EyeOutlined /> {content.viewCount}
            </span>
          </Tooltip>
        </Space>
      </div>
      
      <Title level={5} className="mb-2">{content.title}</Title>
      <Paragraph className="text-gray-600 mb-3" ellipsis={{ rows: 2 }}>
        {content.summary}
      </Paragraph>
      
      <div className="flex justify-between items-center">
        <div>
          <Space wrap>
            {content.tags.slice(0, 3).map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {content.tags.length > 3 && (
              <Tag>+{content.tags.length - 3}개</Tag>
            )}
          </Space>
        </div>
        <div className="text-right">
          <Text type="secondary" className="text-xs">
            {content.author}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            <ClockCircleOutlined /> {new Date(content.lastUpdated).toLocaleDateString('ko-KR')}
          </Text>
        </div>
      </div>
    </Card>
  )
}

const ContentModal = () => {
  const { selectedContent, setSelectedContent, getRelatedContent } = usePoliciesStore()
  const relatedContent = selectedContent ? getRelatedContent(selectedContent.id) : []

  if (!selectedContent) return null

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {categoryIcons[selectedContent.category]}
          <span>{selectedContent.title}</span>
          <Tag color="blue">{categoryLabels[selectedContent.category]}</Tag>
        </div>
      }
      open={!!selectedContent}
      onCancel={() => setSelectedContent(null)}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <div className="mb-4">
        <Space>
          <Badge 
            status={priorityColors[selectedContent.priority] as any} 
            text={priorityLabels[selectedContent.priority]} 
          />
          <Divider type="vertical" />
          <Text type="secondary">
            <EyeOutlined /> {selectedContent.viewCount}회 조회
          </Text>
          <Divider type="vertical" />
          <Text type="secondary">
            {new Date(selectedContent.lastUpdated).toLocaleDateString('ko-KR')} 업데이트
          </Text>
        </Space>
      </div>
      
      <div className="mb-4">
        <Paragraph>{selectedContent.summary}</Paragraph>
      </div>
      
      <div className="mb-4">
        <Space wrap>
          {selectedContent.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>
      
      <Divider />
      
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{selectedContent.content}</ReactMarkdown>
      </div>
      
      {relatedContent.length > 0 && (
        <>
          <Divider />
          <Title level={5}>관련 콘텐츠</Title>
          <List
            dataSource={relatedContent}
            renderItem={(item) => (
              <List.Item className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                <List.Item.Meta
                  avatar={categoryIcons[item.category]}
                  title={item.title}
                  description={item.summary}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Modal>
  )
}

const ContentList = () => {
  const { getFilteredContents } = usePoliciesStore()
  const filteredContents = getFilteredContents()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Text strong>검색 결과: {filteredContents.length}건</Text>
      </div>
      
      {filteredContents.map(content => (
        <ContentCard key={content.id} content={content} />
      ))}
      
      {filteredContents.length === 0 && (
        <Card className="text-center py-8">
          <Text type="secondary">검색 결과가 없습니다.</Text>
        </Card>
      )}
    </div>
  )
}

const CategoryView = () => {
  const { getContentsByCategory } = usePoliciesStore()
  const contentsByCategory = getContentsByCategory()

  const panels = Object.entries(contentsByCategory).map(([category, contents]) => ({
    key: category,
    label: (
      <Space>
        {categoryIcons[category as ContentCategory]}
        <span>{categoryLabels[category as ContentCategory]}</span>
        <Badge count={contents.length} />
      </Space>
    ),
    children: (
      <List
        dataSource={contents}
        renderItem={(content) => <ContentCard content={content} />}
      />
    )
  }))

  return (
    <Collapse
      items={panels}
      defaultActiveKey={['policy', 'faq']}
    />
  )
}

const PopularContent = () => {
  const { getPopularContent } = usePoliciesStore()
  const popularContents = getPopularContent(5)

  const columns = [
    {
      title: '순위',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#f50' : '#2db7f5' }} />
      )
    },
    {
      title: '제목',
      key: 'title',
      render: (content: PolicyContent) => (
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {categoryIcons[content.category]}
            <Text strong>{content.title}</Text>
          </div>
          <Text type="secondary" className="text-sm">{content.summary}</Text>
        </div>
      )
    },
    {
      title: '조회수',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count: number) => (
        <Space>
          <EyeOutlined />
          {count}
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div className="flex items-center mb-4">
        <FireOutlined className="text-red-500 mr-2" />
        <Title level={4} className="mb-0">인기 콘텐츠</Title>
      </div>
      <Table
        dataSource={popularContents}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="id"
      />
    </Card>
  )
}

const Dashboard = () => {
  const { contents, bookmarkedIds, recentlyViewed } = usePoliciesStore()
  
  const stats = useMemo(() => {
    const categoryStats = contents.reduce((acc, content) => {
      acc[content.category] = (acc[content.category] || 0) + 1
      return acc
    }, {} as Record<ContentCategory, number>)
    
    return {
      total: contents.length,
      bookmarked: bookmarkedIds.length,
      recentlyViewed: recentlyViewed.length,
      categoryStats
    }
  }, [contents, bookmarkedIds, recentlyViewed])

  return (
    <Row gutter={16} className="mb-6">
      <Col span={6}>
        <Card>
          <Statistic
            title="전체 콘텐츠"
            value={stats.total}
            prefix={<BookOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="즐겨찾기"
            value={stats.bookmarked}
            prefix={<StarOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="최근 조회"
            value={stats.recentlyViewed}
            prefix={<EyeOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <PopularContent />
      </Col>
    </Row>
  )
}

export default function PoliciesPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>정책 및 자료실</Title>
        <Text type="secondary">
          개혁신당의 정책, 선거법, FAQ, 사례연구 및 가이드를 확인하세요.
        </Text>
      </div>

      <Dashboard />

      <Tabs defaultActiveKey="search" className="mt-6">
        <TabPane tab={<span><SearchOutlined />검색</span>} key="search">
          <SearchAndFilters />
          <ContentList />
        </TabPane>
        
        <TabPane tab={<span><BookOutlined />카테고리별</span>} key="category">
          <CategoryView />
        </TabPane>
      </Tabs>

      <ContentModal />
    </div>
  )
}