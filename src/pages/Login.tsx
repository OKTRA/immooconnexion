import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ExternalLink } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UserLoginForm } from "@/components/auth/UserLoginForm"
import { AdminLoginForm } from "@/components/auth/AdminLoginForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseSessionKey } from "@/utils/sessionUtils"

const Login = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("user")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAndClearSession = async () => {
      try {
        setIsLoading(true)
        const storageKey = getSupabaseSessionKey()
        localStorage.removeItem(storageKey)

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session check error:', error)
          if (error.message.includes('Failed to fetch')) {
            toast({
              title: "Erreur de connexion",
              description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
              variant: "destructive"
            })
          }
          return
        }

        if (session) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle()

            if (profileError) {
              console.error('Profile check error:', profileError)
              throw profileError
            }

            if (profileData?.role === 'admin') {
              navigate("/admin")
            } else {
              navigate("/")
            }
          } catch (error: any) {
            console.error('Profile verification error:', error)
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la vérification des droits d'accès.",
              variant: "destructive"
            })
          }
        }
      } catch (error: any) {
        console.error('Session check error:', error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de la session.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndClearSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profileError) {
            console.error('Profile check error:', profileError)
            throw profileError
          }

          if (profileData?.role === 'admin') {
            navigate("/admin")
          } else {
            navigate("/")
          }
        } catch (error: any) {
          console.error('Auth state change error:', error)
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification des droits d'accès.",
            variant: "destructive"
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        }}
      >
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="fixed top-4 right-4">
        <Button 
          variant="secondary" 
          className="bg-white hover:bg-gray-100"
          onClick={() => navigate('/public')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Voir les biens disponibles
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Bienvenue sur votre espace de gestion immobilière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Utilisateur</TabsTrigger>
              <TabsTrigger value="admin">Super Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <UserLoginForm />
            </TabsContent>
            <TabsContent value="admin">
              <AdminLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login