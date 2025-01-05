import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ForgotPasswordButtonProps {
  email: string;
}

export function ForgotPasswordButton({ email }: ForgotPasswordButtonProps) {
  const { toast } = useToast()

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

  return (
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
  )
}