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
        })
        return
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      })

      if (signInError) {
        console.error('Login error:', signInError)
        toast({
          title: "Échec de la connexion",
          description: signInError.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion",
          variant: "destructive",
        })
        return
      }

      if (!signInData.user) {
        toast({
          title: "Échec de la connexion",
          description: "Impossible de récupérer les informations utilisateur",
          variant: "destructive",
        })
        return
      }

      // Get user profile and agency info
      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', signInData.user.id)
        .single()

      if (!profile?.agency_id) {
        toast({
          title: "Erreur",
          description: "Aucune agence associée à ce compte",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        return
      }

      // Check agency status
      const { data: agency } = await supabase
        .from('agencies')
        .select('status')
        .eq('id', profile.agency_id)
        .single()

      if (agency?.status === 'blocked') {
        toast({
          title: "Accès refusé",
          description: "Votre agence est actuellement bloquée. Veuillez contacter l'administrateur.",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        return
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace",
      })

      // Redirect based on role
      if (profile.role === 'super_admin') {
        navigate('/super-admin/dashboard')
      } else {
        navigate('/agence/dashboard')
      }

    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
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