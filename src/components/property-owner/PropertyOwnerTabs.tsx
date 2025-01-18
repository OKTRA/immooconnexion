import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyListTab } from "./PropertyListTab"
import { RevenuesTab } from "./RevenuesTab"
import { ExpensesTab } from "./ExpensesTab"
import { StatementsTab } from "./StatementsTab"
import { ApartmentsTab } from "./ApartmentsTab"

interface PropertyOwnerTabsProps {
  ownerId: string
  revenues?: any[]
  expenses?: any[]
  statements?: any[]
  isLoading?: boolean
}

export function PropertyOwnerTabs({
  ownerId,
  revenues,
  expenses,
  statements,
  isLoading
}: PropertyOwnerTabsProps) {
  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList>
        <TabsTrigger value="properties">Propriétés</TabsTrigger>
        <TabsTrigger value="apartments">Appartements</TabsTrigger>
        <TabsTrigger value="revenues">Revenus</TabsTrigger>
        <TabsTrigger value="expenses">Dépenses</TabsTrigger>
        <TabsTrigger value="statements">États financiers</TabsTrigger>
      </TabsList>

      <TabsContent value="properties">
        <PropertyListTab ownerId={ownerId} />
      </TabsContent>

      <TabsContent value="apartments">
        <ApartmentsTab ownerId={ownerId} />
      </TabsContent>

      <TabsContent value="revenues">
        <RevenuesTab revenues={revenues} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="expenses">
        <ExpensesTab expenses={expenses} />
      </TabsContent>

      <TabsContent value="statements">
        <StatementsTab statements={statements} />
      </TabsContent>
    </Tabs>
  )
}