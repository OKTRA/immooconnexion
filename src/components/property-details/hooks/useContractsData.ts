import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useContractsData = (id: string | undefined) => {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: async () => {
      console.log("Fetching contracts for property:", id)
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          id,
          montant,
          type,
          created_at,
          updated_at,
          tenant_id,
          property_id,
          start_date,
          end_date,
          statut,
          agency_id
        `)
        .eq('property_id', id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Error fetching contracts:", error)
        throw error
      }

      const contractsWithDetails = await Promise.all(
        contracts.map(async (contract) => {
          const [tenantResult, propertyResult] = await Promise.all([
            contract.tenant_id
              ? supabase
                  .from('tenants')
                  .select('nom, prenom')
                  .eq('id', contract.tenant_id)
                  .single()
              : { data: null },
            supabase
              .from('properties')
              .select('bien')
              .eq('id', contract.property_id)
              .single()
          ])

          return {
            ...contract,
            tenant_nom: tenantResult.data?.nom,
            tenant_prenom: tenantResult.data?.prenom,
            property_name: propertyResult.data?.bien
          }
        })
      )

      console.log("Contracts data:", contractsWithDetails)
      return contractsWithDetails
    },
    enabled: !!id
  })
}