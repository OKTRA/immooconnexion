import { supabase } from "@/integrations/supabase/client";

export const getOrCreateUser = async (email: string) => {
  // First try to get the profile by email
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile.id;
  }

  // If no profile exists, create a new user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: 'temporary-password-' + Math.random().toString(36).slice(2),
  });

  if (signUpError) throw signUpError;
  if (!authData.user) throw new Error("No user data returned");

  const userId = authData.user.id;

  // Create or update the profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email
    });

  if (profileError) throw profileError;

  return userId;
};