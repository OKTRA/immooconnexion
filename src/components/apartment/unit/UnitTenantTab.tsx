import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Receipt, CreditCard, ClipboardList, FileCheck } from "lucide-react"
import { UnitTenantDialog } from "./UnitTenantDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface UnitTenantTabProps {
  unitId: string
}

export function UnitTenantTab({ unitId }: UnitTenantTabProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["unit-tenant", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            rent_amount,
            deposit_amount,
            start_date,
            end_date,
            status
          )
        `)
        .eq("unit_id", unitId)
        .maybeSingle()

      if (error) throw error
      return data
    }
  })

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", tenant?.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé",
      })
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Aucun locataire associé à cette unité</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentLease = tenant.apartment_leases?.[0]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nom complet</p>
              <p className="text-sm text-muted-foreground">
                {tenant.first_name} {tenant.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">{tenant.phone_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{tenant.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date de naissance</p>
              <p className="text-sm text-muted-foreground">
                {tenant.birth_date ? new Date(tenant.birth_date).toLocaleDateString() : "-"}
              </p>
            </div>
            {currentLease && (
              <>
                <div>
                  <p className="text-sm font-medium">Loyer mensuel</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLease.rent_amount?.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Caution</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLease.deposit_amount?.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date de début</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentLease.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date de fin</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLease.end_date ? new Date(currentLease.end_date).toLocaleDateString() : "-"}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden md:inline">Modifier</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/agence/locataires/${tenant.id}/recu`)}
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden md:inline">Reçu</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/agence/locataires/${tenant.id}/paiements`)}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Paiements</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/agence/locataires/${tenant.id}/contrats`)}
              className="flex items-center gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden md:inline">Contrats</span>
            </Button>

            {currentLease && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInspectionDialog(true)}
                className="flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                <span className="hidden md:inline">Fin de contrat</span>
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden md:inline">Supprimer</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <UnitTenantDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        unitId={unitId}
        tenant={tenant}
      />

      {currentLease && (
        <InspectionDialog
          open={showInspectionDialog}
          onOpenChange={setShowInspectionDialog}
          contract={currentLease}
        />
      )}
    </div>
  )
}