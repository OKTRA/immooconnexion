import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { AgencyInfoFields } from "./agency-form/AgencyInfoFields"
import { AdminAccountFields } from "./agency-form/AdminAccountFields"
import { signupFormSchema, type SignupFormData } from "./types"

interface AgencySignupFormProps {
  subscriptionPlanId: string
  onSubmit: (data: SignupFormData) => void
  isLoading?: boolean
}

export function AgencySignupForm({ subscriptionPlanId, onSubmit, isLoading }: AgencySignupFormProps) {
  const { toast } = useToast()
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  })

  const handleSubmit = async (data: SignupFormData) => {
    try {
      await onSubmit(data)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <AgencyInfoFields form={form} />
        <AdminAccountFields form={form} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            "Continuer vers le paiement"
          )}
        </Button>
      </form>
    </Form>
  )
}