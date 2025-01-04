import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "@/pages/Properties"
import PropertyUnitsPage from "@/pages/PropertyUnitsPage"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/agence/biens",
    element: <Properties />,
  },
  {
    path: "/agence/biens/:propertyId/unites",
    element: <PropertyUnitsPage />,
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