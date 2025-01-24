import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { ApartmentTenant } from "@/types/apartment"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TenantForm } from "@/components/tenant/TenantForm"
import { TenantTable } from "@/components/tenant/TenantTable"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export interface ApartmentTenantsTabProps {
  apartmentId: string
  isLoading: boolean
  onDeleteTenant: (id: string) => Promise<void>
  onEditTenant: () => void
}

export function ApartmentTenantsTab({
  apartmentId,
  isLoading,
  onDeleteTenant,
  onEditTenant
}: ApartmentTenantsTabProps) {
  const { toast } = useToast()
  
  const { data: tenants = [], isLoading: tenantsLoading, error } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.id) {
          throw new Error("Non authentifié")
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', user.id)
          .single()

        if (!profileData?.agency_id) {
          return []
        }

        const { data, error } = await supabase
          .from("apartment_tenants")
          .select(`
            *,
            apartment_leases (
              id,
              tenant_id,
              unit_id,
              start_date,
              end_date,
              rent_amount,
              deposit_amount,
              payment_frequency,
              duration_type,
              status,
              payment_type,
              agency_id
            )
          `)
          .eq('agency_id', profileData.agency_id)

        if (error) {
          console.error('Erreur lors de la récupération des locataires:', error)
          throw error
        }

        return data as ApartmentTenant[]
      } catch (error: any) {
        console.error('Error in tenant query:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les locataires. Veuillez réessayer.",
          variant: "destructive"
        })
        return []
      }
    },
    retry: false
  })

  if (isLoading || tenantsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Une erreur est survenue lors du chargement des locataires
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locataires</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau locataire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un locataire</DialogTitle>
            </DialogHeader>
            <TenantForm apartmentId={apartmentId} />
          </DialogContent>
        </Dialog>
      </div>

      <TenantTable
        tenants={tenants}
        onDelete={onDeleteTenant}
        onEdit={onEditTenant}
      />
    </div>
  )
}