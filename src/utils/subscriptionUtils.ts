import { supabase } from "@/integrations/supabase/client"

export async function updateAgencyLimits(agencyId: string) {
  const [
    { count: propertiesCount },
    { count: tenantsCount },
    { count: profilesCount }
  ] = await Promise.all([
    supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId),
    supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
  ])

  const { error } = await supabase
    .from('agencies')
    .update({
      current_properties_count: propertiesCount || 0,
      current_tenants_count: tenantsCount || 0,
      current_profiles_count: profilesCount || 0
    })
    .eq('id', agencyId)

  if (error) {
    console.error('Error updating agency limits:', error)
    throw error
  }
}