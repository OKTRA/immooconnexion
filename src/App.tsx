import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

// Pages
import Login from "@/pages/Login"
import Properties from "@/pages/Properties"
import PropertyDetails from "@/pages/PropertyDetails"
import Tenants from "@/pages/Tenants"
import Reports from "@/pages/Reports"
import ApartmentManagement from "@/pages/ApartmentManagement"
import PropertyUnits from "@/pages/PropertyUnits"
import ApartmentUnits from "@/pages/ApartmentUnits"
import Expenses from "@/pages/Expenses"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/agence/dashboard" replace />} />

              <Route path="/agence">
                <Route path="biens" element={<Properties />} />
                <Route path="biens/:propertyId" element={<PropertyDetails />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="appartements" element={<ApartmentManagement />} />
                <Route path="appartements/:apartmentId/unites" element={<ApartmentUnits />} />
                <Route path="unites" element={<PropertyUnits />} />
                <Route path="depenses" element={<Expenses />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App