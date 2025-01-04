import { ScrollArea } from "@/components/ui/scroll-area"
import { Agency } from "./types"
import { AgencyBasicInfo } from "./AgencyBasicInfo"
import { AgencySubscriptionPlan } from "./AgencySubscriptionPlan"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
  onSubmit?: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency, onSubmit }: AgencyFormProps) {
  const handleFieldChange = (field: keyof Agency, value: string) => {
    setAgency({ ...agency, [field]: value })
  }

  const handlePlanChange = (planId: string) => {
    setAgency({ ...agency, subscription_plan_id: planId })
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AgencyBasicInfo 
          agency={agency} 
          onChange={handleFieldChange} 
        />
        <AgencySubscriptionPlan 
          agency={agency}
          onPlanChange={handlePlanChange}
        />
      </div>
    </ScrollArea>
  )
}