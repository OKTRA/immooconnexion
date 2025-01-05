import { ScrollArea } from "@/components/ui/scroll-area"
import { Agency } from "./types"
import { AgencyBasicInfo } from "./AgencyBasicInfo"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
  onSubmit?: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency, onSubmit }: AgencyFormProps) {
  const handleFieldChange = (field: keyof Agency, value: string) => {
    setAgency({ ...agency, [field]: value })
  }

  const { data: currentPlan } = useQuery({
    queryKey: ["subscription-plan", agency.subscription_plan_id],
    queryFn: async () => {
      if (!agency.subscription_plan_id) return null
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", agency.subscription_plan_id)
        .single()
      
      if (error) throw error
      return data
    },
  })

  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
      <div className="space-y-6">
        <AgencyBasicInfo 
          agency={agency} 
          onChange={handleFieldChange} 
        />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Plan d'abonnement actuel</h3>
          <div className="p-4 border rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              {currentPlan?.name || 'Plan de base'} - {currentPlan?.price || 0} FCFA/mois
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pour changer de plan, rendez-vous dans la section Abonnement
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          onClick={() => onSubmit?.(agency)}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </ScrollArea>
  )
}