import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InitialPaymentsFormProps {
  leaseId: string;
  depositAmount: number;
  rentAmount: number;
  onSuccess: () => void;
  agencyId: string;
}

interface InitialPaymentsFormData {
  paymentMethod: string;
}

export function InitialPaymentsForm({
  leaseId,
  depositAmount,
  rentAmount,
  onSuccess,
  agencyId,
}: InitialPaymentsFormProps) {
  const { toast } = useToast();
  const form = useForm<InitialPaymentsFormData>({
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  const agencyFees = rentAmount * 0.5; // 50% du loyer comme frais d'agence

  const onSubmit = async (data: InitialPaymentsFormData) => {
    try {
      // Créer le paiement de la caution
      const { error: depositError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: depositAmount,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "deposit",
        });

      if (depositError) throw depositError;

      // Créer le paiement des frais d'agence
      const { error: feesError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: agencyFees,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "agency_fees",
        });

      if (feesError) throw feesError;

      // Mettre à jour le statut des paiements initiaux
      const { error: updateError } = await supabase
        .from("apartment_leases")
        .update({ initial_payments_completed: true })
        .eq("id", leaseId);

      if (updateError) throw updateError;

      toast({
        title: "Paiements initiaux effectués",
        description: "Les paiements de la caution et des frais d'agence ont été enregistrés",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors des paiements initiaux",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paiements initiaux requis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span>Caution</span>
                <span className="font-semibold">{depositAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Frais d'agence</span>
                <span className="font-semibold">{agencyFees.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {(depositAmount + agencyFees).toLocaleString()} FCFA
                </span>
              </div>
            </div>

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
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                "Effectuer les paiements initiaux"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}