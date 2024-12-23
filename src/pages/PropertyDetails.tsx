import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PropertyInfo } from "@/components/property-details/PropertyInfo"
import { PaymentHistory } from "@/components/property-details/PaymentHistory"
import { InspectionsList } from "@/components/property-details/InspectionsList"
import { useToast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Loader2 } from "lucide-react"
import { MobileMenu } from "@/components/property-details/MobileMenu"

interface Property {
  id: string
  bien: string
  type: string
  chambres: number
  ville: string
  loyer: number
  frais_agence: number
  taux_commission: number
  caution: number
  statut: string
  photo_url: string | null
  user_id: string
  created_at: string
  updated_at: string
}

const PropertyDetails = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  console.log("Property ID:", id) // Log the property ID

  const { data: property, isLoading: isLoadingProperty, error: propertyError } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log("Fetching property details for ID:", id)
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current user:", user)

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      console.log("Property data:", data)
      console.log("Property error:", error)
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du bien",
          variant: "destructive",
        })
        throw error
      }
      return data
    },
    enabled: !!id
  })

  const { data: contracts, isLoading: isLoadingContracts, error: contractsError } = useQuery({
    queryKey: ['contracts', id],
    queryFn: async () => {
      console.log("Fetching contracts for property ID:", id)
      
      const { data, error } = await supabase
        .from('payment_history_with_tenant')
        .select('*')
        .eq('property_id', id)
      
      console.log("Contracts data:", data)
      console.log("Contracts error:", error)
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des paiements",
          variant: "destructive",
        })
        throw error
      }
      return data
    },
    enabled: !!id
  })

  // Log loading states and errors
  console.log("Loading states:", { isLoadingProperty, isLoadingContracts })
  console.log("Errors:", { propertyError, contractsError })
  console.log("Property data:", property)
  console.log("Contracts data:", contracts)

  if (isLoadingProperty || isLoadingContracts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (propertyError || contractsError) {
    console.error("Property error:", propertyError)
    console.error("Contracts error:", contractsError)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Une erreur est survenue lors du chargement des données
      </div>
    )
  }

  if (!property) {
    console.log("No property found")
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Bien non trouvé
      </div>
    )
  }

  const handlePrintReceipt = (contract: any) => {
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
  }

  const handlePrintContract = (contract: any) => {
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
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {!isMobile && <AppSidebar className="w-64 flex-shrink-0" />}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 space-y-6 pb-16">
            {isMobile && <MobileMenu />}
            <PropertyInfo property={property} />
            <PaymentHistory 
              propertyId={id || ''} 
              contracts={contracts || []}
              onPrintReceipt={handlePrintReceipt}
              onPrintContract={handlePrintContract}
            />
            <InspectionsList contracts={contracts || []} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertyDetails
