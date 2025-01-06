import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "./pages/Properties"
import Apartments from "./pages/Apartments"
import ApartmentDetails from "./pages/ApartmentDetails"
import ApartmentUnitForm from "./pages/ApartmentUnitForm"
import Index from "./pages/Index"
import PropertySales from "./pages/PropertySales"
import { ThemeProvider } from "@/providers/ThemeProvider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/agence/biens",
    element: <Properties />,
  },
  {
    path: "/agence/appartements",
    element: <Apartments />,
  },
  {
    path: "/agence/appartements/:id",
    element: <ApartmentDetails />,
  },
  {
    path: "/agence/appartements/:id/unites/nouveau",
    element: <ApartmentUnitForm />,
  },
  {
    path: "/agence/ventes",
    element: <PropertySales />,
  }
])

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}