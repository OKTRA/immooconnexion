import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "@/providers/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { publicRoutes } from "@/routes/publicRoutes"
import { agencyRoutes } from "@/routes/agencyRoutes"
import { adminRoutes } from "@/routes/adminRoutes"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  ...publicRoutes,
  ...agencyRoutes,
  ...adminRoutes,
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