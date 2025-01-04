import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "@/pages/Properties"
import PropertyUnitsPage from "@/pages/PropertyUnitsPage"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import AdminDashboard from "@/pages/AdminDashboard"
import AgencyDashboard from "@/pages/AgencyDashboard"
import ApartmentManagement from "@/pages/ApartmentManagement"
import Expenses from "@/pages/Expenses"
import Login from "@/pages/Login"
import PropertyDetails from "@/pages/PropertyDetails"
import PropertySales from "@/pages/PropertySales"
import PublicProperties from "@/pages/PublicProperties"
import Reports from "@/pages/Reports"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import AgencyEarnings from "@/pages/AgencyEarnings"
import Pricing from "@/pages/Pricing"
import SuperAdminLogin from "@/pages/SuperAdminLogin"

const queryClient = new QueryClient()

const router = createBrowserRouter([
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
  {
    path: "/agence/admin",
    element: <AgencyDashboard />,
  },
  {
    path: "/agence/biens",
    element: <Properties />,
  },
  {
    path: "/agence/biens/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/agence/biens/:propertyId/unites",
    element: <PropertyUnitsPage />,
  },
  {
    path: "/agence/appartements",
    element: <ApartmentManagement />,
  },
  {
    path: "/agence/locataires",
    element: <Tenants />,
  },
  {
    path: "/agence/locataires/:id/contrats",
    element: <TenantContracts />,
  },
  {
    path: "/agence/depenses",
    element: <Expenses />,
  },
  {
    path: "/agence/gains",
    element: <AgencyEarnings />,
  },
  {
    path: "/agence/ventes",
    element: <PropertySales />,
  },
  {
    path: "/agence/rapports",
    element: <Reports />,
  },
  {
    path: "/agence/abonnement",
    element: <SubscriptionUpgrade />,
  },
  {
    path: "/super-admin/admin",
    element: <AdminDashboard />,
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App