import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormFields } from "./PaymentFormFields"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormData, paymentFormSchema } from "./types"
import { Form } from "@/components/ui/form"

export interface FreeSignupFormProps {
  formData: PaymentFormData
  onSuccess?: () => void
  agencyId?: string
}

export function FreeSignupForm({ 
  formData,
  onSuccess,
  agencyId
}: FreeSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: formData
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      const values = form.getValues()
      
      // First check if user exists
      const { data: { user: existingUser } } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
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
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          }
        }
      })

      if (signUpError) throw signUpError

      // Create agency
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert([{
          id: agencyId,
          name: values.agency_name,
          address: values.agency_address,
          phone: values.phone_number,
          email: values.email,
          country: values.country,
          city: values.city,
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
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number
        })
        .eq('id', authData.user?.id)

      if (profileError) throw profileError

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      })

      onSuccess?.()
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
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentFormFields form={form} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  )
}