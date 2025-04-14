import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize Supabase
// To use in your Expo app, add these to app.json:
// "extra": {
//   "supabaseUrl": "YOUR_SUPABASE_URL",
//   "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
// }

// Get Supabase URL and anon key from environment variables
const supabaseUrl = 'https://zyxnwnomenyjqdxgbmie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eG53bm9tZW55anFkeGdibWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzYxMjUsImV4cCI6MjA2MDE1MjEyNX0.X-bLCBZjA10xAxqWYYN8yqXItEFpz2svtC_eJBlR0ZE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 