import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ApartmentTenantsTable } from "@/components/apartment/tenant/ApartmentTenantsTable"
import { ApartmentTenantDialog } from "@/components/apartment/tenant/ApartmentTenantDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function ApartmentTenants() {
  const [open, setOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units(
            unit_number,
            apartment:apartments(
              name
            )
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error
      return data
    }
  })

  const handleEdit = (tenant: any) => {
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

  const filteredTenants = tenants.filter((tenant) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      tenant.first_name?.toLowerCase().includes(searchLower) ||
      tenant.last_name?.toLowerCase().includes(searchLower) ||
      tenant.email?.toLowerCase().includes(searchLower) ||
      tenant.phone_number?.toLowerCase().includes(searchLower) ||
      tenant.apartment_units?.apartment?.name?.toLowerCase().includes(searchLower) ||
      tenant.apartment_units?.unit_number?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
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
          <CardHeader>
            <CardTitle>Rechercher</CardTitle>
          </CardHeader>
          <CardContent>
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
            <ApartmentTenantsTable
              apartmentId="all"
              tenants={filteredTenants}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <ApartmentTenantDialog
          open={open}
          onOpenChange={setOpen}
          apartmentId="all"
          tenant={selectedTenant}
        />
      </div>
    </AgencyLayout>
  )
}