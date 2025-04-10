import { AdminLoginForm } from "@/components/admin/AdminLoginForm"
import { PublicNavbar } from "@/components/home/PublicNavbar"

const SuperAdminLogin = () => {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen w-full">
        <AdminLoginForm />
      </div>
    </>
  )
}

export default SuperAdminLogin