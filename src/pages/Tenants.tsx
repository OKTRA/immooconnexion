import { useState } from "react"
import { TenantsTable } from "@/components/TenantsTable"
import { TenantsDialog } from "@/components/TenantsDialog"
import { TenantDisplay } from "@/hooks/use-tenants"
import { GlobalHeader } from "@/components/layout/GlobalHeader"

const Tenants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantDisplay | undefined>()

  const handleEdit = (tenant: TenantDisplay) => {
    setSelectedTenant(tenant)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Gestion des Locataires</h1>
          <TenantsDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            tenant={selectedTenant}
          />
        </div>
        <TenantsTable onEdit={handleEdit} />
      </main>
    </div>
  )
}

export default Tenants