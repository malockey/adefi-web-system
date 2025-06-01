
import { createClient } from '@supabase/supabase-js';

// Get environment variables with clear defaults for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a mock client for development if credentials are missing
export const supabase = createClient(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Check if Supabase is properly configured with real credentials
export const isSupabaseConfigured = () => {
  const configured = Boolean(
    supabaseUrl &&
    supabaseUrl !== import.meta.env.VITE_SUPABASE_URL
  );
  
  if (!configured) {
    console.warn('Supabase is not properly configured. Please add your Supabase URL and anonymous key to the environment variables.');
  }
  
  return configured;
};

// Call this on app initialization to check configuration
isSupabaseConfigured();
