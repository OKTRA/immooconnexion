import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Properties from "./pages/Properties"
import ApartmentDetails from "./pages/ApartmentDetails"
import ApartmentUnitForm from "./pages/ApartmentUnitForm"
import Index from "./pages/Index"
import { ThemeProvider } from "@/providers/ThemeProvider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/agence/appartements/:id",
    element: <ApartmentDetails />,
  },
  {
    path: "/agence/appartements/:id/unites/nouveau",
    element: <ApartmentUnitForm />,
  },
])

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}