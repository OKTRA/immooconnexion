import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Tenants from "./pages/Tenants"
import Properties from "./pages/Properties"
import PropertyDetails from "./pages/PropertyDetails"
import Expenses from "./pages/Expenses"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/locataires" element={<Tenants />} />
          <Route path="/biens" element={<Properties />} />
          <Route path="/biens/:id" element={<PropertyDetails />} />
          <Route path="/depenses" element={<Expenses />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App