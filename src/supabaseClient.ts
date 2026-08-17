import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdxxmxndvafwfejzzxjl.supabase.co'
const supabaseAnonKey = 'sb_publishable_gtwuhlbd3uMSuvIOnv5xEg_VQHoMa0S' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)