import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Profile } from "@/types/profile"

export const useProfileCreation = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createProfile = async (profileData: Omit<Profile, 'id' | 'agency_id'>) => {
    setIsLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: profileData.email,
        password: profileData.password as string,
      })

      if (authError) throw authError

      if (!user?.id) {
        throw new Error("No user ID returned")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      return user.id
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProfile,
    isLoading
  }
}