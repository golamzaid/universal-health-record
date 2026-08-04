import { createClient } from '@supabase/supabase-js'

// Tumhara exact Supabase Project URL aur Publishable Key
const supabaseUrl = 'https://bdxxmxndvafwfejzzxjl.supabase.co'
const supabaseAnonKey = 'sb_publishable_gtwuhlbd3uMSuvIOnv5xEg_VQHoMa0S' // Tumhari poori key copy karke paste karo

export const supabase = createClient(supabaseUrl, supabaseAnonKey)