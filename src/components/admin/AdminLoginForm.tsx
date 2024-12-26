import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Tentative de connexion avec:", { email })
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Erreur de connexion:', signInError)
        
        // Parse the error message from the response body if available
        let errorBody
        try {
          errorBody = JSON.parse(signInError.message)
        } catch {
          errorBody = null
        }

        let errorMessage = "Email ou mot de passe incorrect"
        
        if (errorBody?.message === "Invalid login credentials" || 
            signInError.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect"
        } else if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter"
        } else {
          console.error('Détails de l\'erreur:', signInError)
          errorMessage = "Une erreur est survenue lors de la connexion"
        }

        toast({
          title: "Échec de la connexion",
          description: errorMessage,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!data.user) {
        toast({
          title: "Échec de la connexion",
          description: "Aucun utilisateur trouvé",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log("Utilisateur connecté avec succès:", data.user.id)

      // Vérifier si l'utilisateur est un admin dans la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', data.user.id)
        .maybeSingle()

      console.log("Données du profil:", profileData)

      if (profileError) {
        console.error('Erreur de vérification du profil:', profileError)
        toast({
          title: "Erreur de vérification",
          description: "Impossible de vérifier vos droits d'accès",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (!profileData || profileData.role !== 'admin') {
        console.error('Utilisateur non admin:', profileData?.role)
        toast({
          title: "Accès refusé",
          description: "Seuls les administrateurs peuvent se connecter ici",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (!profileData.agency_id) {
        console.error('Aucune agence associée')
        toast({
          title: "Erreur de configuration",
          description: "Aucune agence n'est associée à votre compte",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace administrateur",
      })

      navigate("/agence/admin")
    } catch (error: any) {
      console.error('Erreur générale:', error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue",
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
          <CardTitle className="text-2xl font-bold text-center">Admin</CardTitle>
          <CardDescription className="text-center">
            Accès réservé aux administrateurs
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
                placeholder="admin@example.com"
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