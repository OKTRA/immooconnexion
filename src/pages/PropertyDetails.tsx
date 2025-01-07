import { useIsMobile } from "@/hooks/use-mobile"
import { MobileMenu } from "@/components/property-details/MobileMenu"
import { PropertyDetailsContent } from "@/components/property-details/PropertyDetailsContent"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const PropertyDetails = () => {
  const isMobile = useIsMobile()

  return (
    <AgencyLayout>
      <div className="container mx-auto">
        {isMobile && <MobileMenu />}
        <PropertyDetailsContent />
      </div>
    </AgencyLayout>
  )
}

export default PropertyDetails