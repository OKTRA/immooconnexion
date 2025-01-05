import { supabase } from "@/integrations/supabase/client"

export const verifyAdminAccess = async (userId: string) => {
  const { data: adminData, error: adminError } = await supabase
    .from('administrators')
    .select('is_super_admin, agency_id')
    .eq('id', userId)
    .single()

  if (adminError || !adminData) {
    throw new Error('Admin verification failed')
  }

  if (!adminData.is_super_admin) {
    throw new Error('Not a super admin')
  }

  return adminData
}