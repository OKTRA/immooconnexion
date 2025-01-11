import { UnitBasicInfo } from "./tabs/UnitBasicInfo"
import { UnitFinancialInfo } from "./tabs/UnitFinancialInfo"
import { UnitLeaseInfo } from "./tabs/UnitLeaseInfo"
import { UnitPaymentHistory } from "./tabs/UnitPaymentHistory"
import { ApartmentUnit } from "@/types/apartment"

interface UnitDetailsTabProps {
  unit: ApartmentUnit
}

export function UnitDetailsTab({ unit }: UnitDetailsTabProps) {
  return (
    <div className="space-y-6">
      <UnitBasicInfo unit={unit} />
      <UnitFinancialInfo unit={unit} />
      <UnitLeaseInfo unitId={unit.id} />
      <UnitPaymentHistory unitId={unit.id} />
    </div>
  )
}