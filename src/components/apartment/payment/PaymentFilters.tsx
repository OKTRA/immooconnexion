import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"

interface PaymentFiltersProps {
  periodFilter: PaymentPeriodFilter;
  statusFilter: PaymentStatusFilter;
  onPeriodFilterChange: (value: PaymentPeriodFilter) => void;
  onStatusFilterChange: (value: PaymentStatusFilter) => void;
}

export function PaymentFilters({
  periodFilter,
  statusFilter,
  onPeriodFilterChange,
  onStatusFilterChange
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/2">
        <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="current">Période en cours</SelectItem>
            <SelectItem value="overdue">En retard</SelectItem>
            <SelectItem value="upcoming">À venir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="late">En retard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}