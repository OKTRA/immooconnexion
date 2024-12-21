import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const tenantPayments = [
  {
    id: 1,
    tenant: "Awa MAIGA",
    property: "Appartement Jaune Block 1",
    amount: 155000,
    type: "Loyer",
    date: "2024-02-20",
    status: "Payé",
    agencyFees: 25000,
  },
  {
    id: 2,
    tenant: "Awa MAIGA",
    property: "Appartement Jaune Block 1",
    amount: 155000,
    type: "Loyer",
    date: "2024-03-20",
    status: "En retard",
    agencyFees: 0,
  },
]

const propertyExpenses = [
  {
    id: 1,
    property: "Appartement Jaune Block 1",
    totalExpenses: 250000,
    maintenanceCount: 5,
    lastExpenseDate: "2024-03-15",
  },
  {
    id: 2,
    property: "Maison M201",
    totalExpenses: 180000,
    maintenanceCount: 3,
    lastExpenseDate: "2024-03-10",
  },
]

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']

const Reports = () => {
  const [date, setDate] = useState({
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
              <div className="grid gap-4 md:grid-cols-4 mb-8">
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
                    <CardTitle>Revenu Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">10,050,000 FCFA</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frais d'Agence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1,505,000 FCFA</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
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

                <Card>
                  <CardHeader>
                    <CardTitle>État d'Occupation</CardTitle>
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
              </div>
            </TabsContent>

            <TabsContent value="tenants">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-4 text-left">Locataire</th>
                          <th className="p-4 text-left">Bien</th>
                          <th className="p-4 text-left">Montant</th>
                          <th className="p-4 text-left">Type</th>
                          <th className="p-4 text-left">Date</th>
                          <th className="p-4 text-left">Statut</th>
                          <th className="p-4 text-left">Frais d'Agence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenantPayments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="p-4">{payment.tenant}</td>
                            <td className="p-4">{payment.property}</td>
                            <td className="p-4">{payment.amount} FCFA</td>
                            <td className="p-4">{payment.type}</td>
                            <td className="p-4">{payment.date}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                payment.status === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="p-4">{payment.agencyFees} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des Biens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-4 text-left">Bien</th>
                          <th className="p-4 text-left">Total Dépenses</th>
                          <th className="p-4 text-left">Nombre Maintenances</th>
                          <th className="p-4 text-left">Dernière Dépense</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyExpenses.map((property) => (
                          <tr key={property.id} className="border-b">
                            <td className="p-4">{property.property}</td>
                            <td className="p-4">{property.totalExpenses} FCFA</td>
                            <td className="p-4">{property.maintenanceCount}</td>
                            <td className="p-4">{property.lastExpenseDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
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