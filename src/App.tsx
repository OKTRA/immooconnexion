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

import "./App.css"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin/admin" element={<AdminDashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/properties" element={<PublicProperties />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              <Route path="/agence" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<AgencyDashboard />} />
                <Route path="properties" element={<Properties />} />
                <Route path="properties/:id" element={<PropertyDetails />} />
                <Route path="tenants" element={<Tenants />} />
                <Route path="contracts" element={<TenantContracts />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="reports" element={<Reports />} />
                <Route path="sales" element={<PropertySales />} />
                <Route path="earnings" element={<AgencyEarnings />} />
                <Route path="subscription" element={<SubscriptionUpgrade />} />
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