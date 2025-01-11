import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UnitFinancialInfoProps {
  unit: {
    rent_amount: number;
    deposit_amount: number | null;
  }
}

export function UnitFinancialInfo({ unit }: UnitFinancialInfoProps) {
  const calculateAgencyFees = (rentAmount: number) => {
    return rentAmount * 0.5 // 50% du loyer
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations financières</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Loyer mensuel</p>
            <p className="text-sm text-muted-foreground">
              {unit.rent_amount.toLocaleString()} FCFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Caution</p>
            <p className="text-sm text-muted-foreground">
              {unit.deposit_amount?.toLocaleString() || "-"} FCFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Frais d'agence</p>
            <p className="text-sm text-muted-foreground">
              {calculateAgencyFees(unit.rent_amount).toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}