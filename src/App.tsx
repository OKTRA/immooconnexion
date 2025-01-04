import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AdminRoute } from "@/components/auth/AdminRoute"
import { AgencyRoute } from "@/components/auth/AgencyRoute"

// Pages
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Properties from "@/pages/Properties"
import AddProperty from "@/pages/AddProperty"
import EditProperty from "@/pages/EditProperty"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import TenantDetails from "@/pages/TenantDetails"
import Contracts from "@/pages/Contracts"
import ContractDetails from "@/pages/ContractDetails"
import Payments from "@/pages/Payments"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminUsers from "@/pages/admin/AdminUsers"
import AdminProperties from "@/pages/admin/AdminProperties"
import AdminSettings from "@/pages/admin/AdminSettings"
import ApartmentManagement from "@/pages/ApartmentManagement"
import PropertyUnits from "@/pages/PropertyUnits"
import ApartmentUnits from "@/pages/ApartmentUnits"
import Expenses from "@/pages/Expenses"
import Subscription from "@/pages/Subscription"
import AdminSubscriptionPlans from "@/pages/admin/AdminSubscriptionPlans"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/agence/dashboard" replace />} />

              <Route path="/agence" element={<AgencyRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="biens" element={<Properties />} />
                <Route path="biens/ajouter" element={<AddProperty />} />
                <Route path="biens/:propertyId" element={<PropertyDetails />} />
                <Route path="biens/:propertyId/modifier" element={<EditProperty />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="locataires/:tenantId" element={<TenantDetails />} />
                <Route path="contrats" element={<Contracts />} />
                <Route path="contrats/:contractId" element={<ContractDetails />} />
                <Route path="paiements" element={<Payments />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="parametres" element={<Settings />} />
                <Route path="appartements" element={<ApartmentManagement />} />
                <Route path="appartements/:apartmentId/unites" element={<ApartmentUnits />} />
                <Route path="unites" element={<PropertyUnits />} />
                <Route path="depenses" element={<Expenses />} />
                <Route path="abonnement" element={<Subscription />} />
              </Route>

              <Route path="/admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="utilisateurs" element={<AdminUsers />} />
                <Route path="biens" element={<AdminProperties />} />
                <Route path="parametres" element={<AdminSettings />} />
                <Route path="abonnements" element={<AdminSubscriptionPlans />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App