import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PublicPropertyDetails } from "@/components/property/PublicPropertyDetails"

// Pages
import Login from "@/pages/Login"
import PublicProperties from "@/pages/PublicProperties"
import Properties from "@/pages/Properties"
import Tenants from "@/pages/Tenants"
import PropertyDetails from "@/pages/PropertyDetails"
import Expenses from "@/pages/Expenses"
import Reports from "@/pages/Reports"
import PropertySales from "@/pages/PropertySales"
import AgencyEarnings from "@/pages/AgencyEarnings"
import TenantContracts from "@/pages/TenantContracts"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import AdminDashboard from "@/pages/AdminDashboard"
import SuperAdminLogin from "@/pages/SuperAdminLogin"
import AgencyDashboard from "@/pages/AgencyDashboard"
import Pricing from "@/pages/Pricing"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicProperties />} />
              <Route path="/properties/:id" element={<PublicPropertyDetails />} />
              <Route path="/agence/login" element={<Login />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Protected agency routes */}
              <Route path="/agence" element={<ProtectedRoute />}>
                <Route path="admin" element={<AgencyDashboard />} />
                <Route path="biens" element={<Properties />} />
                <Route path="biens/:id" element={<PropertyDetails />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="depenses" element={<Expenses />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="ventes" element={<PropertySales />} />
                <Route path="revenus" element={<AgencyEarnings />} />
                <Route path="contrats" element={<TenantContracts />} />
                <Route path="abonnement" element={<SubscriptionUpgrade />} />
              </Route>

              {/* Super Admin routes */}
              <Route path="/super-admin" element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="agencies" element={<AdminDashboard />} />
                <Route path="agents" element={<AdminDashboard />} />
                <Route path="subscriptions" element={<AdminDashboard />} />
                <Route path="transactions" element={<AdminDashboard />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App