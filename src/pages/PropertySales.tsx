import { PropertySalesTable } from "@/components/property-sales/PropertySalesTable"
import { PropertySalesTabs } from "@/components/property-sales/PropertySalesTabs"

const PropertySales = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Ventes</h1>
      </div>
      <PropertySalesTabs />
    </>
  )
}

export default PropertySales