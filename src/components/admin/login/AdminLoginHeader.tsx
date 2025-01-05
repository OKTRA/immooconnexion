import { Shield } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AdminLoginHeader() {
  return (
    <CardHeader className="space-y-2">
      <div className="flex items-center justify-center text-primary mb-4">
        <Shield className="h-12 w-12" />
      </div>
      <CardTitle className="text-2xl font-bold text-center">Super Admin</CardTitle>
      <CardDescription className="text-center">
        Accès réservé aux super administrateurs
      </CardDescription>
    </CardHeader>
  )
}