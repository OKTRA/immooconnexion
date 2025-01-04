import { StrictMode, Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Loader2 } from "lucide-react"

// Lazy load all pages
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
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
})

// Wrapper component for protected agency routes
const ProtectedAgencyRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <GlobalHeader />
    {children}
  </ProtectedRoute>
)

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
            path="/agence/admin"
            element={
              <ProtectedAgencyRoute>
                <Index />
              </ProtectedAgencyRoute>
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
              <ProtectedAgencyRoute>
                <Tenants />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/locataires/:id/contrats"
            element={
              <ProtectedAgencyRoute>
                <TenantContracts />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/biens"
            element={
              <ProtectedAgencyRoute>
                <Properties />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/biens/:id"
            element={
              <ProtectedAgencyRoute>
                <PropertyDetails />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/ventes"
            element={
              <ProtectedAgencyRoute>
                <PropertySales />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/depenses"
            element={
              <ProtectedAgencyRoute>
                <Expenses />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/gains"
            element={
              <ProtectedAgencyRoute>
                <AgencyEarnings />
              </ProtectedAgencyRoute>
            }
          />
          <Route
            path="/agence/rapports"
            element={
              <ProtectedAgencyRoute>
                <Reports />
              </ProtectedAgencyRoute>
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