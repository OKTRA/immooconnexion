import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { useState } from "react"
import { PaydunyaForm } from "@/components/payment/PaydunyaForm"
import { OrangeMoneyForm } from "@/components/payment/OrangeMoneyForm"
import { CinetPayForm } from "@/components/payment/CinetPayForm"

const formSchema = z.object({
  agency_name: z.string().min(2, "Le nom de l'agence doit contenir au moins 2 caractères"),
  agency_address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  agency_phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
})

type FormData = z.infer<typeof formSchema>

interface AgencyRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId?: string
  planName?: string
  amount?: number
}

export function AgencyRegistrationDialog({ 
  open, 
  onOpenChange,
  planId,
  planName,
  amount = 0
}: AgencyRegistrationDialogProps) {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("orange_money")
  const [formData, setFormData] = useState<FormData | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agency_name: "",
      agency_address: "",
      agency_phone: "",
      country: "",
      city: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  })

  const handleSubmit = async (data: FormData) => {
    setFormData(data)
    setShowPaymentMethods(true)
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {showPaymentMethods ? "Choisissez votre méthode de paiement" : "Inscription de l'agence"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          {!showPaymentMethods ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Informations de l'agence</h3>
                  
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
                          <Input placeholder="123 Rue Principale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder="Côte d'Ivoire" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Abidjan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="agency_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de l'agence</FormLabel>
                        <FormControl>
                          <Input placeholder="+225 XX XX XX XX XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Informations de l'administrateur</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="8 caractères minimum, 1 majuscule, 1 chiffre"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Retapez votre mot de passe" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continuer vers le paiement
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />

              {paymentMethod === "orange_money" && formData && (
                <OrangeMoneyForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  agencyId={planId}
                  formData={formData}
                />
              )}

              {paymentMethod === "cinetpay" && formData && (
                <CinetPayForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  agencyId={planId}
                  formData={formData}
                />
              )}

              {paymentMethod === "paydunya" && formData && (
                <PaydunyaForm
                  amount={amount}
                  description={`Inscription - Plan ${planName}`}
                  agencyId={planId}
                  formData={formData}
                />
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}