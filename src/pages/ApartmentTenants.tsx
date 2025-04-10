import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { ApartmentTenantsTable } from "@/components/apartment/tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "@/components/apartment/tenant/ApartmentTenantDialog"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ApartmentTenant } from "@/types/apartment"
import { Loader2 } from "lucide-react"

const TableLoader = () => (
  <div className="flex justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

export default function ApartmentTenants() {
  const [open, setOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<ApartmentTenant | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleEdit = (tenant: ApartmentTenant) => {
    setSelectedTenant(tenant)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .delete()
        .eq("id", id)

      if (error) throw error

      await queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })

      toast({
        title: "Succès",
        description: "Le locataire a été supprimé avec succès",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Locataires des appartements</h1>
          <Button onClick={() => {
            setSelectedTenant(null)
            setOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Suspense fallback={<TableLoader />}>
              <ApartmentTenantsTable
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Suspense>
          </CardContent>
        </Card>

        <ApartmentTenantDialog
          open={open}
          onOpenChange={setOpen}
          tenant={selectedTenant}
          unitId={selectedTenant?.unit_id || undefined}
        />
      </div>
    </AgencyLayout>
  )
}