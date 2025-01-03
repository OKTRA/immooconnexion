import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SubscriptionPlanRow } from "./SubscriptionPlanRow"
import { RefetchOptions } from "@tanstack/react-query"
import { SubscriptionPlan } from "./types"

export interface PlansTableProps {
  plans: SubscriptionPlan[]
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (id: string) => void
  refetch: (options?: RefetchOptions) => Promise<any>
}

export function PlansTable({ plans, onEdit, onDelete, refetch }: PlansTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead className="hidden md:table-cell">Max Propriétés</TableHead>
            <TableHead className="hidden md:table-cell">Max Locataires</TableHead>
            <TableHead className="hidden md:table-cell">Max Utilisateurs</TableHead>
            <TableHead className="hidden lg:table-cell">Fonctionnalités</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <SubscriptionPlanRow
              key={plan.id}
              plan={plan}
              onEdit={onEdit}
              onDelete={onDelete}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}