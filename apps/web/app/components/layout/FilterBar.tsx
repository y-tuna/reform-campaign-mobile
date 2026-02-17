'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/app/lib/utils'

interface FilterBarProps {
  children: ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn(
      "sticky top-16 z-20 bg-bg-surface/80 backdrop-blur-md border-b border-border-muted",
      "px-4 py-3",
      className
    )}>
      {children}
    </div>
  )
}

interface FilterBarContentProps {
  title?: string
  description?: string
  actions?: ReactNode
  filters?: ReactNode
  className?: string
}

export function FilterBarContent({ 
  title, 
  description, 
  actions, 
  filters, 
  className 
}: FilterBarContentProps) {
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {/* Title and Actions Row */}
      {(title || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Filters Row */}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters}
        </div>
      )}
    </div>
  )
}

// Pre-built filter components
interface FilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
}

export function FilterSelect({ label, value, onChange, options, placeholder }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-neutral-400 whitespace-nowrap">
        {label}:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm bg-bg-elevated border border-border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FilterSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function FilterSearch({ value, onChange, placeholder = "검색..." }: FilterSearchProps) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-1.5 text-sm bg-bg-elevated border border-border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}

interface FilterButtonProps {
  children: ReactNode
  active?: boolean
  onClick: () => void
  className?: string
}

export function FilterButton({ children, active, onClick, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm rounded-md border transition-colors",
        active
          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
          : "bg-bg-elevated border-border-muted text-neutral-400 hover:text-text-primary hover:bg-white/5",
        className
      )}
    >
      {children}
    </button>
  )
}