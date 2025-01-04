import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Loader2 } from "lucide-react"
import { useApartmentProperties } from "@/hooks/useApartmentProperties"
import { ApartmentContent } from "@/components/apartment/ApartmentContent"

export default function ApartmentManagement() {
  const { data: apartments, isLoading, error } = useApartmentProperties()

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (error) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen text-red-500">
          Une erreur est survenue lors du chargement des appartements
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <ApartmentContent apartments={apartments || []} />
    </AgencyLayout>
  )
}