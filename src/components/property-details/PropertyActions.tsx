import { Button } from "@/components/ui/button"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"

interface PropertyActionsProps {
  propertyId: string
  contracts: any[]
}

export function PropertyActions({ propertyId, contracts }: PropertyActionsProps) {
  const activeContract = contracts?.[0]

  return (
    <div className="flex gap-4 mt-6">
      <PaymentDialog propertyId={propertyId} />
      {activeContract && <InspectionDialog contract={activeContract} />}
    </div>
  )
}