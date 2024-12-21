import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ExpenseDialog } from "@/components/ExpenseDialog"
import { ExpenseTable } from "@/components/ExpenseTable"

const Expenses = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Dépenses</h1>
            <ExpenseDialog />
          </div>

          <ExpenseTable />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Expenses