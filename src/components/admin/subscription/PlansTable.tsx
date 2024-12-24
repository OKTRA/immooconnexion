import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table"
import { SubscriptionPlanRow } from "./SubscriptionPlanRow"

interface PlansTableProps {
  plans: any[]
  onEdit: (plan: any) => void
  onDelete: (id: string) => void
}

export function PlansTable({ plans, onEdit, onDelete }: PlansTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableHead>Nom</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Max Propriétés</TableHead>
          <TableHead>Max Locataires</TableHead>
          <TableHead>Fonctionnalités</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <SubscriptionPlanRow
              key={plan.id}
              plan={plan}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}