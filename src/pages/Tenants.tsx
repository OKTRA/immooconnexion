import { useState } from "react"
import { TenantsTable } from "@/components/TenantsTable"
import { TenantsDialog } from "@/components/TenantsDialog"
import { TenantDisplay } from "@/hooks/use-tenants"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TenantFormData } from "@/types/tenant"

const Tenants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantFormData | undefined>()

  const handleEdit = (tenant: TenantDisplay) => {
    const formData: TenantFormData = {
      id: tenant.id,
      first_name: tenant.first_name,
      last_name: tenant.last_name,
      phone_number: tenant.phone_number,
      photo_id_url: tenant.photo_id_url,
      agency_fees: tenant.agency_fees,
      profession: tenant.profession,
      property_id: tenant.property_id
    };
    setSelectedTenant(formData)
    setIsDialogOpen(true)
  }

  return (
    <AgencyLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Locataires</h1>
        <Button onClick={() => {
          setSelectedTenant(undefined)
          setIsDialogOpen(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un locataire
        </Button>
        <TenantsDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          tenant={selectedTenant}
        />
      </div>
      <TenantsTable onEdit={handleEdit} />
    </AgencyLayout>
  )
}

export default Tenants