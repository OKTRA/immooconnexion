import { StrictMode, Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Loader2 } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const Index = lazy(() => import("./pages/Index"))
const Login = lazy(() => import("./pages/Login"))
const SuperAdminLogin = lazy(() => import("./pages/SuperAdminLogin"))
const PublicProperties = lazy(() => import("./pages/PublicProperties"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Tenants = lazy(() => import("./pages/Tenants"))
const Properties = lazy(() => import("./pages/Properties"))
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"))
const PropertySales = lazy(() => import("./pages/PropertySales"))
const Expenses = lazy(() => import("./pages/Expenses"))
const AgencyEarnings = lazy(() => import("./pages/AgencyEarnings"))
const Reports = lazy(() => import("./pages/Reports"))
const TenantContracts = lazy(() => import("./pages/TenantContracts"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const TermsOfService = lazy(() => import("./pages/TermsOfService"))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    },
  },
})

function AppRoutes() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/index" replace />} />
          
          {/* Public routes */}
          <Route path="/index" element={<PublicProperties />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/agence/login" element={<Login />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />

          {/* Protected agency routes */}
          <Route
            path="/agence/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <GlobalHeader />
                  <AgencyLayout>
                    <Routes>
                      <Route path="admin" element={<Index />} />
                      <Route path="locataires" element={<Tenants />} />
                      <Route path="locataires/:id/contrats" element={<TenantContracts />} />
                      <Route path="biens" element={<Properties />} />
                      <Route path="biens/:id" element={<PropertyDetails />} />
                      <Route path="ventes" element={<PropertySales />} />
                      <Route path="depenses" element={<Expenses />} />
                      <Route path="gains" element={<AgencyEarnings />} />
                      <Route path="rapports" element={<Reports />} />
                    </Routes>
                  </AgencyLayout>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Protected super admin routes */}
          <Route
            path="/super-admin/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to index */}
          <Route path="*" element={<Navigate to="/index" replace />} />
        </Routes>
      </Suspense>
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
