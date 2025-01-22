import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { AdminLoginHeader } from "./AdminLoginHeader"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleForgotPassword = async () => {
    if (!email || !email.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre adresse email avant de réinitialiser le mot de passe.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) {
      console.error('Password reset error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      })
    } else {
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        duration: 5000,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await supabase.auth.signOut()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (signInError) throw signInError

      if (!data.user) {
        throw new Error("No user data returned")
      }

      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('is_super_admin, agency_id')
        .eq('id', data.user.id)
        .single()

      if (adminError || !adminData) {
        throw new Error("Admin verification failed")
      }

      if (!adminData.is_super_admin) {
        throw new Error("Not a super admin")
      }

      if (!adminData.is_super_admin && adminData.agency_id) {
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .select('status')
          .eq('id', adminData.agency_id)
          .single()

        if (agencyError || !agencyData) {
          throw new Error("Agency verification failed")
        }

        if (agencyData.status === 'blocked') {
          throw new Error("Agency is blocked")
        }
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace super administrateur",
      })

      navigate("/super-admin/admin")
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
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
        <AdminLoginHeader />
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
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-sm text-gray-600 hover:text-primary"
                onClick={handleForgotPassword}
                type="button"
              >
                Mot de passe oublié ?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}