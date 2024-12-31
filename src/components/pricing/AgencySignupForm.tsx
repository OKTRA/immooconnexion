import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const signupFormSchema = z.object({
  agency_name: z.string().min(2, "Le nom de l'agence doit contenir au moins 2 caractères"),
  agency_address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  user_first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  user_last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  user_email: z.string().email("Email invalide"),
  user_phone: z.string().min(8, "Numéro de téléphone invalide"),
})

type SignupFormData = z.infer<typeof signupFormSchema>

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
      await onSubmit({
        ...data,
        // Utiliser les informations de l'administrateur pour l'agence
        agency_email: data.user_email,
        agency_phone: data.user_phone,
      })
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
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations de l'agence</h3>
          <p className="text-sm text-gray-500">
            Ces informations seront utilisées pour créer votre agence. 
            Vos coordonnées personnelles seront utilisées comme contact principal de l'agence.
          </p>
          
          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'agence</FormLabel>
                <FormControl>
                  <Input placeholder="Mon Agence Immobilière" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agency_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rue Principale, Ville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations du propriétaire</h3>
          <p className="text-sm text-gray-500">
            En tant que créateur de l'agence, vous serez automatiquement désigné comme administrateur principal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+225 XX XX XX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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