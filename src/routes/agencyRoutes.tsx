import AgencyDashboard from "@/pages/AgencyDashboard"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import PropertyUnitsPage from "@/pages/PropertyUnitsPage"
import ApartmentManagement from "@/pages/ApartmentManagement"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import Expenses from "@/pages/Expenses"
import AgencyEarnings from "@/pages/AgencyEarnings"
import PropertySales from "@/pages/PropertySales"
import Reports from "@/pages/Reports"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"

export const agencyRoutes = [
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
]