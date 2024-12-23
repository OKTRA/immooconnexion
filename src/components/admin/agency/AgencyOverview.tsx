import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgencyUsers } from "./AgencyUsers"
import { AgencyProperties } from "./AgencyProperties"
import { AgencyTenants } from "./AgencyTenants"
import { Agency } from "./types"

interface AgencyOverviewProps {
  agency: Agency
  onRefetch: () => void
}

export function AgencyOverview({ agency, onRefetch }: AgencyOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble - {agency.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="properties">Biens</TabsTrigger>
            <TabsTrigger value="tenants">Locataires</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <AgencyUsers agencyId={agency.id} onRefetch={onRefetch} />
          </TabsContent>
          <TabsContent value="properties">
            <AgencyProperties agencyId={agency.id} />
          </TabsContent>
          <TabsContent value="tenants">
            <AgencyTenants agencyId={agency.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}