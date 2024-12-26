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
      console.log("Attempting to sign in with:", { email })
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }

      if (!data.user) {
        console.error('No user data returned')
        throw new Error("Aucun utilisateur trouvé")
      }

      console.log("User signed in successfully:", data.user.id)

      // Vérifier si l'utilisateur est un admin dans la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', data.user.id)
        .maybeSingle()

      console.log("Profile data:", profileData)

      if (profileError) {
        console.error('Profile check error:', profileError)
        throw new Error("Erreur lors de la vérification des droits d'administrateur")
      }

      if (!profileData || profileData.role !== 'admin') {
        console.error('User is not an admin:', profileData?.role)
        await supabase.auth.signOut()
        throw new Error("Accès non autorisé. Seuls les administrateurs peuvent se connecter ici.")
      }

      if (!profileData.agency_id) {
        console.error('No agency associated with admin')
        await supabase.auth.signOut()
        throw new Error("Aucune agence associée à ce compte administrateur.")
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface administrateur",
      })

      navigate("/admin")
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorMessage = "Une erreur est survenue lors de la connexion"
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect"
      } else if (error.message?.includes("User not found")) {
        errorMessage = "Cet utilisateur n'existe pas"
      } else if (error.message?.includes("Accès non autorisé")) {
        errorMessage = error.message
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      })

      await supabase.auth.signOut()
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