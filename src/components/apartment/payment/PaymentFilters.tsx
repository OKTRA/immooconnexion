import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentPeriodFilter, PaymentStatusFilter } from "./types"
import { Calendar } from "lucide-react"

interface PaymentFiltersProps {
  periodFilter: PaymentPeriodFilter
  statusFilter: PaymentStatusFilter
  onPeriodFilterChange: (value: PaymentPeriodFilter) => void
  onStatusFilterChange: (value: PaymentStatusFilter) => void
}

export function PaymentFilters({
  periodFilter,
  statusFilter,
  onPeriodFilterChange,
  onStatusFilterChange,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-muted/50 p-4 rounded-lg">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Période
        </label>
        <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
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

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Statut</label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
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