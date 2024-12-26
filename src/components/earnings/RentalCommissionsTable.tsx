import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RentalCommission {
  id: string
  bien: string
  loyer: number
  tauxCommission: number
  commissionMensuelle: number
  gainProprietaire: number
  datePerception: string
}

interface RentalCommissionsTableProps {
  rentals: RentalCommission[]
}

export function RentalCommissionsTable({ rentals }: RentalCommissionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commissions sur Loyers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead>Loyer</TableHead>
              <TableHead>Taux Commission (%)</TableHead>
              <TableHead>Commission Mensuelle</TableHead>
              <TableHead>Gain Propriétaire</TableHead>
              <TableHead>Date Perception</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.bien}</TableCell>
                <TableCell>{rental.loyer.toLocaleString()} FCFA</TableCell>
                <TableCell>{rental.tauxCommission}%</TableCell>
                <TableCell>{rental.commissionMensuelle.toLocaleString()} FCFA</TableCell>
                <TableCell>{rental.gainProprietaire.toLocaleString()} FCFA</TableCell>
                <TableCell>{rental.datePerception}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}