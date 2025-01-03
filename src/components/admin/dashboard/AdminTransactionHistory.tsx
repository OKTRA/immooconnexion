import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function AdminTransactionHistory() {
  const { data: transactions = [] } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_payment_notifications")
        .select(`
          *,
          agencies (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaction</TableHead>
              <TableHead>Agence</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.payment_id}
                </TableCell>
                <TableCell>{transaction.agencies?.name || "N/A"}</TableCell>
                <TableCell>
                  {transaction.amount.toLocaleString()} FCFA
                </TableCell>
                <TableCell>{transaction.payment_method}</TableCell>
                <TableCell>
                  <Badge variant={transaction.status === "success" ? "success" : "secondary"}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.created_at), "Pp", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucune transaction trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}