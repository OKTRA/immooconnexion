import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import Tenants from "./pages/Tenants"
import TenantContracts from "./pages/TenantContracts"
import Login from "./pages/Login"
import AgencyDashboard from "./pages/AgencyDashboard"
import Expenses from "./pages/Expenses"
import AgencyEarnings from "./pages/AgencyEarnings"
import Reports from "./pages/Reports"
import PropertySales from "./pages/PropertySales"
import AdminDashboard from "./pages/AdminDashboard"
import SuperAdminLogin from "./pages/SuperAdminLogin"
import PublicProperties from "./pages/PublicProperties"
import Pricing from "./pages/Pricing"
import SubscriptionUpgrade from "./pages/SubscriptionUpgrade"
import TermsOfService from "./pages/TermsOfService"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicProperties />} />
        <Route path="/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Protected Routes */}
        <Route path="/agence" element={<ProtectedRoute />}>
          <Route path="admin" element={<AgencyDashboard />} />
          <Route path="biens" element={<Properties />} />
          <Route path="biens/:propertyId" element={<PropertyDetails />} />
          <Route path="locataires" element={<Tenants />} />
          <Route path="contrats" element={<TenantContracts />} />
          <Route path="depenses" element={<Expenses />} />
          <Route path="revenus" element={<AgencyEarnings />} />
          <Route path="rapports" element={<Reports />} />
          <Route path="ventes" element={<PropertySales />} />
          <Route path="abonnement" element={<SubscriptionUpgrade />} />
          <Route path="abonnement/upgrade" element={<SubscriptionUpgrade />} />
          <Route path="gains" element={<AgencyEarnings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/super-admin/admin" element={<ProtectedRoute adminOnly />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App