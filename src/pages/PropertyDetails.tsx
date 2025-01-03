import { SidebarProvider } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileMenu } from "@/components/property-details/MobileMenu"
import { PropertyDetailsContent } from "@/components/property-details/PropertyDetailsContent"

const PropertyDetails = () => {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 w-full">
          <div className="container mx-auto">
            {isMobile && <MobileMenu />}
            <PropertyDetailsContent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertyDetails