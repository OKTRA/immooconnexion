import { DashboardTabs } from "@/components/admin/layout/DashboardTabs"
import { AdminBottomNav } from "@/components/admin/layout/AdminBottomNav"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-dashboard-gradient-from to-dashboard-gradient-to pb-20">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8">
          Tableau de bord Super Admin
        </h1>
        <DashboardTabs />
      </div>
      <AdminBottomNav />
    </div>
  )
}

export default AdminDashboard