import PublicProperties from "@/pages/PublicProperties"
import Pricing from "@/pages/Pricing"
import TermsOfService from "@/pages/TermsOfService"
import Login from "@/pages/Login"
import SuperAdminLogin from "@/pages/SuperAdminLogin"

export const publicRoutes = [
  {
    path: "/",
    element: <PublicProperties />,
  },
  {
    path: "/public",
    element: <PublicProperties />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/agence/login",
    element: <Login />,
  },
  {
    path: "/super-admin/login",
    element: <SuperAdminLogin />,
  },
]