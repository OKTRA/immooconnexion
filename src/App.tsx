import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "@/pages/Properties"
import PropertyUnitsPage from "@/pages/PropertyUnitsPage"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Dashboard from "@/pages/Dashboard"
import Profile from "@/pages/Profile"
import ApartmentManagement from "@/pages/ApartmentManagement"
import PropertyDetails from "@/pages/PropertyDetails"
import AddProperty from "@/pages/AddProperty"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/inscription",
    element: <Register />,
  },
  {
    path: "/mot-de-passe-oublie",
    element: <ForgotPassword />,
  },
  {
    path: "/reinitialiser-mot-de-passe",
    element: <ResetPassword />,
  },
  {
    path: "/agence",
    element: <Dashboard />,
  },
  {
    path: "/agence/profil",
    element: <Profile />,
  },
  {
    path: "/agence/biens",
    element: <Properties />,
  },
  {
    path: "/agence/biens/ajouter",
    element: <AddProperty />,
  },
  {
    path: "/agence/biens/:propertyId",
    element: <PropertyDetails />,
  },
  {
    path: "/agence/biens/:propertyId/unites",
    element: <PropertyUnitsPage />,
  },
  {
    path: "/agence/appartements",
    element: <ApartmentManagement />,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App