import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AgencyFeesTable } from "@/components/earnings/AgencyFeesTable"
import { RentalCommissionsTable } from "@/components/earnings/RentalCommissionsTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AgencyEarnings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block md:w-[15%] min-w-[200px]">
          <AppSidebar />
        </div>
        <main className="w-full md:w-[85%] p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Gains</h1>
          
          <Tabs defaultValue="fees" className="w-full">
            <TabsList>
              <TabsTrigger value="fees">Frais d'agence</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
            </TabsList>
            <TabsContent value="fees">
              <AgencyFeesTable />
            </TabsContent>
            <TabsContent value="commissions">
              <RentalCommissionsTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AgencyEarnings