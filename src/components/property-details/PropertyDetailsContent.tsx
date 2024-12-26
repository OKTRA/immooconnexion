import { useParams } from "react-router-dom"
import { usePropertyData } from "./hooks/usePropertyData"
import { useContractsData } from "./hooks/useContractsData"
import { PropertyInfo } from "./PropertyInfo"
import { PaymentHistory } from "./PaymentHistory"
import { InspectionsList } from "./InspectionsList"
import { PropertyActions } from "./PropertyActions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Contract } from "@/integrations/supabase/types/contracts"

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

  if (isLoadingProperty || isLoadingContracts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Bien non trouvé
      </div>
    )
  }

  const handlePrintReceipt = (contract: Contract) => {
    console.log("Printing receipt for contract:", contract)
    toast({
      title: "Impression du reçu",
      description: "Le reçu est en cours d'impression..."
    })
  }

  const handlePrintContract = (contract: Contract) => {
    console.log("Printing contract:", contract)
    toast({
      title: "Impression du contrat",
      description: "Le contrat est en cours d'impression..."
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
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