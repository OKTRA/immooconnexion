import { Contract } from "@/integrations/supabase/types/contracts"

interface PropertyActionsProps {
  propertyId: string
  contracts: Contract[]
}

export function PropertyActions({ propertyId, contracts }: PropertyActionsProps) {
  // Removed buttons as requested
  return null
}