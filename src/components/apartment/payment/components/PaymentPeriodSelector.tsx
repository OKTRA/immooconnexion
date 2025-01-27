import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"

interface PaymentPeriodSelectorProps {
  leaseId: string
  onPeriodsChange: (periods: string[]) => void
}

export function PaymentPeriodSelector({
  leaseId,
  onPeriodsChange
}: PaymentPeriodSelectorProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])

  const { data: periods = [], isLoading } = useQuery({
    queryKey: ["payment-periods", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_payment_periods")
        .select("*")
        .eq("lease_id", leaseId)
        .eq("status", "pending")
        .order("start_date", { ascending: true })

      if (error) throw error
      return data
    }
  })

  const handlePeriodToggle = (periodId: string) => {
    const newSelection = selectedPeriods.includes(periodId)
      ? selectedPeriods.filter(id => id !== periodId)
      : [...selectedPeriods, periodId]
    
    setSelectedPeriods(newSelection)
    onPeriodsChange(newSelection)
  }

  if (isLoading) {
    return <div>Chargement des périodes...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Périodes de paiement</h3>
      <div className="space-y-2">
        {periods.map((period) => (
          <Card key={period.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={period.id}
                  checked={selectedPeriods.includes(period.id)}
                  onCheckedChange={() => handlePeriodToggle(period.id)}
                />
                <label htmlFor={period.id} className="text-sm">
                  {format(new Date(period.start_date), "PP", { locale: fr })} - {format(new Date(period.end_date), "PP", { locale: fr })}
                </label>
              </div>
              <span className="font-medium">{period.amount.toLocaleString()} FCFA</span>
            </div>
          </Card>
        ))}
        {periods.length === 0 && (
          <p className="text-center text-muted-foreground">
            Aucune période de paiement en attente
          </p>
        )}
      </div>
    </div>
  )
}