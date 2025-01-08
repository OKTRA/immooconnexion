import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Dashboard from "@/pages/Dashboard"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import TenantDetails from "@/pages/TenantDetails"
import TenantReceipt from "@/pages/TenantReceipt"
import TenantPayments from "@/pages/TenantPayments"
import TenantContracts from "@/pages/TenantContracts"
import Profile from "@/pages/Profile"
import Agency from "@/pages/Agency"
import Apartments from "@/pages/Apartments"
import ApartmentDetails from "@/pages/ApartmentDetails"
import ApartmentTenants from "@/pages/ApartmentTenants"
import ApartmentTenantManagement from "@/pages/ApartmentTenantManagement"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/properties"
                element={
                  <ProtectedRoute>
                    <Properties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/properties/:id"
                element={
                  <ProtectedRoute>
                    <PropertyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/tenants"
                element={
                  <ProtectedRoute>
                    <Tenants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/tenants/:id"
                element={
                  <ProtectedRoute>
                    <TenantDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/tenants/:id/recu"
                element={
                  <ProtectedRoute>
                    <TenantReceipt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/tenants/:id/paiements"
                element={
                  <ProtectedRoute>
                    <TenantPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/tenants/:id/contrats"
                element={
                  <ProtectedRoute>
                    <TenantContracts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/settings"
                element={
                  <ProtectedRoute>
                    <Agency />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/apartments"
                element={
                  <ProtectedRoute>
                    <Apartments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/apartments/:id"
                element={
                  <ProtectedRoute>
                    <ApartmentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/apartment-tenants"
                element={
                  <ProtectedRoute>
                    <ApartmentTenants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/apartments/:id/tenants"
                element={
                  <ProtectedRoute>
                    <ApartmentTenantManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App