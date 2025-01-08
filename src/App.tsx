import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "@/lib/react-query";
import Apartments from "@/pages/Apartments";
import ApartmentDetails from "@/pages/ApartmentDetails";
import UnitDetails from "@/pages/UnitDetails";
import ApartmentTenants from "@/pages/ApartmentTenants";
import TenantContracts from "@/components/apartment/tenant/TenantContracts";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/agence/appartements" element={<Apartments />} />
              <Route path="/agence/appartements/:id" element={<ApartmentDetails />} />
              <Route path="/agence/appartements/unites/:id" element={<UnitDetails />} />
              <Route path="/agence/appartements/locataires" element={<ApartmentTenants />} />
              <Route path="/agence/appartements/locataires/:id/contrats" element={<TenantContracts />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App;
