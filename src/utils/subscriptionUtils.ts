import { supabase } from "@/integrations/supabase/client"

export async function updateAgencyLimits(agencyId: string) {
  console.log("Updating agency limits for:", agencyId)

  try {
    // Get current counts
    const [
      { count: propertiesCount, error: propError },
      { count: tenantsCount, error: tenantError },
      { count: profilesCount, error: profileError }
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

    if (propError || tenantError || profileError) {
      throw new Error('Error fetching counts')
    }

    console.log("Current counts:", {
      properties: propertiesCount,
      tenants: tenantsCount,
      profiles: profilesCount
    })

    // Update agency with new counts
    const { error: updateError } = await supabase
      .from('agencies')
      .update({
        current_properties_count: propertiesCount || 0,
        current_tenants_count: tenantsCount || 0,
        current_profiles_count: profilesCount || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', agencyId)

    if (updateError) {
      console.error('Error updating agency limits:', updateError)
      throw updateError
    }

    console.log("Agency limits updated successfully")
  } catch (error) {
    console.error('Error in updateAgencyLimits:', error)
    throw error
  }
}