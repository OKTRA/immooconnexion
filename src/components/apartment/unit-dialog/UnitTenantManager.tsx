import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UnitTenantManagerProps {
  unitId: string
}

export function UnitTenantManager({ unitId }: UnitTenantManagerProps) {
  const [showAddTenant, setShowAddTenant] = useState(false)
  const { toast } = useToast()

  // Récupérer le bail actif pour cette unité
  const { data: currentLease, isLoading: leaseLoading } = useQuery({
    queryKey: ['unit-lease', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_leases')
        .select(`
          *,
          tenant:apartment_tenants(*)
        `)
        .eq('unit_id', unitId)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  // Récupérer l'historique des paiements
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['unit-payments', unitId],
    queryFn: async () => {
      if (!currentLease?.id) return []
      
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select('*')
        .eq('lease_id', currentLease.id)
        .order('due_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!currentLease?.id
  })

  // Récupérer les pénalités de retard
  const { data: lateFees, isLoading: lateFeesLoading } = useQuery({
    queryKey: ['unit-late-fees', unitId],
    queryFn: async () => {
      if (!currentLease?.id) return []
      
      const { data, error } = await supabase
        .from('late_payment_fees')
        .select('*')
        .eq('lease_id', currentLease.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!currentLease?.id
  })

  if (leaseLoading || paymentsLoading || lateFeesLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {currentLease ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Locataire actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">
                    {currentLease.tenant.first_name} {currentLease.tenant.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{currentLease.tenant.phone_number || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">
                    {format(new Date(currentLease.start_date), 'PP', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">
                    {currentLease.end_date 
                      ? format(new Date(currentLease.end_date), 'PP', { locale: fr })
                      : 'En cours'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                  <p className="font-medium">
                    {currentLease.rent_amount.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Caution</p>
                  <p className="font-medium">
                    {currentLease.deposit_amount?.toLocaleString() || 0} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments?.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.amount.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Échéance: {format(new Date(payment.due_date), 'PP', { locale: fr })}
                      </p>
                    </div>
                    <Badge
                      variant={payment.status === 'paid' ? 'default' : 'secondary'}
                    >
                      {payment.status === 'paid' ? 'Payé' : 'En attente'}
                    </Badge>
                  </div>
                ))}
                {!payments?.length && (
                  <p className="text-center text-muted-foreground">
                    Aucun paiement enregistré
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pénalités de retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lateFees?.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {fee.amount.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Jours de retard: {fee.days_late}
                      </p>
                    </div>
                    <Badge
                      variant={fee.status === 'paid' ? 'default' : 'destructive'}
                    >
                      {fee.status === 'paid' ? 'Payé' : 'Non payé'}
                    </Badge>
                  </div>
                ))}
                {!lateFees?.length && (
                  <p className="text-center text-muted-foreground">
                    Aucune pénalité de retard
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Aucun locataire n'occupe actuellement cette unité
          </p>
          <Button onClick={() => setShowAddTenant(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>
      )}

      <Dialog open={showAddTenant} onOpenChange={setShowAddTenant}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un locataire</DialogTitle>
          </DialogHeader>
          {/* Formulaire d'ajout de locataire à implémenter */}
        </DialogContent>
      </Dialog>
    </div>
  )
}