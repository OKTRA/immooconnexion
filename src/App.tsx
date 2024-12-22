import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Tenants from "./pages/Tenants"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import Expenses from "./pages/Expenses"
import AgencyEarnings from "./pages/AgencyEarnings"
import Reports from "./pages/Reports"
import TenantContracts from "./pages/TenantContracts"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App