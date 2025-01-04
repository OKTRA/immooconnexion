import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apidxwaaogboeoctlhtz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWR4d2Fhb2dib2VvY3RsaHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjgzMjIsImV4cCI6MjA1MDY0NDMyMn0.yMVZWGae0Wtkq1l49Na9kE02SCV0ul_oT91nspJ1dM0';

// Helper to clear session data
export const clearSession = () => {
  AsyncStorage.removeItem(`sb-${supabaseUrl.split('//')[1]}-auth-token`);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check and refresh session
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      clearSession();
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    clearSession();
    return null;
  }
};

export { supabaseUrl };