import { supabase } from "@/integrations/supabase/client"

export async function updateAgencyLimits(agencyId: string) {
  console.log("Updating agency limits for:", agencyId)

  try {
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

    console.log("Current counts:", {
      properties: propertiesCount,
      tenants: tenantsCount,
      profiles: profilesCount
    })

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

    console.log("Agency limits updated successfully")
  } catch (error) {
    console.error('Error in updateAgencyLimits:', error)
    throw error
  }
}