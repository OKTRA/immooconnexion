import { StrictMode, Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import { Loader2 } from "lucide-react"

// Optimisation du lazy loading avec prefetch
const Index = lazy(() => import("./pages/Index"), { suspense: true })
const Login = lazy(() => import("./pages/Login"), { suspense: true })
const SuperAdminLogin = lazy(() => import("./pages/SuperAdminLogin"), { suspense: true })
const PublicProperties = lazy(() => import("./pages/PublicProperties"), { suspense: true })
const Pricing = lazy(() => import("./pages/Pricing"), { suspense: true })
const Tenants = lazy(() => import("./pages/Tenants"), { suspense: true })
const Properties = lazy(() => import("./pages/Properties"), { suspense: true })
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"), { suspense: true })
const PropertySales = lazy(() => import("./pages/PropertySales"), { suspense: true })
const Expenses = lazy(() => import("./pages/Expenses"), { suspense: true })
const AgencyEarnings = lazy(() => import("./pages/AgencyEarnings"), { suspense: true })
const Reports = lazy(() => import("./pages/Reports"), { suspense: true })
const TenantContracts = lazy(() => import("./pages/TenantContracts"), { suspense: true })
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"), { suspense: true })
const TermsOfService = lazy(() => import("./pages/TermsOfService"), { suspense: true })

// Amélioration du loader avec un délai minimal pour éviter le flash
const PageLoader = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

// Configuration optimisée du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      suspense: true,
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