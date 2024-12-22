import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { addDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { TenantPaymentsReport } from "@/components/reports/TenantPaymentsReport"
import { PropertyAnalysisReport } from "@/components/reports/PropertyAnalysisReport"
import { OverviewStats } from "@/components/reports/OverviewStats"
import { RevenueEvolution } from "@/components/reports/RevenueEvolution"
import { OccupancyStatus } from "@/components/reports/OccupancyStatus"

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']

const Reports = () => {
  const [date, setDate] = useState<DateRange>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 0),
  })
  const [selectedProperty, setSelectedProperty] = useState<string>("")

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Rapports</h1>
            <div className="flex gap-4">
              <DatePickerWithRange date={date} setDate={setDate} />
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apt1">Appartement Jaune Block 1</SelectItem>
                  <SelectItem value="m201">Maison M201</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="tenants">Paiements Locataires</TabsTrigger>
              <TabsTrigger value="properties">Analyse des Biens</TabsTrigger>
              <TabsTrigger value="expenses">Dépenses</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewStats />
              <div className="grid grid-cols-2 gap-4">
                <RevenueEvolution />
                <OccupancyStatus />
              </div>
            </TabsContent>

            <TabsContent value="tenants">
              <TenantPaymentsReport />
            </TabsContent>

            <TabsContent value="properties">
              <PropertyAnalysisReport />
            </TabsContent>

            <TabsContent value="expenses">
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Dépenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Maintenance', value: 250000 },
                              { name: 'Réparations', value: 150000 },
                              { name: 'Charges', value: 100000 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value} FCFA`}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques des Dépenses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Dépense Moyenne par Bien</h3>
                      <p className="text-2xl font-bold">215,000 FCFA</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Total Dépenses Période</h3>
                      <p className="text-2xl font-bold">430,000 FCFA</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Nombre d'Interventions</h3>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Reports