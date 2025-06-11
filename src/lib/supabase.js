import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqkzluoyzmhhenboqcnu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa3psdW95em1oaGVuYm9xY251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTYzMDQsImV4cCI6MjA2NTE3MjMwNH0.MV4uAfmzc85N4sNDH__3so9nPMWai3C8a_yAVmjbR3w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 