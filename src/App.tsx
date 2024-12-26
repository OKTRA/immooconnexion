import { StrictMode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import Index from "./pages/Index"
import Login from "./pages/Login"
import SuperAdminLogin from "./pages/SuperAdminLogin"
import PublicProperties from "./pages/PublicProperties"
import Pricing from "./pages/Pricing"
import Tenants from "./pages/Tenants"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import PropertySales from "./pages/PropertySales"
import Expenses from "./pages/Expenses"
import AgencyEarnings from "./pages/AgencyEarnings"
import Reports from "./pages/Reports"
import TenantContracts from "./pages/TenantContracts"
import AdminDashboard from "./pages/AdminDashboard"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function AppRoutes() {
  return (
    <>
      <GlobalHeader />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicProperties />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        {/* Protected agency routes */}
        <Route
          path="/agence/admin"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
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
          path="/agence/locataires/:id/contrats"
          element={
            <ProtectedRoute>
              <TenantContracts />
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
          path="/agence/biens/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agence/ventes"
          element={
            <ProtectedRoute>
              <PropertySales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agence/depenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agence/gains"
          element={
            <ProtectedRoute>
              <AgencyEarnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agence/rapports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}

export default App