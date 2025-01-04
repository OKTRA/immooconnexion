import { useIsMobile } from "@/hooks/use-mobile"
import { MobileMenu } from "@/components/property-details/MobileMenu"
import { PropertyDetailsContent } from "@/components/property-details/PropertyDetailsContent"

const PropertyDetails = () => {
  const isMobile = useIsMobile()

  return (
    <div>
      {isMobile && <MobileMenu />}
      <PropertyDetailsContent />
    </div>
  )
}

export default PropertyDetails