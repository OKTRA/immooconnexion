import { useState } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { PricingHero } from "@/components/pricing/PricingHero"
import { FeaturesGrid } from "@/components/pricing/FeaturesGrid"
import { PricingPlans } from "@/components/pricing/PricingPlans"

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const handleStartSubscription = (plan: any) => {
    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PublicHeader />
      <PricingHero />
      <FeaturesGrid />
      <PricingPlans onSelectPlan={handleStartSubscription} />

      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </div>
  )
}