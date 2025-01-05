import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { SignupFormData } from "../pricing/types"
import { PaymentFormFields } from "./PaymentFormFields"

interface FreeSignupFormProps {
  formData: SignupFormData
  setFormData: (data: SignupFormData) => void
  setStep: (step: number) => void
}

export function FreeSignupForm({ formData, setFormData, setStep }: FreeSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      
      // First check if user exists
      const { data: { user: existingUser } } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        })
        navigate('/login')
        return
      }

      // Create auth user if doesn't exist
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) throw signUpError

      // Create agency
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert([{
          name: formData.agency_name,
          address: formData.agency_address,
          phone: formData.agency_phone,
          email: formData.email,
          subscription_plan_id: formData.subscription_plan_id,
          country: formData.country,
          city: formData.city,
        }])
        .select()
        .single()

      if (agencyError) throw agencyError

      // Update user profile with agency_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          agency_id: agency.id,
          role: 'admin',
        })
        .eq('id', authData.user?.id)

      if (profileError) throw profileError

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      })

      setStep(2)
    } catch (error: any) {
      console.error('Error:', error)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentFormFields formData={formData} setFormData={setFormData} />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
    </form>
  )
}