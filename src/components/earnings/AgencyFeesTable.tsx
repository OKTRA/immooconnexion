import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AgencyFee {
  id: string
  bien: string
  montant: number
  datePerception: string
}

interface AgencyFeesTableProps {
  fees: AgencyFee[]
}

export function AgencyFeesTable({ fees }: AgencyFeesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frais d'Agence</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date Perception</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell>{fee.bien}</TableCell>
                <TableCell>{fee.montant.toLocaleString()} FCFA</TableCell>
                <TableCell>{fee.datePerception}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}