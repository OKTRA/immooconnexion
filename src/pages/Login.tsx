import { PublicNavbar } from "@/components/home/PublicNavbar"
import { LoginForm } from "@/components/auth/LoginForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#243949] to-[#517fa4] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace propriétaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}