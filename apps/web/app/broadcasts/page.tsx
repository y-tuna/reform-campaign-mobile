'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  List, 
  Badge, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Select, 
  Input, 
  Modal,
  Divider,
  Tooltip,
  Row,
  Col,
  Statistic,
  Alert,
  message,
  Avatar,
  Timeline
} from 'antd'
import { 
  BellOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  FireOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { 
  useBroadcastsStore, 
  Broadcast, 
  BroadcastSeverity, 
  BroadcastCategory 
} from '../store/broadcasts'
import { debounce } from 'lodash'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

const severityLabels: Record<BroadcastSeverity, string> = {
  info: '안내',
  warning: '주의',
  critical: '중요',
  urgent: '긴급'
}

const severityColors: Record<BroadcastSeverity, string> = {
  info: 'blue',
  warning: 'orange',
  critical: 'red',
  urgent: 'magenta'
}

const severityIcons: Record<BroadcastSeverity, React.ReactNode> = {
  info: <InfoCircleOutlined />,
  warning: <WarningOutlined />,
  critical: <ExclamationCircleOutlined />,
  urgent: <AlertOutlined />
}

const categoryLabels: Record<BroadcastCategory, string> = {
  party: '당무',
  election: '선거',
  legal: '법무',
  campaign: '선거운동',
  event: '행사',
  emergency: '비상'
}

const categoryColors: Record<BroadcastCategory, string> = {
  party: 'blue',
  election: 'green', 
  legal: 'red',
  campaign: 'orange',
  event: 'purple',
  emergency: 'magenta'
}

const FilterPanel = () => {
  const {
    filters,
    setSeverityFilter,
    setCategoryFilter,
    setStatusFilter,
    setUnreadOnlyFilter,
    setBookmarkedOnlyFilter,
    setSearchTerm,
    clearFilters
  } = useBroadcastsStore()

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
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="mb-0">
          <FilterOutlined className="mr-2" />
          필터 및 검색
        </Title>
        <Button size="small" onClick={clearFilters}>
          초기화
        </Button>
      </div>
      
      <div className="mb-4">
        <Search
          placeholder="공지사항 제목, 내용 검색"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          enterButton={<SearchOutlined />}
          size="large"
        />
      </div>
      
      <Row gutter={16}>
        <Col span={4}>
          <Select
            value={filters.severity}
            onChange={setSeverityFilter}
            style={{ width: '100%' }}
            placeholder="중요도"
          >
            <Option value="all">전체 중요도</Option>
            {Object.entries(severityLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                <Badge 
                  color={severityColors[key as BroadcastSeverity]} 
                  text={label}
                />
              </Option>
            ))}
          </Select>
        </Col>
        
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
                <Tag color={categoryColors[key as BroadcastCategory]}>{label}</Tag>
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col span={4}>
          <Button
            type={filters.unreadOnly ? 'primary' : 'default'}
            onClick={() => setUnreadOnlyFilter(!filters.unreadOnly)}
            style={{ width: '100%' }}
          >
            미읽음만 보기
          </Button>
        </Col>
        
        <Col span={4}>
          <Button
            type={filters.bookmarkedOnly ? 'primary' : 'default'}
            onClick={() => setBookmarkedOnlyFilter(!filters.bookmarkedOnly)}
            icon={filters.bookmarkedOnly ? <StarFilled /> : <StarOutlined />}
            style={{ width: '100%' }}
          >
            즐겨찾기만
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

const BroadcastItem = ({ broadcast }: { broadcast: Broadcast }) => {
  const { toggleBookmark, setSelectedBroadcast } = useBroadcastsStore()

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark(broadcast.id)
    message.success(broadcast.isBookmarked ? '즐겨찾기에서 제거했습니다' : '즐겨찾기에 추가했습니다')
  }

  const isExpired = broadcast.expiresAt && new Date(broadcast.expiresAt) < new Date()
  
  return (
    <List.Item
      className={`cursor-pointer hover:bg-gray-50 p-4 rounded-lg ${!broadcast.isRead ? 'bg-blue-50' : ''}`}
      onClick={() => setSelectedBroadcast(broadcast)}
      extra={
        <Space>
          <Tooltip title="조회수">
            <span className="text-gray-500">
              <EyeOutlined /> {broadcast.viewCount}
            </span>
          </Tooltip>
          <Tooltip title={broadcast.isBookmarked ? '즐겨찾기 제거' : '즐겨찾기 추가'}>
            <Button
              type="text"
              size="small"
              icon={broadcast.isBookmarked ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleBookmark}
            />
          </Tooltip>
        </Space>
      }
    >
      <List.Item.Meta
        avatar={
          <div className="relative">
            <Avatar 
              size={48}
              icon={severityIcons[broadcast.severity]} 
              style={{ 
                backgroundColor: severityColors[broadcast.severity] === 'blue' ? '#1890ff' :
                  severityColors[broadcast.severity] === 'orange' ? '#fa8c16' :
                  severityColors[broadcast.severity] === 'red' ? '#f5222d' :
                  '#eb2f96'
              }}
            />
            {!broadcast.isRead && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </div>
        }
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className={`${!broadcast.isRead ? 'font-bold' : ''}`}>
                {broadcast.title}
              </span>
              {isExpired && (
                <Tag color="default">만료됨</Tag>
              )}
            </div>
          </div>
        }
        description={
          <div>
            <div className="mb-2">
              <Space wrap>
                <Badge 
                  color={severityColors[broadcast.severity]} 
                  text={severityLabels[broadcast.severity]}
                />
                <Tag color={categoryColors[broadcast.category]}>
                  {categoryLabels[broadcast.category]}
                </Tag>
                <Text type="secondary" className="text-sm">
                  {broadcast.department}
                </Text>
              </Space>
            </div>
            
            <Paragraph 
              className="text-gray-600 mb-2" 
              ellipsis={{ rows: 2 }}
            >
              {broadcast.summary}
            </Paragraph>
            
            <div className="flex justify-between items-center">
              <div>
                <Text type="secondary" className="text-xs">
                  <ClockCircleOutlined className="mr-1" />
                  {new Date(broadcast.publishedAt).toLocaleString('ko-KR')}
                </Text>
                <Text type="secondary" className="text-xs ml-4">
                  <UserOutlined className="mr-1" />
                  {broadcast.author}
                </Text>
              </div>
              
              {broadcast.attachments.length > 0 && (
                <Tag icon={<DownloadOutlined />} color="blue">
                  첨부파일 {broadcast.attachments.length}개
                </Tag>
              )}
            </div>
          </div>
        }
      />
    </List.Item>
  )
}

