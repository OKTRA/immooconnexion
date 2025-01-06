import { useNavigate, useParams } from "react-router-dom"
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { toast } from "sonner"
import { ApartmentUnit } from "@/types/apartment"

export default function ApartmentUnitForm() {
  const { id: apartmentId } = useParams()
  const navigate = useNavigate()

  if (!apartmentId) {
    return <div>Apartment ID is required</div>
  }

  const handleSubmit = (data: ApartmentUnit) => {
    try {
      toast.success("Unité ajoutée avec succès")
      navigate(`/agence/appartements/${apartmentId}`)
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'unité")
    }
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
          onSubmit={handleSubmit}
        />
      </div>
    </AgencyLayout>
  )
}