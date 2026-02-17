'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Tabs, 
  Row, 
  Col, 
  Typography, 
  Progress, 
  Tag, 
  Button, 
  Space, 
  List, 
  Modal, 
  Divider,
  Badge,
  Select,
  Statistic,
  Avatar,
  Tooltip,
  message
} from 'antd'
import { 
  BookOutlined, 
  PlayCircleOutlined, 
  ExperimentOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  UserOutlined,
  TrophyOutlined,
  FilterOutlined,
  RocketOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
// import ReactPlayer from 'react-player' // Using mock video player for demo
import { 
  useEducationStore, 
  EducationContent, 
  ContentType, 
  EducationCategory, 
  DifficultyLevel 
} from '../store/education'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select

const categoryLabels: Record<EducationCategory, string> = {
  behavior: '행동예절',
  communication: '커뮤니케이션',
  legal: '법적준수',
  strategy: '전략기획',
  etiquette: '매너',
  crisis: '위기관리'
}

const categoryIcons: Record<EducationCategory, React.ReactNode> = {
  behavior: <UserOutlined />,
  communication: <BookOutlined />,
  legal: <FileTextOutlined />,
  strategy: <RocketOutlined />,
  etiquette: <StarOutlined />,
  crisis: <ExperimentOutlined />
}

const typeLabels: Record<ContentType, string> = {
  guidebook: '가이드북',
  video: '동영상',
  tutorial: '튜토리얼',
  scenario: '시나리오',
  manual: '매뉴얼'
}

const typeIcons: Record<ContentType, React.ReactNode> = {
  guidebook: <BookOutlined />,
  video: <PlayCircleOutlined />,
  tutorial: <ExperimentOutlined />,
  scenario: <FileTextOutlined />,
  manual: <BookOutlined />
}

const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급'
}

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'green',
  intermediate: 'orange', 
  advanced: 'red'
}

