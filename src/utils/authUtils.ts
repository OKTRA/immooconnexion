import { supabase } from "@/integrations/supabase/client";

export const getOrCreateUser = async (email: string) => {
  // First try to get the user
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return existingUser.id;
  }

  // If user doesn't exist, create them
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'temporary-password-' + Math.random().toString(36).slice(2),
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("No user data returned");

  return authData.user.id;
};