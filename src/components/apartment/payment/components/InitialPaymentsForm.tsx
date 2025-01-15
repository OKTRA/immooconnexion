import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { PaymentMethod } from "../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface InitialPaymentsFormProps {
  leaseId: string;
  depositAmount: number;
  rentAmount: number;
  onSuccess: () => void;
  agencyId: string;
}

interface InitialPaymentsFormData {
  paymentMethod: PaymentMethod;
  agencyFees: number;
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
      agencyFees: rentAmount * 0.5,
    },
  });

  const onSubmit = async (data: InitialPaymentsFormData) => {
    try {
      console.log("Début de la soumission des paiements initiaux", { data, leaseId, agencyId });

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

      if (depositError) {
        console.error("Erreur lors du paiement de la caution:", depositError);
        throw new Error(`Erreur lors du paiement de la caution: ${depositError.message}`);
      }

      console.log("Paiement de la caution enregistré");

      // Créer le paiement des frais d'agence
      const { error: feesError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: leaseId,
          amount: data.agencyFees,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "agency_fees",
        });

      if (feesError) {
        console.error("Erreur lors du paiement des frais d'agence:", feesError);
        throw new Error(`Erreur lors du paiement des frais d'agence: ${feesError.message}`);
      }

      console.log("Paiement des frais d'agence enregistré");

      // Mettre à jour le statut des paiements initiaux
      const { error: updateError } = await supabase
        .from("apartment_leases")
        .update({ 
          initial_payments_completed: true,
          initial_fees_paid: true 
        })
        .eq("id", leaseId);

      if (updateError) {
        console.error("Erreur lors de la mise à jour du statut:", updateError);
        throw new Error(`Erreur lors de la mise à jour du statut: ${updateError.message}`);
      }

      console.log("Statut des paiements initiaux mis à jour");

      toast({
        title: "Paiements initiaux effectués",
        description: "Les paiements de la caution et des frais d'agence ont été enregistrés",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors des paiements initiaux",
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
              
              <FormField
                control={form.control}
                name="agencyFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais d'agence (suggestion: {(rentAmount * 0.5).toLocaleString()} FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {(depositAmount + form.watch("agencyFees")).toLocaleString()} FCFA
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