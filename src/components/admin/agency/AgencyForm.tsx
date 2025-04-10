import { ScrollArea } from "@/components/ui/scroll-area"
import { Agency } from "./types"
import { AgencyBasicInfo } from "./AgencyBasicInfo"
import { Button } from "@/components/ui/button"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface AgencyFormProps {
  agency: Agency
  setAgency: (agency: Agency) => void
  onSubmit?: (agency: Agency) => void
}

export function AgencyForm({ agency, setAgency, onSubmit }: AgencyFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFieldChange = (field: keyof Agency, value: string) => {
    setAgency({ ...agency, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Get current session to ensure we're still authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Erreur",
          description: "Session expirée. Veuillez vous reconnecter.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('agencies')
        .update({
          name: agency.name,
          address: agency.address,
          phone: agency.phone,
          email: agency.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', agency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })

      // Refresh agency data
      queryClient.invalidateQueries({ queryKey: ['agencies'] })
      
      if (onSubmit) {
        onSubmit(agency)
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
          type="button"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mise à jour...
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </Button>
      </div>
    </ScrollArea>
  )
}