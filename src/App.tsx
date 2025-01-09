import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Properties from "@/pages/Properties"
import Tenants from "@/pages/Tenants"
import Apartments from "@/pages/Apartments"
import ApartmentDetails from "@/pages/ApartmentDetails"
import ApartmentTenants from "@/pages/ApartmentTenants"
import UnitTenantDetails from "@/pages/UnitTenantDetails"
import UnitTenantPayments from "@/pages/UnitTenantPayments"
import UnitTenantDocuments from "@/pages/UnitTenantDocuments"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/biens"
                element={
                  <ProtectedRoute>
                    <Properties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/locataires"
                element={
                  <ProtectedRoute>
                    <Tenants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/appartements"
                element={
                  <ProtectedRoute>
                    <Apartments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/appartements/:id"
                element={
                  <ProtectedRoute>
                    <ApartmentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/appartements/locataires"
                element={
                  <ProtectedRoute>
                    <ApartmentTenants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/unite/:unitId/tenant/:tenantId"
                element={
                  <ProtectedRoute>
                    <UnitTenantDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/unite/:unitId/tenant/:tenantId/payments"
                element={
                  <ProtectedRoute>
                    <UnitTenantPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agence/unite/:unitId/tenant/:tenantId/documents"
                element={
                  <ProtectedRoute>
                    <UnitTenantDocuments />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App