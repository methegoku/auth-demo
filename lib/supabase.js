
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkdbruqwovuzrnwmvrsi.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZGJydXF3b3Z1enJud212cnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTE3OTIsImV4cCI6MjA2Nzk4Nzc5Mn0.8Lv9s9aab61a1szGmMez_FmejHsJTrP_y7e7xwol_hM"
export const supabase = createClient(supabaseUrl, supabaseKey)