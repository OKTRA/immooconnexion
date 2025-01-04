import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PublicPropertyDetails } from "@/components/property/PublicPropertyDetails"

// Pages
import Login from "@/pages/Login"
import PublicProperties from "@/pages/PublicProperties"
import Properties from "@/pages/Properties"
import Tenants from "@/pages/Tenants"
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
              
              <Route path="/agence" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="biens" element={<Properties />} />
                    <Route path="biens/:id" element={<PropertyDetails />} />
                    <Route path="locataires" element={<Tenants />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App