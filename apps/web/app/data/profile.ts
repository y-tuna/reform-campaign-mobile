import { createClient } from '@supabase/supabase-js'
import { Profile, ProfileUpdate, ProfileSchema } from '@/app/types/profile'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Get user profile
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  // Validate against schema
  const result = ProfileSchema.safeParse(data)
  if (!result.success) {
    console.error('Profile schema validation failed:', result.error)
    throw new Error('Invalid profile data received from server')
  }

  return result.data
}

// Update user profile
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  // Validate response
  const result = ProfileSchema.safeParse(data)
  if (!result.success) {
    throw new Error('Invalid profile data received from server after update')
  }

  return result.data
}

// Subscribe to profile changes
export function subscribeToProfile(
  userId: string, 
  onProfileChange: (profile: Profile) => void
) {
  const channel = supabase
    .channel(`profiles:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        console.log('Profile changed:', payload)
        
        if (payload.new) {
          const result = ProfileSchema.safeParse(payload.new)
          if (result.success) {
            onProfileChange(result.data)
          } else {
            console.error('Invalid profile data from subscription:', result.error)
          }
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Check if profile is complete
export function isProfileComplete(profile: Partial<Profile>): boolean {
  return !!(
    profile.name &&
    profile.phone &&
    profile.intensity &&
    profile.mobility &&
    profile.font_scale
  )
}

// Calculate profile completion percentage
export function getProfileCompletionPercentage(profile: Partial<Profile>): number {
  const requiredFields = ['name', 'phone', 'intensity', 'mobility', 'font_scale']
  const completedFields = requiredFields.filter(field => 
    profile[field as keyof Profile]
  )
  
  return Math.round((completedFields.length / requiredFields.length) * 100)
}