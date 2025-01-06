import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "./pages/Properties"
import Apartments from "./pages/Apartments"
import ApartmentDetails from "./pages/ApartmentDetails"
import ApartmentUnitForm from "./pages/ApartmentUnitForm"
import Index from "./pages/Index"
import PropertySales from "./pages/PropertySales"
import Expenses from "./pages/Expenses"
import AgencyEarnings from "./pages/AgencyEarnings"
import Reports from "./pages/Reports"
import Tenants from "./pages/Tenants"
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
  },
  {
    path: "/agence/depenses",
    element: <Expenses />,
  },
  {
    path: "/agence/gains",
    element: <AgencyEarnings />,
  },
  {
    path: "/agence/rapports",
    element: <Reports />,
  },
  {
    path: "/agence/locataires",
    element: <Tenants />,
  }
])

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}