export type Task = {
  id: string
  user_id: string
  title: string
  done: boolean
  inserted_at: string
}

export type BroadcastSeverity = 'info' | 'warn' | 'critical'
export type TaskTertiary = 'defer' | 'proof' | 'nav' | 'open'
