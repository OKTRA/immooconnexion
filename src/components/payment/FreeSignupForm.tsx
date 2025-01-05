import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormData } from "./types"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface FreeSignupFormProps {
  formData: PaymentFormData
  tempAgencyId: string | null
  onSuccess: () => void
}

export function FreeSignupForm({ formData, tempAgencyId, onSuccess }: FreeSignupFormProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleFreePlanSignup = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      // First check if user exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (existingUser.user) {
        toast({
          title: "Erreur",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        })
        navigate('/agence/login')
        return
      }

      // Create auth user if doesn't exist
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
          }
        }
      })

      if (signUpError) throw signUpError

      // Update agency status to active since it's free
      if (tempAgencyId && authData.user) {
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

        // Update profile with agency information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            agency_id: tempAgencyId,
            role: 'admin',
            status: 'active'
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Vous avez choisi le plan gratuit. Cliquez sur le bouton ci-dessous pour finaliser votre inscription.
      </p>
      <Button
        onClick={handleFreePlanSignup}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
    </div>
  )
}