import { UnitBasicInfo } from "./tabs/UnitBasicInfo"
import { UnitFinancialInfo } from "./tabs/UnitFinancialInfo"
import { UnitLeaseInfo } from "./tabs/UnitLeaseInfo"
import { UnitPaymentHistory } from "./tabs/UnitPaymentHistory"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnit, ApartmentLease } from "@/components/apartment/types"

interface UnitDetailsTabProps {
  unit: ApartmentUnit & { apartment?: { name: string } }
}

export function UnitDetailsTab({ unit }: UnitDetailsTabProps) {
  const { data: currentLease } = useQuery({
    queryKey: ["unit-lease", unit.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select("*")
        .eq("unit_id", unit.id)
        .eq("status", "active")
        .maybeSingle()

      if (error) {
        console.error("Error fetching lease:", error)
        if (error.code === "PGRST116") return null // No active lease found
        throw error
      }

      return data as ApartmentLease
    }
  })

  return (
    <div className="space-y-6">
      <UnitBasicInfo unit={unit} />
      <UnitFinancialInfo unit={unit} />
      <UnitLeaseInfo lease={currentLease} />
      <UnitPaymentHistory unitId={unit.id} />
    </div>
  )
}