import { PropertyTable } from "@/components/PropertyTable"
import { PropertyDialog } from "@/components/PropertyDialog"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { AgencyRegistrationDialog } from "@/components/agency/AgencyRegistrationDialog"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const Properties = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleRegistrationSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // Store the registration data in localStorage for the payment page
      localStorage.setItem('agencyRegistration', JSON.stringify(data))
      
      // Navigate to pricing page
      navigate('/pricing')
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AgencyLayout>
      <div className="w-full max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Gestion des Biens</h1>
          <PropertyDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
          />
        </div>
        <div className="w-full overflow-hidden">
          <PropertyTable />
        </div>

        <AgencyRegistrationDialog
          open={registrationOpen}
          onOpenChange={setRegistrationOpen}
          onSubmit={handleRegistrationSubmit}
          isLoading={isLoading}
        />
      </div>
    </AgencyLayout>
  )
}

export default Properties