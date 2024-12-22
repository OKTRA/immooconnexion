import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ExpenseDialog } from "@/components/ExpenseDialog"
import { ExpenseTable } from "@/components/ExpenseTable"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Expenses = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
      
      if (error) throw error
      return data
    }
  })

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Gestion des Dépenses</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Select 
                  onValueChange={setSelectedPropertyId} 
                  value={selectedPropertyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une propriété" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les biens</SelectItem>
                    {properties?.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.bien}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ExpenseDialog propertyId={selectedPropertyId === "all" ? "" : selectedPropertyId} />
            </div>
          </div>

          <ExpenseTable propertyId={selectedPropertyId === "all" ? undefined : selectedPropertyId} />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Expenses