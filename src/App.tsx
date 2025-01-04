import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AuthProvider } from "@/providers/AuthProvider"

// Pages
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import Expenses from "@/pages/Expenses"
import Reports from "@/pages/Reports"
import AgencyDashboard from "@/pages/AgencyDashboard"
import PropertySales from "@/pages/PropertySales"
import AgencyEarnings from "@/pages/AgencyEarnings"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import Pricing from "@/pages/Pricing"
import PublicProperties from "@/pages/PublicProperties"
import SuperAdminLogin from "@/pages/SuperAdminLogin"
import AdminDashboard from "@/pages/AdminDashboard"
import PropertyUnits from "@/pages/PropertyUnits"

// Components
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Outlet } from "react-router-dom"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/biens" element={<PublicProperties />} />
            <Route path="/agence/login" element={<Login />} />
            <Route path="/admin/login" element={<SuperAdminLogin />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected Agency Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AgencyLayout><Outlet /></AgencyLayout>}>
                <Route path="/agence/admin" element={<AgencyDashboard />} />
                <Route path="/agence/biens" element={<Properties />} />
                <Route path="/agence/biens/:propertyId" element={<PropertyDetails />} />
                <Route path="/agence/appartements" element={<PropertyUnits />} />
                <Route path="/agence/locataires" element={<Tenants />} />
                <Route path="/agence/contrats" element={<TenantContracts />} />
                <Route path="/agence/depenses" element={<Expenses />} />
                <Route path="/agence/rapports" element={<Reports />} />
                <Route path="/agence/ventes" element={<PropertySales />} />
                <Route path="/agence/gains" element={<AgencyEarnings />} />
                <Route path="/agence/abonnement" element={<SubscriptionUpgrade />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App