import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { TenantActionButtons } from "../tenant/TenantActionButtons"
import { UnitTenantDialog } from "./UnitTenantDialog"
import { TenantReceipt } from "@/components/tenants/TenantReceipt"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { TenantPaymentsTab } from "@/components/apartment/tenant/TenantPaymentsTab"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UnitTenantTabProps {
  unitId: string
}

export function UnitTenantTab({ unitId }: UnitTenantTabProps) {
  const { toast } = useToast()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [showPaymentsDialog, setShowPaymentsDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["unit-tenant", unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("unit_id", unitId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: contract } = useQuery({
    queryKey: ["tenant-contract", tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return null
      const { data, error } = await supabase
        .from("apartment_leases")
        .select("*")
        .eq("tenant_id", tenant.id)
        .eq("unit_id", unitId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!tenant?.id
  })

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", tenant.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })
      setShowDeleteDialog(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucun locataire associé à cette unité
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {tenant.first_name} {tenant.last_name}
                </h3>
                {tenant.phone_number && (
                  <p className="text-sm text-muted-foreground">
                    {tenant.phone_number}
                  </p>
                )}
                {tenant.email && (
                  <p className="text-sm text-muted-foreground">
                    {tenant.email}
                  </p>
                )}
                {tenant.birth_date && (
                  <p className="text-sm text-muted-foreground">
                    Date de naissance: {new Date(tenant.birth_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <TenantActionButtons
                tenant={tenant}
                onEdit={() => {
                  setSelectedTenant(tenant)
                  setShowEditDialog(true)
                }}
                onDelete={() => setShowDeleteDialog(true)}
                onShowReceipt={() => setShowReceiptDialog(true)}
                onShowPayments={() => setShowPaymentsDialog(true)}
                onEndContract={() => setShowInspectionDialog(true)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <UnitTenantDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        apartmentId={unitId}
      />

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent>
          <TenantReceipt
            tenant={{
              nom: tenant.last_name,
              prenom: tenant.first_name,
              telephone: tenant.phone_number || "",
              fraisAgence: contract?.rent_amount?.toString() || "0",
              propertyId: unitId,
            }}
            contractId={contract?.id}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentsDialog} onOpenChange={setShowPaymentsDialog}>
        <DialogContent>
          <TenantPaymentsTab tenantId={tenant.id} />
        </DialogContent>
      </Dialog>

      {contract && (
        <InspectionDialog
          contract={contract}
          open={showInspectionDialog}
          onOpenChange={setShowInspectionDialog}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce locataire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}