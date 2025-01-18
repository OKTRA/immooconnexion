import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Payment } from "@/types/payment"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

export function PaymentsList() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Montant</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>{payment.amount}</td>
            <td>{new Date(payment.created_at).toLocaleDateString()}</td>
            <td>
              <Button variant="outline" onClick={() => console.log("Edit payment", payment.id)}>
                Modifier
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
