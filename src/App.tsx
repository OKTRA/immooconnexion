import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/AuthProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Login from "@/pages/Login"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import Expenses from "@/pages/Expenses"
import Reports from "@/pages/Reports"
import AgencyDashboard from "@/pages/AgencyDashboard"
import AgencyEarnings from "@/pages/AgencyEarnings"
import PropertySales from "@/pages/PropertySales"
import AdminDashboard from "@/pages/AdminDashboard"
import SuperAdminLogin from "@/pages/SuperAdminLogin"
import Pricing from "@/pages/Pricing"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import PublicProperties from "@/pages/PublicProperties"
import TermsOfService from "@/pages/TermsOfService"
import Apartments from "@/pages/Apartments"
import ApartmentDetails from "@/pages/ApartmentDetails"
import ApartmentUnits from "@/pages/ApartmentUnits"
import UnitDetails from "@/pages/UnitDetails"
import ApartmentTenants from "@/pages/ApartmentTenants"
import ApartmentTenantPayments from "@/pages/ApartmentTenantPayments"
import ApartmentTenantLeases from "@/pages/ApartmentTenantLeases"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin/admin" element={<AdminDashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/tenant-contracts" element={<TenantContracts />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/agency/dashboard" element={<AgencyDashboard />} />
              <Route path="/agency/earnings" element={<AgencyEarnings />} />
              <Route path="/property-sales" element={<PropertySales />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/subscription/upgrade" element={<SubscriptionUpgrade />} />
              <Route path="/public/properties" element={<PublicProperties />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Routes pour la gestion des appartements */}
              <Route path="/agence/apartments" element={<Apartments />} />
              <Route path="/agence/apartments/:id" element={<ApartmentDetails />} />
              <Route path="/agence/apartments/:id/units" element={<ApartmentUnits />} />
              <Route path="/agence/apartments/units/:id" element={<UnitDetails />} />
              <Route path="/agence/apartment-tenants" element={<ApartmentTenants />} />
              <Route path="/agence/apartment-tenants/:id/payments" element={<ApartmentTenantPayments />} />
              <Route path="/agence/apartment-tenants/:id/leases" element={<ApartmentTenantLeases />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}