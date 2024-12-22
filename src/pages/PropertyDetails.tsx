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

const PropertyDetails = () => {
  const { id } = useParams()
  const { toast } = useToast()

  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du bien",
          variant: "destructive",
        })
        throw error
      }
      return data
    }
  })

  const { data: contracts, isLoading: isLoadingContracts } = useQuery({
    queryKey: ['contracts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_history_with_tenant')
        .select('*')
        .eq('property_id', id)
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des paiements",
          variant: "destructive",
        })
        throw error
      }
      return data
    }
  })

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

  if (isLoadingProperty || isLoadingContracts) {
    return <div>Chargement...</div>
  }

  if (!property) {
    return <div>Bien non trouvé</div>
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar className="w-64" />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
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