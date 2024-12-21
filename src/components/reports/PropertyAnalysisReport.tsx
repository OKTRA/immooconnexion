import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PropertyExpense {
  id: number
  property: string
  totalExpenses: number
  maintenanceCount: number
  lastExpenseDate: string
}

const propertyExpenses = [
  {
    id: 1,
    property: "Appartement Jaune Block 1",
    totalExpenses: 250000,
    maintenanceCount: 5,
    lastExpenseDate: "2024-03-15",
  },
  {
    id: 2,
    property: "Maison M201",
    totalExpenses: 180000,
    maintenanceCount: 3,
    lastExpenseDate: "2024-03-10",
  },
]

export function PropertyAnalysisReport() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analyse des Biens</CardTitle>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Bien</th>
                <th className="p-4 text-left">Total Dépenses</th>
                <th className="p-4 text-left">Nombre Maintenances</th>
                <th className="p-4 text-left">Dernière Dépense</th>
              </tr>
            </thead>
            <tbody>
              {propertyExpenses.map((property) => (
                <tr key={property.id} className="border-b">
                  <td className="p-4">{property.property}</td>
                  <td className="p-4">{property.totalExpenses} FCFA</td>
                  <td className="p-4">{property.maintenanceCount}</td>
                  <td className="p-4">{property.lastExpenseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}