import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/AuthProvider";
import { BrowserRouter } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Tenants from "./pages/Tenants";
import TenantContracts from "./pages/TenantContracts";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import AgencyDashboard from "./pages/AgencyDashboard";
import AgencyEarnings from "./pages/AgencyEarnings";
import Pricing from "./pages/Pricing";
import SubscriptionUpgrade from "./pages/SubscriptionUpgrade";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import PublicProperties from "./pages/PublicProperties";
import PropertySales from "./pages/PropertySales";
import Apartments from "./pages/Apartments";
import ApartmentDetails from "./pages/ApartmentDetails";
import ApartmentUnits from "./pages/ApartmentUnits";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<SuperAdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/agence">
                <Route path="tableau-de-bord" element={<AgencyDashboard />} />
                <Route path="biens" element={<Properties />} />
                <Route path="biens/:id" element={<PropertyDetails />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="locataires/:id/contrats" element={<TenantContracts />} />
                <Route path="depenses" element={<Expenses />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="revenus" element={<AgencyEarnings />} />
                <Route path="ventes" element={<PropertySales />} />
                <Route path="appartements" element={<Apartments />} />
                <Route path="appartements/:id" element={<ApartmentDetails />} />
                <Route path="appartements/:id/unites" element={<ApartmentUnits />} />
              </Route>
              <Route path="/abonnement">
                <Route path="tarifs" element={<Pricing />} />
                <Route path="upgrade" element={<SubscriptionUpgrade />} />
              </Route>
              <Route path="/biens" element={<PublicProperties />} />
              <Route path="/conditions-utilisation" element={<TermsOfService />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;