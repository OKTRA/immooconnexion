import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const occupancyData = [
  { status: 'Occupé', value: 15 },
  { status: 'Libre', value: 5 },
]

const revenueData = [
  { month: 'Jan', revenue: 1200000 },
  { month: 'Fév', revenue: 1500000 },
  { month: 'Mar', revenue: 1800000 },
  { month: 'Avr', revenue: 1600000 },
  { month: 'Mai', revenue: 2000000 },
  { month: 'Jun', revenue: 1900000 },
]

const COLORS = ['#0088FE', '#FF8042']

const Reports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Rapports</h1>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="financial">Financier</TabsTrigger>
              <TabsTrigger value="occupancy">Occupation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total des Biens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">20</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Taux d'Occupation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">75%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenu Mensuel Moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1,650,000 FCFA</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Évolution des Revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="occupancy">
              <Card>
                <CardHeader>
                  <CardTitle>État d'Occupation des Biens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Reports