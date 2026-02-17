'use client'

import React from 'react'
import { Button } from '@reform/ui'
import { CheckIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline'
import { cn } from '@/app/lib/utils'

interface BulkActionBarProps {
  selectedCount: number
  onApprove?: () => void
  onReject?: () => void
  onAssignLabel?: () => void
  onClear?: () => void
  isLoading?: boolean
  className?: string
}

export function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  onAssignLabel,
  onClear,
  isLoading = false,
  className
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
      "bg-bg-elevated border border-border-muted rounded-lg shadow-lg",
      "px-4 py-3 flex items-center gap-3",
      "animate-in slide-in-from-bottom-2 duration-200",
      className
    )}>
      {/* Selection Count */}
      <div className="flex items-center gap-2 text-sm">
        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        <span className="text-text-primary font-medium">
          {selectedCount}개 항목 선택됨
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border-muted"></div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onApprove && (
          <Button
            size="sm"
            variant="primary"
            onClick={onApprove}
            disabled={isLoading}
            className="gap-1"
          >
            <CheckIcon className="h-4 w-4" />
            일괄 승인
          </Button>
        )}
        
        {onReject && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onReject}
            disabled={isLoading}
            className="gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            일괄 반려
          </Button>
        )}
        
        {onAssignLabel && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAssignLabel}
            disabled={isLoading}
            className="gap-1"
          >
            <TagIcon className="h-4 w-4" />
            라벨 변경
          </Button>
        )}
        
        {/* Clear Selection */}
        {onClear && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="p-1 text-neutral-400 hover:text-text-primary transition-colors rounded"
            title="선택 해제"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center gap-2 ml-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          <span className="text-sm text-neutral-400">처리 중...</span>
        </div>
      )}
    </div>
  )
}

// Hook for managing bulk actions
export function useBulkActions<T>() {
  const [selectedItems, setSelectedItems] = React.useState<T[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSelectionChange = React.useCallback((items: T[]) => {
    setSelectedItems(items)
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedItems([])
  }, [])

  const executeBulkAction = React.useCallback(async (
    action: (items: T[]) => Promise<void>
  ) => {
    if (selectedItems.length === 0) return

    setIsLoading(true)
    try {
      await action(selectedItems)
      clearSelection()
    } catch (error) {
      console.error('Bulk action failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [selectedItems, clearSelection])

  return {
    selectedItems,
    selectedCount: selectedItems.length,
    isLoading,
    handleSelectionChange,
    clearSelection,
    executeBulkAction
  }
}