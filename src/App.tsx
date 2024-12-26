import { StrictMode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { PublicHeader } from "@/components/layout/PublicHeader"
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
  const location = useLocation()
  const isPublicRoute = ['/login', '/super-admin/login', '/public', '/pricing'].includes(location.pathname)

  return (
    <>
      {isPublicRoute ? <PublicHeader /> : <GlobalHeader />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/public" element={<PublicProperties />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locataires"
          element={
            <ProtectedRoute>
              <Tenants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locataires/:id/contrats"
          element={
            <ProtectedRoute>
              <TenantContracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biens"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biens/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventes"
          element={
            <ProtectedRoute>
              <PropertySales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/depenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gains"
          element={
            <ProtectedRoute>
              <AgencyEarnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rapports"
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