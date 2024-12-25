import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyInfo } from "@/components/property-details/PropertyInfo"
import { PaymentHistory } from "@/components/property-details/PaymentHistory"
import { InspectionsList } from "@/components/property-details/InspectionsList"
import { PropertyActions } from "@/components/property-details/PropertyActions"
import { useToast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Loader2 } from "lucide-react"
import { MobileMenu } from "@/components/property-details/MobileMenu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const PropertyDetails = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const isMobile = useIsMobile()

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

      // Fetch related tenant and property information
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
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {!isMobile && <AppSidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 space-y-6 pb-16">
            {isMobile && <MobileMenu />}
            <PropertyInfo property={property} />
            <PropertyActions propertyId={id || ''} contracts={contracts} />
            <PaymentHistory 
              propertyId={id || ''} 
              contracts={contracts}
              onPrintReceipt={(contract) => {
                const receiptContent = `
                  <html>
                    <head>
                      <title>Reçu de Paiement</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .details { margin: 20px 0; }
                        .footer { margin-top: 50px; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1>Reçu de Paiement</h1>
                        <p>Date: ${format(new Date(contract.created_at), 'PP', { locale: fr })}</p>
                      </div>
                      <div class="details">
                        <p><strong>Locataire:</strong> ${contract.tenant_prenom} ${contract.tenant_nom}</p>
                        <p><strong>Bien:</strong> ${contract.property_name}</p>
                        <p><strong>Montant:</strong> ${contract.montant?.toLocaleString()} FCFA</p>
                        <p><strong>Type:</strong> ${contract.type}</p>
                        <p><strong>Période:</strong> ${format(new Date(contract.start_date), 'PP', { locale: fr })} - ${format(new Date(contract.end_date), 'PP', { locale: fr })}</p>
                      </div>
                      <div class="footer">
                        <p>Signature: _____________________</p>
                      </div>
                    </body>
                  </html>
                `
                const printWindow = window.open('', '_blank')
                if (printWindow) {
                  printWindow.document.write(receiptContent)
                  printWindow.document.close()
                  printWindow.print()
                }
              }}
              onPrintContract={(contract) => {
                const contractContent = `
                  <html>
                    <head>
                      <title>Contrat de Location</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .section { margin: 20px 0; }
                        .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1>Contrat de Location</h1>
                        <p>Date: ${format(new Date(contract.created_at), 'PP', { locale: fr })}</p>
                      </div>
                      <div class="section">
                        <h2>1. Parties</h2>
                        <p><strong>Locataire:</strong> ${contract.tenant_prenom} ${contract.tenant_nom}</p>
                        <p><strong>Propriété:</strong> ${contract.property_name}</p>
                      </div>
                      <div class="section">
                        <h2>2. Conditions</h2>
                        <p><strong>Loyer mensuel:</strong> ${contract.montant?.toLocaleString()} FCFA</p>
                        <p><strong>Durée du bail:</strong> Du ${format(new Date(contract.start_date), 'PP', { locale: fr })} au ${format(new Date(contract.end_date), 'PP', { locale: fr })}</p>
                      </div>
                      <div class="signatures">
                        <div>
                          <p>Le Propriétaire:</p>
                          <p>_____________________</p>
                        </div>
                        <div>
                          <p>Le Locataire:</p>
                          <p>_____________________</p>
                        </div>
                      </div>
                    </body>
                  </html>
                `
                const printWindow = window.open('', '_blank')
                if (printWindow) {
                  printWindow.document.write(contractContent)
                  printWindow.document.close()
                  printWindow.print()
                }
              }}
            />
            <InspectionsList contracts={contracts} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertyDetails
