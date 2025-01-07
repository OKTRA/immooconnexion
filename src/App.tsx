import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AuthProvider } from "@/providers/AuthProvider"

// Pages
import Index from "@/pages/Index"
import Login from "@/pages/Login"
import Properties from "@/pages/Properties"
import Tenants from "@/pages/Tenants"
import TenantContracts from "@/pages/TenantContracts"
import PropertyDetails from "@/pages/PropertyDetails"
import Expenses from "@/pages/Expenses"
import Reports from "@/pages/Reports"
import AgencyDashboard from "@/pages/AgencyDashboard"
import PropertySales from "@/pages/PropertySales"
import Pricing from "@/pages/Pricing"
import SubscriptionUpgrade from "@/pages/SubscriptionUpgrade"
import AgencyEarnings from "@/pages/AgencyEarnings"
import PublicProperties from "@/pages/PublicProperties"
import TermsOfService from "@/pages/TermsOfService"
import SuperAdminLogin from "@/pages/SuperAdminLogin"
import AdminDashboard from "@/pages/AdminDashboard"
import Apartments from "@/pages/Apartments"
import ApartmentDetails from "@/pages/ApartmentDetails"
import ApartmentUnits from "@/pages/ApartmentUnits"

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<SuperAdminLogin />} />
              <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
              <Route path="/properties" element={<PublicProperties />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Agency Routes */}
              <Route path="/agence" element={<AgencyDashboard />} />
              <Route path="/agence/biens" element={<Properties />} />
              <Route path="/agence/biens/:id" element={<PropertyDetails />} />
              <Route path="/agence/locataires" element={<Tenants />} />
              <Route path="/agence/contrats" element={<TenantContracts />} />
              <Route path="/agence/depenses" element={<Expenses />} />
              <Route path="/agence/rapports" element={<Reports />} />
              <Route path="/agence/ventes" element={<PropertySales />} />
              <Route path="/agence/revenus" element={<AgencyEarnings />} />
              <Route path="/agence/abonnement" element={<SubscriptionUpgrade />} />
              
              {/* Apartment Routes */}
              <Route path="/agence/appartements" element={<Apartments />} />
              <Route path="/agence/appartements/:id" element={<ApartmentDetails />} />
              <Route path="/agence/appartements/:id/unites" element={<ApartmentUnits />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App