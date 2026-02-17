// Supabase Database Types
// Generate these types by running: npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public

export interface Database {
  public: {
    Tables: {
      // Example table structures based on your campaign manager app
      // Replace with your actual database schema
      
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          role: 'candidate' | 'manager' | 'volunteer' | null
          district: string | null
          party: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          role?: 'candidate' | 'manager' | 'volunteer' | null
          district?: string | null
          party?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          role?: 'candidate' | 'manager' | 'volunteer' | null
          district?: string | null
          party?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: 'personal' | 'financial' | 'campaign' | 'legal' | 'party'
          status: 'pending' | 'uploaded' | 'verified' | 'rejected'
          file_url: string | null
          file_name: string | null
          file_size: number | null
          required: boolean
          priority: 'high' | 'medium' | 'low'
          due_date: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: 'personal' | 'financial' | 'campaign' | 'legal' | 'party'
          status?: 'pending' | 'uploaded' | 'verified' | 'rejected'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          required?: boolean
          priority?: 'high' | 'medium' | 'low'
          due_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: 'personal' | 'financial' | 'campaign' | 'legal' | 'party'
          status?: 'pending' | 'uploaded' | 'verified' | 'rejected'
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          required?: boolean
          priority?: 'high' | 'medium' | 'low'
          due_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      proofs: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: 'activity_photo' | 'receipt' | 'meeting_photo' | 'document_photo' | 'other'
          status: 'pending' | 'on_hold' | 'completed' | 'rejected'
          file_url: string | null
          file_name: string | null
          thumbnail_url: string | null
          metadata: any // JSONB field
          tags: string[]
          related_task_id: string | null
          verification_notes: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          type: 'activity_photo' | 'receipt' | 'meeting_photo' | 'document_photo' | 'other'
          status?: 'pending' | 'on_hold' | 'completed' | 'rejected'
          file_url?: string | null
          file_name?: string | null
          thumbnail_url?: string | null
          metadata?: any
          tags?: string[]
          related_task_id?: string | null
          verification_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: 'activity_photo' | 'receipt' | 'meeting_photo' | 'document_photo' | 'other'
          status?: 'pending' | 'on_hold' | 'completed' | 'rejected'
          file_url?: string | null
          file_name?: string | null
          thumbnail_url?: string | null
          metadata?: any
          tags?: string[]
          related_task_id?: string | null
          verification_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      broadcasts: {
        Row: {
          id: string
          title: string
          summary: string
          content: string
          category: 'party' | 'election' | 'legal' | 'campaign' | 'event' | 'emergency'
          severity: 'info' | 'warning' | 'critical' | 'urgent'
          status: 'published' | 'draft' | 'archived'
          author: string
          department: string
          tags: string[]
          expires_at: string | null
          priority: number
          target_audience: string[]
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          content: string
          category: 'party' | 'election' | 'legal' | 'campaign' | 'event' | 'emergency'
          severity: 'info' | 'warning' | 'critical' | 'urgent'
          status?: 'published' | 'draft' | 'archived'
          author: string
          department: string
          tags?: string[]
          expires_at?: string | null
          priority?: number
          target_audience?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          content?: string
          category?: 'party' | 'election' | 'legal' | 'campaign' | 'event' | 'emergency'
          severity?: 'info' | 'warning' | 'critical' | 'urgent'
          status?: 'published' | 'draft' | 'archived'
          author?: string
          department?: string
          tags?: string[]
          expires_at?: string | null
          priority?: number
          target_audience?: string[]
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}