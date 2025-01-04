import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  plan: any
  onSelect: (plan: any) => void
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "rounded-3xl p-8 ring-1 ring-gray-200",
        "hover:shadow-lg transition-shadow duration-300",
        "bg-white/50 backdrop-blur-sm"
      )}
    >
      <h3 className="text-2xl font-semibold leading-8 text-gray-900">
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-x-2">
        <span className="text-4xl font-bold tracking-tight text-gray-900">
          {plan.price.toLocaleString()}
        </span>
        <span className="text-sm font-semibold leading-6 text-gray-600">FCFA/mois</span>
      </div>
      <Button 
        className="mt-6 w-full"
        onClick={() => onSelect(plan)}
      >
        Commencer maintenant
      </Button>
      <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
        {plan.features?.map((feature: string) => (
          <li key={feature} className="flex gap-x-3">
            <Check className="h-6 w-5 flex-none text-primary" />
            {feature}
          </li>
        ))}
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-primary" />
          {plan.max_tenants === -1 
            ? "Locataires illimités" 
            : `Jusqu'à ${plan.max_tenants} locataire${plan.max_tenants > 1 ? 's' : ''}`}
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-primary" />
          {plan.max_properties === -1 
            ? "Propriétés illimitées" 
            : `Jusqu'à ${plan.max_properties} propriété${plan.max_properties > 1 ? 's' : ''}`}
        </li>
        <li className="flex gap-x-3">
          <Check className="h-6 w-5 flex-none text-primary" />
          {plan.max_users === -1 
            ? "Utilisateurs illimités" 
            : `Jusqu'à ${plan.max_users} utilisateur${plan.max_users > 1 ? 's' : ''}`}
        </li>
      </ul>
    </Card>
  )
}