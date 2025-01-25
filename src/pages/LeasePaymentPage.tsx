import { useParams } from "react-router-dom"
import { LeasePaymentView } from "@/components/apartment/lease/payment/LeasePaymentView"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function LeasePaymentPage() {
  const { leaseId } = useParams<{ leaseId: string }>()

  if (!leaseId) {
    return <div>ID du bail manquant</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <LeasePaymentView leaseId={leaseId} />
      </div>
    </AgencyLayout>
  )
}