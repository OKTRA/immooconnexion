import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/AuthProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import AgencyDashboard from "@/pages/AgencyDashboard"
import AgencySettings from "@/pages/AgencySettings"
import Expenses from "@/pages/Expenses"
import AgencyEarnings from "@/pages/AgencyEarnings"
import Reports from "@/pages/Reports"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import PropertySales from "@/pages/PropertySales"
import PublicProperties from "@/pages/PublicProperties"
import Apartments from "@/pages/Apartments"
import ApartmentDetails from "@/pages/ApartmentDetails"
import ApartmentUnits from "@/pages/ApartmentUnits"
import SuperAdminLogin from "@/pages/SuperAdminLogin"
import AdminDashboard from "@/pages/AdminDashboard"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin/admin" element={<AdminDashboard />} />
              <Route path="/properties" element={<PublicProperties />} />
              <Route path="/agence" element={<ProtectedRoute />}>
                <Route path="admin" element={<AgencyDashboard />} />
                <Route path="biens" element={<Properties />} />
                <Route path="biens/:id" element={<PropertyDetails />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="locataires/:id/contrats" element={<TenantContracts />} />
                <Route path="depenses" element={<Expenses />} />
                <Route path="gains" element={<AgencyEarnings />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="parametres" element={<AgencySettings />} />
                <Route path="abonnement" element={<SubscriptionUpgrade />} />
                <Route path="ventes" element={<PropertySales />} />
                <Route path="appartements" element={<Apartments />} />
                <Route path="appartements/:id" element={<ApartmentDetails />} />
                <Route path="appartements/:id/unites" element={<ApartmentUnits />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App