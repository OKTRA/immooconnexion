import { useState } from "react"
import { TenantsTable } from "@/components/TenantsTable"
import { TenantsDialog } from "@/components/TenantsDialog"
import { TenantDisplay } from "@/hooks/use-tenants"

const Tenants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantDisplay | undefined>()

  const handleEdit = (tenant: TenantDisplay) => {
    setSelectedTenant(tenant)
    setIsDialogOpen(true)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Locataires</h1>
        <TenantsDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          tenant={selectedTenant}
        />
      </div>
      <TenantsTable onEdit={handleEdit} />
    </div>
  )
}

export default Tenants