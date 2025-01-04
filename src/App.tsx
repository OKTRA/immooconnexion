import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PublicPropertyDetails } from "@/components/property/PublicPropertyDetails"

// Pages
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Properties from "@/pages/Properties"
import Tenants from "@/pages/Tenants"
import Contracts from "@/pages/Contracts"
import Settings from "@/pages/Settings"
import PublicProperties from "@/pages/PublicProperties"
import PropertyDetails from "@/pages/PropertyDetails"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PublicProperties />} />
              <Route path="/properties/:id" element={<PublicPropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/agence" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="biens" element={<Properties />} />
                <Route path="biens/:id" element={<PropertyDetails />} />
                <Route path="locataires" element={<Tenants />} />
                <Route path="contrats" element={<Contracts />} />
                <Route path="parametres" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
