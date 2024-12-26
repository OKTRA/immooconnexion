import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "../dashboard/AdminStats"
import { AdminAgencies } from "../dashboard/AdminAgencies"
import { AdminProperties } from "../dashboard/AdminProperties"
import { AdminSubscriptionPlans } from "../subscription/AdminSubscriptionPlans"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full space-y-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="inline-flex w-max min-w-full p-1">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger 
              value="overview" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="agencies"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Agences
            </TabsTrigger>
            <TabsTrigger 
              value="properties"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Biens
            </TabsTrigger>
            <TabsTrigger 
              value="plans"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Abonnements
            </TabsTrigger>
          </TabsList>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      
      <div className="mt-4">
        <TabsContent value="overview" className="space-y-6">
          <AdminStats />
        </TabsContent>
        <TabsContent value="agencies" className="space-y-6">
          <AdminAgencies />
        </TabsContent>
        <TabsContent value="properties" className="space-y-6">
          <AdminProperties />
        </TabsContent>
        <TabsContent value="plans" className="space-y-6">
          <AdminSubscriptionPlans />
        </TabsContent>
      </div>
    </Tabs>
  )
}