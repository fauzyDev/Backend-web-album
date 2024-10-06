import { createClient } from '@supabase/supabase-js'

const supabseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabseUrl, supabaseKey)
