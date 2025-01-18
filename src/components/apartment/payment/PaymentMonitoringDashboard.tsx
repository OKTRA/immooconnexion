import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Payment } from "@/types/payment"
import { Loader2 } from "lucide-react"

export function PaymentMonitoringDashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")

    if (error) throw error
    return data
  }

  const { data, isLoading, error } = useQuery("payments", fetchPayments)

  useEffect(() => {
    if (data) {
      setPayments(data)
      setLoading(false)
    }
  }, [data])

  if (loading || isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div>Error loading payments: {error.message}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Payment Monitoring</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.amount}</td>
              <td>{payment.status}</td>
              <td>{new Date(payment.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => fetchPayments()}>Refresh Payments</Button>
    </div>
  )
}
