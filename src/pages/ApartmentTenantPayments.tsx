import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentMonitoringDashboard } from "@/components/apartment/payment/PaymentMonitoringDashboard"
import { PaymentDialog } from "@/components/apartment/payment/PaymentDialog"
import { useState } from "react"

export default function ApartmentTenantPayments() {
  const { tenantId } = useParams()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['apartment-tenant', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_tenants')
        .select(`
          *,
          apartment_leases (
            id,
            rent_amount,
            status
          )
        `)
        .eq('id', tenantId)
        .single()
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Locataire non trouvé
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Paiements - {tenant.first_name} {tenant.last_name}
        </h1>
        <Button 
          onClick={() => setShowPaymentDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      <PaymentMonitoringDashboard />

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onSuccess={() => setShowPaymentDialog(false)}
      />
    </div>
  )
}