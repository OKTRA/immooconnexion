import { Card } from "@/components/ui/card"

interface CurrentPlanCardProps {
  currentPlan: any
  currentUsage: {
    properties: number
    tenants: number
    users: number
  }
}

export function CurrentPlanCard({ currentPlan, currentUsage }: CurrentPlanCardProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Plan actuel</h2>
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{currentPlan?.name || 'Basic'}</h3>
            <p className="text-sm text-muted-foreground">
              {currentPlan?.price?.toLocaleString() || 0} FCFA/mois
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Propriétés: {currentUsage.properties} / {currentPlan?.max_properties === -1 ? '∞' : currentPlan?.max_properties || 1}</p>
            <p>Locataires: {currentUsage.tenants} / {currentPlan?.max_tenants === -1 ? '∞' : currentPlan?.max_tenants || 1}</p>
            <p>Utilisateurs: {currentUsage.users} / {currentPlan?.max_users === -1 ? '∞' : currentPlan?.max_users || 1}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}