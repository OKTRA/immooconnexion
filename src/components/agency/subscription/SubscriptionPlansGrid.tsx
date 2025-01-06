import { SubscriptionPlan } from "@/components/admin/subscription/types"
import { PlanCard } from "./PlanCard"

interface SubscriptionPlansGridProps {
  availablePlans: SubscriptionPlan[]
  currentPlan: SubscriptionPlan
  onPlanSelect: (plan: SubscriptionPlan) => void
  canDowngrade: (plan: SubscriptionPlan) => boolean
}

export function SubscriptionPlansGrid({ 
  availablePlans, 
  currentPlan, 
  onPlanSelect,
  canDowngrade 
}: SubscriptionPlansGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {availablePlans.map((plan: SubscriptionPlan) => {
        const isCurrentPlan = plan.id === currentPlan.id
        const canDowngradeToPlan = canDowngrade(plan)
        const isDowngrade = plan.price < currentPlan.price

        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={isCurrentPlan}
            canDowngrade={canDowngradeToPlan}
            isDowngrade={isDowngrade}
            onSelect={() => onPlanSelect(plan)}
          />
        )
      })}
    </div>
  )
}