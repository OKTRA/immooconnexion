import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const earnings = [
  {
    id: 1,
    bien: "Appartement Jaune Block 1",
    loyer: "60000",
    fraisAgence: "30000",
    tauxCommission: "10",
    commissionMensuelle: "6000",
    datePerception: "2024-03-15",
  },
  {
    id: 2,
    bien: "Maison M201",
    loyer: "75000",
    fraisAgence: "35000",
    tauxCommission: "8",
    commissionMensuelle: "6000",
    datePerception: "2024-03-10",
  },
]

export function AgencyEarningsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Frais d'Agence</TableHead>
            <TableHead>Taux Commission (%)</TableHead>
            <TableHead>Commission Mensuelle</TableHead>
            <TableHead>Date Perception</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {earnings.map((earning) => (
            <TableRow key={earning.id}>
              <TableCell>{earning.bien}</TableCell>
              <TableCell>{earning.loyer} FCFA</TableCell>
              <TableCell>{earning.fraisAgence} FCFA</TableCell>
              <TableCell>{earning.tauxCommission}%</TableCell>
              <TableCell>{earning.commissionMensuelle} FCFA</TableCell>
              <TableCell>{earning.datePerception}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}