import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenantsTable } from "./ApartmentTenantsTable"
import { ApartmentTenantWithLease } from "./types"

export interface ApartmentTenantsTabProps {
  onDeleteTenant: (id: string) => Promise<void>
  onEditTenant: (tenant: ApartmentTenantWithLease) => void
  isLoading?: boolean
}

export function ApartmentTenantsTab({ 
  onDeleteTenant,
  onEditTenant,
  isLoading: externalLoading
}: ApartmentTenantsTabProps) {
  return (
    <ApartmentTenantsTable
      onEdit={onEditTenant}
      onDelete={onDeleteTenant}
      isLoading={externalLoading}
    />
  )
}