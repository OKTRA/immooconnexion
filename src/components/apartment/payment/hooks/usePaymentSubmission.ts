import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { LeaseData, PaymentFormData } from "../types";

export function usePaymentSubmission(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (
    formData: PaymentFormData,
    selectedLease: LeaseData,
    selectedPeriod: number,
    agencyId: string
  ) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: selectedLease.id,
          amount: formData.amount || selectedLease.rent_amount,
          payment_method: formData.paymentMethod,
          payment_date: formData.paymentDate.toISOString(),
          status: "paid",
          agency_id: agencyId,
          type: "rent",
          payment_period_start: formData.periodStart?.toISOString(),
          payment_period_end: formData.periodEnd?.toISOString(),
          payment_notes: formData.notes,
          historical_entry: formData.isHistorical,
          due_date: formData.paymentDate.toISOString()
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["lease-payments"] });
      await queryClient.invalidateQueries({ queryKey: ["lease-payment-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["lease-regular-payments"] });
      
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}