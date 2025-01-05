import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { LoginFormFields } from "./LoginFormFields"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Erreur",
          description: "Utilisateur non trouvé",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        toast({
          title: "Erreur",
          description: "Aucune agence associée à ce compte",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      const { data: agency } = await supabase
        .from('agencies')
        .select('status')
        .eq('id', profile.agency_id)
        .maybeSingle()

      if (!agency) {
        toast({
          title: "Erreur",
          description: "Agence non trouvée",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (agency.status === 'blocked') {
        toast({
          title: "Accès refusé",
          description: "Votre agence est actuellement bloquée. Veuillez contacter l'administrateur.",
          variant: "destructive",
        })
        // Add a small delay to ensure the toast is shown before signing out
        setTimeout(async () => {
          await supabase.auth.signOut()
          setIsLoading(false)
        }, 100)
        return
      }

      if (agency.status === 'pending') {
        navigate('/agence/pending')
        setIsLoading(false)
        return
      }

      navigate('/agence/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte agence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <LoginFormFields
            isLoading={isLoading}
            register={register}
            errors={errors}
          />
        </form>
      </CardContent>
    </Card>
  )
}