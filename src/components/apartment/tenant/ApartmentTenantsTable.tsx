import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Split } from "lucide-react"
import { CreateLeaseDialog } from "../lease/CreateLeaseDialog"
import { SplitLeaseDialog } from "../lease/SplitLeaseDialog"
import { useState } from "react"
import { TenantActionButtons } from "./TenantActionButtons"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantsTableProps {
  onEdit: (tenant: ApartmentTenant) => void
  onDelete: (id: string) => Promise<void>
}

export function ApartmentTenantsTable({ onEdit, onDelete }: ApartmentTenantsTableProps) {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [showSplitLeaseDialog, setShowSplitLeaseDialog] = useState(false)

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("agency_id", profile.agency_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as ApartmentTenant[]
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.first_name}</TableCell>
              <TableCell>{tenant.last_name}</TableCell>
              <TableCell>{tenant.email || "-"}</TableCell>
              <TableCell>{tenant.phone_number || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTenant(tenant.id)
                      setShowLeaseDialog(true)
                    }}
                  >
                    Créer un bail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                      setSelectedTenant(tenant.id)
                      setShowSplitLeaseDialog(true)
                    }}
                  >
                    <Split className="w-4 h-4 mr-2" />
                    Bail partagé
                  </Button>
                  <TenantActionButtons
                    tenant={tenant}
                    onEdit={() => onEdit(tenant)}
                    onDelete={() => onDelete(tenant.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTenant && (
        <>
          <CreateLeaseDialog
            open={showLeaseDialog}
            onOpenChange={setShowLeaseDialog}
            tenantId={selectedTenant}
          />
          <SplitLeaseDialog
            open={showSplitLeaseDialog}
            onOpenChange={setShowSplitLeaseDialog}
            tenantId={selectedTenant}
          />
        </>
      )}
    </>
  )
}