import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
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

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First clear any potentially invalid session from localStorage
        const storageKey = `sb-${supabase.getClientConfig().supabaseUrl?.split('//')[1]}-auth-token`
        const currentSession = localStorage.getItem(storageKey)
        if (currentSession) {
          const session = JSON.parse(currentSession)
          if (!session?.access_token) {
            localStorage.removeItem(storageKey)
            setIsAuthenticated(false)
            return
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          localStorage.removeItem(storageKey)
          setIsAuthenticated(false)
          if (sessionError?.message.includes('User from sub claim in JWT does not exist')) {
            toast({
              title: "Session expirée",
              description: "Votre session n'est plus valide. Veuillez vous reconnecter.",
              variant: "destructive"
            })
          }
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        const storageKey = `sb-${supabase.getClientConfig().supabaseUrl?.split('//')[1]}-auth-token`
        localStorage.removeItem(storageKey)
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const storageKey = `sb-${supabase.getClientConfig().supabaseUrl?.split('//')[1]}-auth-token`
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(storageKey)
        setIsAuthenticated(false)
        return
      }
      
      try {
        if (!session) {
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth state change error:', error)
        localStorage.removeItem(storageKey)
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App