const BroadcastModal = () => {
  const { selectedBroadcast, setSelectedBroadcast } = useBroadcastsStore()

  if (!selectedBroadcast) return null

  const handleDownload = (attachment: any) => {
    message.success(`${attachment.name} 다운로드를 시작합니다.`)
    // In real app, trigger actual download
  }

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {severityIcons[selectedBroadcast.severity]}
          <span>{selectedBroadcast.title}</span>
          <Badge 
            color={severityColors[selectedBroadcast.severity]} 
            text={severityLabels[selectedBroadcast.severity]}
          />
        </div>
      }
      open={!!selectedBroadcast}
      onCancel={() => setSelectedBroadcast(null)}
      footer={[
        <Button key="close" onClick={() => setSelectedBroadcast(null)}>
          닫기
        </Button>
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div className="mb-4">
        <Space wrap>
          <Tag color={categoryColors[selectedBroadcast.category]}>
            {categoryLabels[selectedBroadcast.category]}
          </Tag>
          <Text type="secondary">
            {selectedBroadcast.department}
          </Text>
          <Text type="secondary">
            <UserOutlined className="mr-1" />
            {selectedBroadcast.author}
          </Text>
          <Text type="secondary">
            <ClockCircleOutlined className="mr-1" />
            {new Date(selectedBroadcast.publishedAt).toLocaleString('ko-KR')}
          </Text>
        </Space>
      </div>

      {selectedBroadcast.expiresAt && (
        <Alert
          message={`만료일: ${new Date(selectedBroadcast.expiresAt).toLocaleDateString('ko-KR')}`}
          type={new Date(selectedBroadcast.expiresAt) < new Date() ? 'error' : 'warning'}
          className="mb-4"
          showIcon
        />
      )}

      <div className="mb-4">
        <Paragraph strong>{selectedBroadcast.summary}</Paragraph>
      </div>

      <Divider />

      <div className="prose prose-sm max-w-none mb-6">
        <ReactMarkdown>{selectedBroadcast.content}</ReactMarkdown>
      </div>

      {selectedBroadcast.tags.length > 0 && (
        <>
          <Divider />
          <div className="mb-4">
            <Text strong className="block mb-2">태그</Text>
            <Space wrap>
              {selectedBroadcast.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </div>
        </>
      )}

      {selectedBroadcast.attachments.length > 0 && (
        <>
          <Divider />
          <div className="mb-4">
            <Text strong className="block mb-2">첨부파일</Text>
            <List
              size="small"
              dataSource={selectedBroadcast.attachments}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      key="download" 
                      type="link" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(item)}
                    >
                      다운로드
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${(item.size / 1024 / 1024).toFixed(2)} MB`}
                  />
                </List.Item>
              )}
            />
          </div>
        </>
      )}
    </Modal>
  )
}

const Dashboard = () => {
  const { 
    broadcasts, 
    getUnreadCount, 
    getCriticalBroadcasts, 
    getRecentBroadcasts,
    markAllAsRead
  } = useBroadcastsStore()
  
  const unreadCount = getUnreadCount()
  const criticalBroadcasts = getCriticalBroadcasts()
  const recentBroadcasts = getRecentBroadcasts(3)

  const stats = {
    total: broadcasts.length,
    unread: unreadCount,
    critical: criticalBroadcasts.length,
    recent: recentBroadcasts.length
  }

  return (
    <>
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="전체 공지사항"
              value={stats.total}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="읽지 않음"
              value={stats.unread}
              valueStyle={{ color: stats.unread > 0 ? '#f5222d' : undefined }}
              prefix={<AlertOutlined />}
              suffix={
                stats.unread > 0 && (
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={markAllAsRead}
                    className="ml-2"
                  >
                    모두 읽음 처리
                  </Button>
                )
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="중요/긴급"
              value={stats.critical}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="최근 3일"
              value={stats.recent}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {criticalBroadcasts.length > 0 && (
        <Alert
          message="중요 공지사항"
          description={
            <div>
              <Text>확인이 필요한 중요 공지사항이 {criticalBroadcasts.length}건 있습니다.</Text>
              <Timeline
                className="mt-3"
                items={criticalBroadcasts.slice(0, 3).map(broadcast => ({
                  color: severityColors[broadcast.severity],
                  children: (
                    <div 
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => useBroadcastsStore.getState().setSelectedBroadcast(broadcast)}
                    >
                      <Text strong>{broadcast.title}</Text>
                      <br />
                      <Text type="secondary" className="text-xs">
                        {new Date(broadcast.publishedAt).toLocaleString('ko-KR')}
                      </Text>
                    </div>
                  )
                }))}
              />
            </div>
          }
          type="warning"
          showIcon
          className="mb-6"
        />
      )}
    </>
  )
}

const BroadcastList = () => {
  const { getFilteredBroadcasts } = useBroadcastsStore()
  const filteredBroadcasts = getFilteredBroadcasts()

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="mb-0">공지사항 목록</Title>
        <Text type="secondary">총 {filteredBroadcasts.length}건</Text>
      </div>
      
      <List
        dataSource={filteredBroadcasts}
        renderItem={(broadcast) => (
          <BroadcastItem key={broadcast.id} broadcast={broadcast} />
        )}
        locale={{ emptyText: '공지사항이 없습니다.' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}건`
        }}
      />
    </Card>
  )
}

export default function BroadcastsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>
          <BellOutlined className="mr-2" />
          당 공지사항
        </Title>
        <Text type="secondary">
          개혁신당 중앙당에서 발송하는 공지사항과 중요 안내를 확인하세요.
        </Text>
      </div>

      <Dashboard />
      <FilterPanel />
      <BroadcastList />
      <BroadcastModal />
    </div>
  )
}