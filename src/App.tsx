import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Index from "./pages/Index"
import Login from "./pages/Login"
import PublicProperties from "./pages/PublicProperties"
import Pricing from "./pages/Pricing"
import Tenants from "./pages/Tenants"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import Expenses from "./pages/Expenses"
import AgencyEarnings from "./pages/AgencyEarnings"
import Reports from "./pages/Reports"
import TenantContracts from "./pages/TenantContracts"
import AdminDashboard from "./pages/AdminDashboard"
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

const AppRoutes = () => {
  useEffect(() => {
    const clearSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signOut()
        localStorage.clear()
      }
    }
    clearSession()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipPrimitive.Provider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipPrimitive.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App