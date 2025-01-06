import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import PropertyUnitForm from "./pages/PropertyUnitForm"
import Index from "./pages/Index"
import { ThemeProvider } from "@/components/ui/theme"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/agence/appartements/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/agence/appartements/:id/unites/nouveau",
    element: <PropertyUnitForm />,
  },
])

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
