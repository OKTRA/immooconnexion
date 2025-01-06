import { Card } from "@/components/ui/card"

export function FreePlanInfo() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Plan Gratuit</h3>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Vous utilisez actuellement le plan gratuit qui inclut :
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>1 propriété</li>
          <li>1 locataire</li>
          <li>1 utilisateur</li>
          <li>Fonctionnalités de base</li>
        </ul>
      </div>
    </Card>
  )
}