import { SubscriptionUpgradeTab } from "@/components/agency/subscription/SubscriptionUpgradeTab"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "@/components/agency/AgencySidebar"

export default function SubscriptionUpgrade() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AgencySidebar />
        <main className="flex-1 ml-[250px] p-4 md:p-8">
          <div className="space-y-8">
            <h1 className="text-2xl font-bold">Gestion de l'abonnement</h1>
            <SubscriptionUpgradeTab />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}