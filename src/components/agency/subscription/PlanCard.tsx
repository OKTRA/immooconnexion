import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, AlertTriangle } from "lucide-react"

interface PlanCardProps {
  plan: any
  isCurrentPlan: boolean
  canDowngrade: boolean
  isDowngrade: boolean
  onSelect: () => void
}

export function PlanCard({ 
  plan, 
  isCurrentPlan, 
  canDowngrade, 
  isDowngrade,
  onSelect 
}: PlanCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">
            {plan.price.toLocaleString()} FCFA/mois
          </p>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.max_properties === -1 ? 'Propriétés illimitées' : `${plan.max_properties} propriétés`}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.max_tenants === -1 ? 'Locataires illimités' : `${plan.max_tenants} locataires`}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.max_users === -1 ? 'Utilisateurs illimités' : `${plan.max_users} utilisateurs`}
          </li>
          {plan.features?.map((feature: string) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>

        {isDowngrade && !canDowngrade && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Réduisez votre utilisation pour pouvoir rétrograder</span>
          </div>
        )}

        <Button 
          className="w-full" 
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan}
          onClick={onSelect}
        >
          {isCurrentPlan ? 'Plan actuel' : 'Sélectionner'}
        </Button>
      </div>
    </Card>
  )
}