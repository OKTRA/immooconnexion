import { useNavigate, useParams } from "react-router-dom"
import { PropertyUnitDialog } from "@/components/admin/property/PropertyUnitDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

export default function PropertyUnitForm() {
  const { id: propertyId } = useParams()
  const navigate = useNavigate()

  if (!propertyId) {
    return <div>Property ID is required</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <PropertyUnitDialog
          propertyId={propertyId}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              navigate(`/agence/appartements/${propertyId}`)
            }
          }}
        />
      </div>
    </AgencyLayout>
  )
}