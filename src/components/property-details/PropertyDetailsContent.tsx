import { useParams } from "react-router-dom"
import { usePropertyData } from "./hooks/usePropertyData"
import { useContractsData } from "./hooks/useContractsData"
import { PropertyInfo } from "./PropertyInfo"
import { PaymentHistory } from "./PaymentHistory"
import { InspectionsList } from "./InspectionsList"
import { PropertyActions } from "./PropertyActions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export const PropertyDetailsContent = () => {
  const { id } = useParams()
  const { toast } = useToast()

  const { 
    data: property, 
    isLoading: isLoadingProperty, 
    error: propertyError 
  } = usePropertyData(id)

  const { 
    data: contracts = [], 
    isLoading: isLoadingContracts, 
    error: contractsError 
  } = useContractsData(id)

  const handlePrintReceipt = (contract: any) => {
    console.log("Printing receipt for contract:", contract)
    toast({
      title: "Impression du reçu",
      description: "Le reçu est en cours d'impression..."
    })
  }

  const handlePrintContract = (contract: any) => {
    console.log("Printing contract:", contract)
    toast({
      title: "Impression du contrat",
      description: "Le contrat est en cours d'impression..."
    })
  }

  if (isLoadingProperty || isLoadingContracts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (propertyError || contractsError || !property) {
    console.error("Errors:", { propertyError, contractsError })
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Une erreur est survenue lors du chargement des données
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-16">
      <PropertyInfo property={property} />
      <PropertyActions propertyId={id || ''} contracts={contracts} />
      <PaymentHistory 
        propertyId={id || ''} 
        contracts={contracts}
        onPrintReceipt={handlePrintReceipt}
        onPrintContract={handlePrintContract}
      />
      <InspectionsList contracts={contracts} />
    </div>
  )
}