import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize Supabase
// To use in your Expo app, add these to app.json:
// "extra": {
//   "supabaseUrl": "YOUR_SUPABASE_URL",
//   "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
// }

// For now we'll use hardcoded values, but in a real app you'd use environment variables
// Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 