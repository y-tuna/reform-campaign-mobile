'use client'

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@reform/ui'
import { StatusPill } from '@reform/ui'
import { XMarkIcon, ClockIcon, MapPinIcon, HashtagIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/app/lib/utils'

interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  children?: React.ReactNode
  onApprove?: () => void
  onReject?: () => void
  onEdit?: () => void
  isLoading?: boolean
  className?: string
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  onApprove,
  onReject,
  onEdit,
  isLoading = false,
  className
}: DetailDrawerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "fixed right-0 top-0 h-screen w-[520px] max-w-[90vw]",
          "bg-bg-elevated border-l border-border-muted",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "duration-300 ease-in-out",
          className
        )}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between p-6 border-b border-border-muted">
          <div>
            <DialogTitle className="text-lg font-semibold text-text-primary">
              {title}
            </DialogTitle>
            {subtitle && (
              <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer Actions */}
        {(onApprove || onReject || onEdit) && (
          <div className="p-6 border-t border-border-muted bg-bg-surface/50">
            <div className="flex items-center gap-3">
              {onApprove && (
                <Button
                  variant="primary"
                  onClick={onApprove}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  승인
                </Button>
              )}
              
              {onReject && (
                <Button
                  variant="danger"
                  onClick={onReject}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  반려
                </Button>
              )}
              
              {onEdit && (
                <Button
                  variant="secondary"
                  onClick={onEdit}
                  disabled={isLoading}
                >
                  편집
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="ml-auto"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Pre-built sections for common use cases
interface DetailSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function DetailSection({ title, children, className }: DetailSectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-sm font-medium text-text-primary mb-3">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

interface DetailFieldProps {
  label: string
  value: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function DetailField({ label, value, icon: Icon, className }: DetailFieldProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {Icon && (
        <Icon className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <dt className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
          {label}
        </dt>
        <dd className="text-sm text-text-primary break-words">
          {value}
        </dd>
      </div>
    </div>
  )
}

// Common metadata section
interface MetadataProps {
  timestamp?: string
  location?: string
  hash?: string
  uploader?: string
  status?: string
}

export function DetailMetadata({ timestamp, location, hash, uploader, status }: MetadataProps) {
  return (
    <DetailSection title="메타 정보">
      {timestamp && (
        <DetailField
          label="시간"
          value={new Date(timestamp).toLocaleString('ko-KR')}
          icon={ClockIcon}
        />
      )}
      
      {location && (
        <DetailField
          label="위치"
          value={location}
          icon={MapPinIcon}
        />
      )}
      
      {hash && (
        <DetailField
          label="해시"
          value={
            <code className="text-xs bg-bg-surface px-2 py-1 rounded font-mono">
              {hash}
            </code>
          }
          icon={HashtagIcon}
        />
      )}
      
      {uploader && (
        <DetailField
          label="업로더"
          value={uploader}
          icon={UserIcon}
        />
      )}
      
      {status && (
        <DetailField
          label="상태"
          value={<StatusPill status={status as any} />}
        />
      )}
    </DetailSection>
  )
}

// Status history timeline
interface StatusHistoryProps {
  history: Array<{
    status: string
    timestamp: string
    actor?: string
    reason?: string
  }>
}

export function DetailStatusHistory({ history }: StatusHistoryProps) {
  return (
    <DetailSection title="상태 이력">
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              {index < history.length - 1 && (
                <div className="h-8 w-px bg-border-muted mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusPill status={item.status as any} />
                <span className="text-xs text-neutral-500">
                  {new Date(item.timestamp).toLocaleString('ko-KR')}
                </span>
              </div>
              {item.actor && (
                <p className="text-xs text-neutral-400">
                  {item.actor}
                </p>
              )}
              {item.reason && (
                <p className="text-sm text-neutral-300 mt-1">
                  {item.reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </DetailSection>
  )
}