const FilterPanel = () => {
  const { 
    filters, 
    setCategoryFilter, 
    setTypeFilter, 
    setDifficultyFilter,
    setCompletedOnlyFilter,
    setRequiredOnlyFilter,
    clearFilters 
  } = useEducationStore()

  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="mb-0">
          <FilterOutlined className="mr-2" />
          필터
        </Title>
        <Button size="small" onClick={clearFilters}>
          초기화
        </Button>
      </div>
      
      <Row gutter={16}>
        <Col span={4}>
          <Select
            value={filters.category}
            onChange={setCategoryFilter}
            style={{ width: '100%' }}
            placeholder="카테고리"
          >
            <Option value="all">전체 카테고리</Option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                {categoryIcons[key as EducationCategory]} {label}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col span={4}>
          <Select
            value={filters.type}
            onChange={setTypeFilter}
            style={{ width: '100%' }}
            placeholder="콘텐츠 유형"
          >
            <Option value="all">전체 유형</Option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                {typeIcons[key as ContentType]} {label}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col span={4}>
          <Select
            value={filters.difficulty}
            onChange={setDifficultyFilter}
            style={{ width: '100%' }}
            placeholder="난이도"
          >
            <Option value="all">전체 난이도</Option>
            {Object.entries(difficultyLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                <Tag color={difficultyColors[key as DifficultyLevel]}>{label}</Tag>
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col span={4}>
          <Button
            type={filters.requiredOnly ? 'primary' : 'default'}
            onClick={() => setRequiredOnlyFilter(!filters.requiredOnly)}
            style={{ width: '100%' }}
          >
            필수과목만
          </Button>
        </Col>
        
        <Col span={4}>
          <Button
            type={filters.completedOnly ? 'primary' : 'default'}
            onClick={() => setCompletedOnlyFilter(!filters.completedOnly)}
            style={{ width: '100%' }}
          >
            완료과목만
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

const ContentCard = ({ content }: { content: EducationContent }) => {
  const { 
    setCurrentContent, 
    toggleBookmark, 
    bookmarkedContents,
    markContentCompleted,
    updateContentProgress
  } = useEducationStore()

  const isBookmarked = bookmarkedContents.includes(content.id)

  const handleView = () => {
    setCurrentContent(content)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(content.id)
    message.success(isBookmarked ? '즐겨찾기에서 제거했습니다' : '즐겨찾기에 추가했습니다')
  }

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    markContentCompleted(content.id)
    message.success('학습을 완료했습니다!')
  }

  return (
    <Card
      hoverable
      className="mb-4"
      onClick={handleView}
      extra={
        <Space>
          <Tooltip title={isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}>
            <Button
              type="text"
              size="small"
              icon={isBookmarked ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleBookmark}
            />
          </Tooltip>
          {!content.isCompleted && (
            <Tooltip title="완료 표시">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={handleComplete}
              />
            </Tooltip>
          )}
        </Space>
      }
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {typeIcons[content.type]}
          <Tag color={difficultyColors[content.difficulty]}>
            {difficultyLabels[content.difficulty]}
          </Tag>
          <Tag color="blue">{categoryLabels[content.category]}</Tag>
          {content.isRequired && <Tag color="red">필수</Tag>}
          {content.isCompleted && <Tag color="green">완료</Tag>}
        </div>
      </div>
      
      <Title level={5} className="mb-2">{content.title}</Title>
      <Paragraph className="text-gray-600 mb-3" ellipsis={{ rows: 2 }}>
        {content.description}
      </Paragraph>
      
      <div className="mb-3">
        <Space wrap>
          {content.tags.slice(0, 3).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {content.tags.length > 3 && (
            <Tag>+{content.tags.length - 3}개</Tag>
          )}
        </Space>
      </div>
      
      {content.progress > 0 && (
        <div className="mb-3">
          <Progress percent={content.progress} size="small" />
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <Space>
          <ClockCircleOutlined /> {content.estimatedTime}분
        </Space>
        <Space>
          <EyeOutlined /> {content.viewCount}
          <StarOutlined /> {content.rating}
        </Space>
      </div>
    </Card>
  )
}

const ContentModal = () => {
  const { currentContent, setCurrentContent, updateContentProgress } = useEducationStore()
  const [videoProgress, setVideoProgress] = useState(0)

  if (!currentContent) return null

  // Mock video progress handler for demo
  const handleVideoProgress = () => {
    // In real implementation, this would be called by ReactPlayer
  }

  const handleClose = () => {
    setCurrentContent(null)
    setVideoProgress(0)
  }

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {typeIcons[currentContent.type]}
          <span>{currentContent.title}</span>
          <Tag color="blue">{typeLabels[currentContent.type]}</Tag>
        </div>
      }
      open={!!currentContent}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ top: 20, maxWidth: 1200 }}
    >
      <div className="mb-4">
        <Row gutter={16}>
          <Col span={18}>
            <Space>
              <Tag color={difficultyColors[currentContent.difficulty]}>
                {difficultyLabels[currentContent.difficulty]}
              </Tag>
              <Tag color="blue">{categoryLabels[currentContent.category]}</Tag>
              {currentContent.isRequired && <Tag color="red">필수과목</Tag>}
              <Text type="secondary">
                <ClockCircleOutlined /> {currentContent.estimatedTime}분
              </Text>
              <Text type="secondary">
                <EyeOutlined /> {currentContent.viewCount}회 조회
              </Text>
            </Space>
          </Col>
          <Col span={6} className="text-right">
            <Space>
              <StarOutlined /> {currentContent.rating}
              <Text type="secondary">{currentContent.author}</Text>
            </Space>
          </Col>
        </Row>
      </div>
      
      <Paragraph>{currentContent.description}</Paragraph>
      
      {currentContent.objectives.length > 0 && (
        <>
          <Title level={5}>학습 목표</Title>
          <ul className="mb-4">
            {currentContent.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </>
      )}
      
      <Divider />
      
      {currentContent.type === 'video' && currentContent.video && (
        <>
          <div className="mb-4">
            <div className="relative bg-gray-100 rounded-lg p-8 text-center">
              <PlayCircleOutlined className="text-6xl text-blue-500 mb-4" />
              <Title level={4}>동영상 학습</Title>
              <Text type="secondary">실제 환경에서는 동영상이 재생됩니다.</Text>
              <div className="mt-4">
                <Button 
                  type="primary" 
                  onClick={() => {
                    const percent = Math.min(videoProgress + 20, 100)
                    setVideoProgress(percent)
                    updateContentProgress(currentContent.id, percent)
                  }}
                >
                  학습 진행 ({videoProgress}%)
                </Button>
              </div>
            </div>
          </div>
          
          {videoProgress > 0 && (
            <div className="mb-4">
              <Text>학습 진도: </Text>
              <Progress percent={videoProgress} />
            </div>
          )}
        </>
      )}
      
      {currentContent.content && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{currentContent.content}</ReactMarkdown>
        </div>
      )}
      
      {currentContent.prerequisites.length > 0 && (
        <>
          <Divider />
          <Title level={5}>선수 과목</Title>
          <Space wrap>
            {currentContent.prerequisites.map(prereq => (
              <Tag key={prereq} color="orange">{prereq}</Tag>
            ))}
          </Space>
        </>
      )}
    </Modal>
  )
}

const Dashboard = () => {
  const { contents, completedContents, getRecommendedContent } = useEducationStore()
  const recommendedContent = getRecommendedContent()
  
  const stats = {
    total: contents.length,
    completed: completedContents.length,
    required: contents.filter(c => c.isRequired).length,
    requiredCompleted: contents.filter(c => c.isRequired && c.isCompleted).length
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const requiredCompletionRate = stats.required > 0 ? Math.round((stats.requiredCompleted / stats.required) * 100) : 0

  return (
    <>
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 완료율"
              value={completionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
            />
            <Progress percent={completionRate} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="필수과목 완료율"
              value={requiredCompletionRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
            <Progress percent={requiredCompletionRate} showInfo={false} strokeColor="#ff4d4f" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="완료한 과목"
              value={stats.completed}
              suffix={`/ ${stats.total}`}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="필수과목"
              value={stats.requiredCompleted}
              suffix={`/ ${stats.required}`}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {recommendedContent.length > 0 && (
        <Card className="mb-6">
          <Title level={4}>추천 학습과정</Title>
          <List
            dataSource={recommendedContent}
            renderItem={(content) => (
              <List.Item
                actions={[
                  <Button key="start" type="primary" onClick={() => useEducationStore.getState().setCurrentContent(content)}>
                    학습 시작
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={typeIcons[content.type]} />}
                  title={
                    <Space>
                      <span>{content.title}</span>
                      {content.isRequired && <Tag color="red">필수</Tag>}
                      <Tag color={difficultyColors[content.difficulty]}>
                        {difficultyLabels[content.difficulty]}
                      </Tag>
                    </Space>
                  }
                  description={content.description}
                />
                <div>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {content.estimatedTime}분
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </>
  )
}

const ContentList = () => {
  const { getFilteredContents } = useEducationStore()
  const filteredContents = getFilteredContents()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Text strong>총 {filteredContents.length}개 과정</Text>
      </div>
      
      <Row gutter={16}>
        {filteredContents.map(content => (
          <Col span={8} key={content.id}>
            <ContentCard content={content} />
          </Col>
        ))}
      </Row>
      
      {filteredContents.length === 0 && (
        <Card className="text-center py-8">
          <Text type="secondary">조건에 맞는 학습 과정이 없습니다.</Text>
        </Card>
      )}
    </div>
  )
}

const CategoryView = () => {
  const { getContentsByCategory } = useEducationStore()
  const contentsByCategory = getContentsByCategory()

  return (
    <div>
      {Object.entries(contentsByCategory).map(([category, contents]) => (
        <Card key={category} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="mb-0">
              {categoryIcons[category as EducationCategory]}
              <span className="ml-2">{categoryLabels[category as EducationCategory]}</span>
              <Badge count={contents.length} className="ml-2" />
            </Title>
          </div>
          
          <Row gutter={16}>
            {contents.map(content => (
              <Col span={8} key={content.id}>
                <ContentCard content={content} />
              </Col>
            ))}
          </Row>
          
          {contents.length === 0 && (
            <Text type="secondary">이 카테고리에는 학습 과정이 없습니다.</Text>
          )}
        </Card>
      ))}
    </div>
  )
}

const LearningPaths = () => {
  const { learningPaths, getLearningPathProgress } = useEducationStore()

  return (
    <div>
      <Row gutter={16}>
        {learningPaths.map(path => (
          <Col span={12} key={path.id}>
            <Card>
              <div className="mb-4">
                <Title level={4}>{path.title}</Title>
                <Paragraph>{path.description}</Paragraph>
              </div>
              
              <div className="mb-4">
                <Space>
                  <Tag color={difficultyColors[path.difficulty]}>
                    {difficultyLabels[path.difficulty]}
                  </Tag>
                  <Tag color="blue">{categoryLabels[path.category]}</Tag>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {path.estimatedTotalTime}분
                  </Text>
                </Space>
              </div>
              
              <div className="mb-4">
                <Text>진행률</Text>
                <Progress percent={getLearningPathProgress(path.id)} />
              </div>
              
              <Button type="primary" block>
                학습 경로 시작
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default function EducationPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>후보자 교육센터</Title>
        <Text type="secondary">
          선거 캠페인에 필요한 가이드북, 매너 교육, 상황별 대응법을 학습하세요.
        </Text>
      </div>

      <Dashboard />

      <Tabs defaultActiveKey="all">
        <TabPane tab={<span><BookOutlined />전체 과정</span>} key="all">
          <FilterPanel />
          <ContentList />
        </TabPane>
        
        <TabPane tab={<span><RocketOutlined />카테고리별</span>} key="category">
          <CategoryView />
        </TabPane>
        
        <TabPane tab={<span><TrophyOutlined />학습 경로</span>} key="paths">
          <LearningPaths />
        </TabPane>
      </Tabs>

      <ContentModal />
    </div>
  )
}