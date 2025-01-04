import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "@/components/agency/AgencySidebar"
import { RecentActivities } from "@/components/RecentActivities"
import { RevenueChart } from "@/components/RevenueChart"

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AgencySidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <div className="grid gap-4 md:grid-cols-2">
              <RevenueChart />
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}