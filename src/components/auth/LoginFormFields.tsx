import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ForgotPasswordButton } from "./ForgotPasswordButton"

export function LoginFormFields() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()

      if (!trimmedEmail || !trimmedPassword) {
        toast({
          title: "Erreur de saisie",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
          duration: 5000,
        })
        setIsLoading(false)
        return
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      })

      if (signInError) {
        console.error('Login error:', signInError)
        
        // Handle specific error cases
        if (signInError.message === "Invalid login credentials") {
          toast({
            title: "Échec de la connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
            duration: 5000,
          })
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Une erreur est survenue lors de la connexion",
            variant: "destructive",
            duration: 5000,
          })
        }
        setIsLoading(false)
        return
      }

      if (!signInData.user) {
        toast({
          title: "Échec de la connexion",
          description: "Impossible de récupérer les informations utilisateur",
          variant: "destructive",
          duration: 5000,
        })
        setIsLoading(false)
        return
      }

      // Show success toast and navigate immediately after successful authentication
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace",
        duration: 3000,
      })
      navigate("/agence/admin")

      // Continue with profile and agency checks in the background
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', signInData.user.id)
        .single()

      if (profileError || !profile?.agency_id) {
        console.error('Profile verification error:', profileError)
        await supabase.auth.signOut()
        return
      }

      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('status')
        .eq('id', profile.agency_id)
        .single()

      if (agencyError || !agency) {
        console.error('Agency verification error:', agencyError)
        await supabase.auth.signOut()
        return
      }

      if (agency.status === 'blocked') {
        toast({
          title: "Accès refusé",
          description: "Votre agence est actuellement bloquée. Veuillez contacter l'administrateur.",
          variant: "destructive",
          duration: 7000,
        })
        await supabase.auth.signOut()
        return
      }

    } catch (error) {
      console.error('General error:', error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="agence@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
      <ForgotPasswordButton email={email} />
    </form>
  )
}