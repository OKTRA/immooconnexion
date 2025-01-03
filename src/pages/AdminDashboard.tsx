import { AdminStats } from "@/components/admin/dashboard/AdminStats"
import { AdminNotifications } from "@/components/admin/dashboard/AdminNotifications"

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-8">
      <AdminStats />
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Dernières Notifications
        </h2>
        <AdminNotifications />
      </div>
    </div>
  )
}