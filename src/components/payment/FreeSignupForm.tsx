import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormData } from "./types"
import { useNavigate } from "react-router-dom"

interface FreeSignupFormProps {
  formData: PaymentFormData
  tempAgencyId: string | null
  onSuccess: () => void
}

export function FreeSignupForm({ formData, tempAgencyId, onSuccess }: FreeSignupFormProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleFreePlanSignup = async () => {
    try {
      // Create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      // Update agency status to active since it's free
      if (tempAgencyId) {
        const { error: updateError } = await supabase
          .from('agencies')
          .update({ 
            status: 'active',
            name: formData.agency_name,
            address: formData.agency_address,
            country: formData.country,
            city: formData.city,
            phone: formData.phone_number
          })
          .eq('id', tempAgencyId)

        if (updateError) throw updateError
      }

      onSuccess()
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })
      navigate('/agence/login')
    } catch (error: any) {
      console.error('Error during free plan signup:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Vous avez choisi le plan gratuit. Cliquez sur le bouton ci-dessous pour finaliser votre inscription.
      </p>
      <button
        onClick={handleFreePlanSignup}
        className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90"
      >
        Créer mon compte
      </button>
    </div>
  )
}