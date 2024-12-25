import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileMenu } from "@/components/property-details/MobileMenu"
import { PropertyDetailsContent } from "@/components/property-details/PropertyDetailsContent"

const PropertyDetails = () => {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {!isMobile && <AppSidebar className="w-64 flex-shrink-0" />}
        <main className="flex-1 overflow-y-auto">
          {isMobile && <MobileMenu />}
          <PropertyDetailsContent />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertyDetails