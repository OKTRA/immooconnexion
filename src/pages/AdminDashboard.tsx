import { DashboardTabs } from "@/components/admin/layout/DashboardTabs"
import { SuperAdminHeader } from "@/components/admin/layout/SuperAdminHeader"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-dashboard-gradient-from to-dashboard-gradient-to">
      <SuperAdminHeader />
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8">
          Tableau de bord Super Admin
        </h1>
        <DashboardTabs />
      </div>
    </div>
  )
}

export default AdminDashboard