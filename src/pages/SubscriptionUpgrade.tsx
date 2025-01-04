import { SubscriptionUpgradeTab } from "@/components/agency/subscription/SubscriptionUpgradeTab"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function SubscriptionUpgrade() {
  return (
    <AgencyLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Gestion de l'abonnement</h1>
        <SubscriptionUpgradeTab />
      </div>
    </AgencyLayout>
  )
}