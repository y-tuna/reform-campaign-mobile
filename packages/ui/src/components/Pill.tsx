import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const pillVariants = cva(
  [
    "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
    "whitespace-nowrap"
  ],
  {
    variants: {
      variant: {
        info: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
        success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20", 
        warning: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
        danger: "bg-red-500/15 text-red-300 border border-red-500/20",
        neutral: "bg-neutral-500/15 text-neutral-300 border border-neutral-500/20",
        // Status-specific variants for data contracts
        approved: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
        pending: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
        rejected: "bg-red-500/15 text-red-300 border border-red-500/20",
        draft: "bg-neutral-500/15 text-neutral-300 border border-neutral-500/20",
        published: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
        archived: "bg-neutral-600/15 text-neutral-400 border border-neutral-600/20"
      },
      size: {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-xs px-2 py-0.5", 
        lg: "text-sm px-2.5 py-1"
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "md"
    }
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  icon?: React.ReactNode
}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        className={cn(pillVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="inline-flex items-center">{icon}</span>}
        {children}
      </span>
    )
  }
)

Pill.displayName = "Pill"

// Status mapping utilities for data contracts
export const statusToPillVariant = {
  // Proof review status
  'under_review': 'pending' as const,
  'approved': 'approved' as const,
  'rejected': 'rejected' as const,
  'resubmission_required': 'warning' as const,
  
  // Document submission status  
  'draft': 'draft' as const,
  'submitted': 'info' as const,
  'reviewed': 'success' as const,
  'needs_revision': 'warning' as const,
  
  // Broadcast severity
  'low': 'info' as const,
  'medium': 'warning' as const,
  'high': 'danger' as const,
  'critical': 'danger' as const,
  
  // General status
  'active': 'success' as const,
  'inactive': 'neutral' as const,
  'completed': 'success' as const,
  'in_progress': 'info' as const,
  'cancelled': 'danger' as const,
  'archived': 'archived' as const
} as const

export type StatusType = keyof typeof statusToPillVariant

export interface StatusPillProps extends Omit<PillProps, 'variant'> {
  status: StatusType
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, ...props }, ref) => {
    const variant = statusToPillVariant[status] || 'neutral'
    
    return (
      <Pill
        variant={variant}
        ref={ref}
        {...props}
      />
    )
  }
)

StatusPill.displayName = "StatusPill"

export { Pill, StatusPill, pillVariants }