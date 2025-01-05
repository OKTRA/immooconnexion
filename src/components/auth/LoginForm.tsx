import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First clear any existing session
      await supabase.auth.signOut()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (signInError) {
        console.error('Login error:', signInError)
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!data.user) {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Get user profile and check agency status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile?.agency_id) {
        console.error('Profile verification error:', profileError)
        toast({
          title: "Erreur de vérification",
          description: "Impossible de vérifier votre profil",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Check agency status
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('status')
        .eq('id', profile.agency_id)
        .single()

      if (agencyError || !agency) {
        console.error('Agency verification error:', agencyError)
        toast({
          title: "Erreur de vérification",
          description: "Impossible de vérifier le statut de l'agence",
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
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace",
      })

      navigate("/agence/dashboard")
    } catch (error: any) {
      console.error('General error:', error)
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
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center text-primary mb-4">
            <Shield className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre espace agence
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}