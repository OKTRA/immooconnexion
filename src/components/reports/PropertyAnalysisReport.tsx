import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function PropertyAnalysisReport() {
  const { data: propertyExpenses } = useQuery({
    queryKey: ['property-expenses'],
    queryFn: async () => {
      const { data: expenses } = await supabase
        .from('expenses')
        .select(`
          id,
          montant,
          date,
          properties (
            bien
          )
        `)
        .order('date', { ascending: false })

      // Group expenses by property
      const groupedExpenses = expenses?.reduce((acc, expense) => {
        const propertyName = expense.properties?.bien || 'Unknown'
        if (!acc[propertyName]) {
          acc[propertyName] = {
            property: propertyName,
            totalExpenses: 0,
            maintenanceCount: 0,
            lastExpenseDate: null
          }
        }
        acc[propertyName].totalExpenses += expense.montant
        acc[propertyName].maintenanceCount++
        if (!acc[propertyName].lastExpenseDate || new Date(expense.date) > new Date(acc[propertyName].lastExpenseDate)) {
          acc[propertyName].lastExpenseDate = expense.date
        }
        return acc
      }, {} as Record<string, any>) || {}

      return Object.values(groupedExpenses)
    }
  })

  const handlePrint = () => {
    const style = document.createElement('style')
    style.textContent = `
      @page {
        size: portrait;
        margin: 2cm;
      }
      @media print {
        body {
          padding: 0;
          margin: 0;
        }
        .print-content {
          width: 100%;
          margin: 0;
          padding: 20px;
        }
      }
    `
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
  }

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <CardTitle>Analyse des Biens</CardTitle>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border print:border-none print-content">
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
              {propertyExpenses?.map((property, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{property.property}</td>
                  <td className="p-4">{property.totalExpenses.toLocaleString()} FCFA</td>
                  <td className="p-4">{property.maintenanceCount}</td>
                  <td className="p-4">{new Date(property.lastExpenseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}