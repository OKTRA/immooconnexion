import { ExpenseTable } from "@/components/ExpenseTable"
import { ExpenseDialog } from "@/components/ExpenseDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"

const Expenses = () => {
  return (
    <AgencyLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dépenses</h1>
        <ExpenseDialog />
      </div>
      <ExpenseTable />
    </AgencyLayout>
  )
}

export default Expenses