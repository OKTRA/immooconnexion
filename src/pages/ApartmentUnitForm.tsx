import { useNavigate, useParams } from "react-router-dom"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function ApartmentUnitForm() {
  const { id: apartmentId } = useParams()
  const navigate = useNavigate()

  if (!apartmentId) {
    return <div>Apartment ID is required</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <ApartmentUnitDialog
          apartmentId={apartmentId}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              navigate(`/agence/appartements/${apartmentId}`)
            }
          }}
        />
      </div>
    </AgencyLayout>
  )
}