import { Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoginFormFields } from "./LoginFormFields"
import { Toaster } from "@/components/ui/toaster"

export function LoginFormContainer() {
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
          <LoginFormFields />
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}