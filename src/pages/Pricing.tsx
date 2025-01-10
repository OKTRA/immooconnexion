import { useState } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { PricingHero } from "@/components/pricing/PricingHero"
import { FeaturesGrid } from "@/components/pricing/FeaturesGrid"
import { PricingPlans } from "@/components/pricing/PricingPlans"
import { Footer } from "@/components/layout/Footer"

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const handleStartSubscription = (plan: any) => {
    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-white">
      <PublicHeader />
      <main className="flex-1">
        <PricingHero />
        <FeaturesGrid />
        <PricingPlans onSelectPlan={handleStartSubscription} />
      </main>
      <Footer />

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