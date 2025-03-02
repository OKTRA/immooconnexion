
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { ApartmentLease } from "@/types/apartment"
import { useLeaseMutations } from "@/components/apartment/lease/hooks/useLeaseMutations"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PaymentMethod } from "@/types/payment"
import { toast } from "@/hooks/use-toast"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface InitialPaymentFormProps {
  onSuccess?: () => void
  lease: ApartmentLease
}

interface FormValues {
  paymentMethod: PaymentMethod;
  firstRentDate: Date | undefined;
}

export function InitialPaymentForm({ onSuccess, lease }: InitialPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { handleInitialPayments } = useLeaseMutations()

  const form = useForm<FormValues>({
    defaultValues: {
      paymentMethod: "cash",
      firstRentDate: undefined
    }
  })

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting || !values.firstRentDate) return

    try {
      setIsSubmitting(true)
      await handleInitialPayments.mutateAsync({
        leaseId: lease.id,
        depositAmount: lease.deposit_amount,
        rentAmount: lease.rent_amount,
        firstRentStartDate: values.firstRentDate,
        paymentMethod: values.paymentMethod
      })
      
      toast({
        title: "Paiements initiaux enregistrés",
        description: "Les paiements initiaux ont été enregistrés avec succès."
      })
      
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting initial payments:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements initiaux.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Caution</Label>
            <Input
              type="text"
              value={`${lease.deposit_amount?.toLocaleString()} FCFA`}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>Frais d'agence (50% du loyer)</Label>
            <Input
              type="text"
              value={`${Math.round(lease.rent_amount * 0.5).toLocaleString()} FCFA`}
              disabled
              className="bg-muted"
            />
          </div>

          <FormField
            control={form.control}
            name="firstRentDate"
            rules={{ required: "La date de début du premier loyer est requise" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début du premier loyer</FormLabel>
                <Popover 
                  open={isCalendarOpen} 
                  onOpenChange={setIsCalendarOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsCalendarOpen(true)
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0" 
                    align="start"
                    onInteractOutside={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de paiement</FormLabel>
                <FormControl>
                  <PaymentMethodSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !form.watch("firstRentDate")}
          className="w-full"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer les paiements initiaux"}
        </Button>
      </form>
    </Form>
  )
}
