import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyInfo } from "./PropertyInfo"
import { PaymentHistory } from "./PaymentHistory"
import { InspectionsList } from "./InspectionsList"
import { PropertyActions } from "./PropertyActions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export const PropertyDetailsContent = () => {
  const { id } = useParams()
  const { toast } = useToast()

  const { data: property, isLoading: isLoadingProperty, error: propertyError } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log("Fetching property details for ID:", id)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated")
        throw new Error("Non authentifié")
      }
      console.log("Current user ID:", user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      console.log("User profile:", profile)

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) {
        console.error("Error fetching property:", error)
        throw error
      }

      console.log("Property data:", data)
      return data
    },
    enabled: !!id
  })

  const { data: contracts = [], isLoading: isLoadingContracts, error: contractsError } = useQuery({
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
          tenant_id,
          property_id,
          start_date,
          end_date
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

  if (isLoadingProperty || isLoadingContracts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (propertyError || contractsError || !property) {
    console.error("Errors:", { propertyError, contractsError })
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Une erreur est survenue lors du chargement des données
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-16">
      <PropertyInfo property={property} />
      <PropertyActions propertyId={id || ''} contracts={contracts} />
      <PaymentHistory 
        propertyId={id || ''} 
        contracts={contracts}
      />
      <InspectionsList contracts={contracts} />
    </div>
  )
}