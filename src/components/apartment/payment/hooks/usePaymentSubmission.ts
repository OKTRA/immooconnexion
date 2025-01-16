import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentFormData, LeaseData } from "../types";

export function usePaymentSubmission(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    data: PaymentFormData,
    selectedLease: LeaseData,
    selectedPeriods: number,
    agencyId: string | null
  ) => {
    if (!agencyId || !selectedLease) {
      toast({
        title: "Erreur",
        description: "Informations manquantes",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const totalAmount = selectedLease.rent_amount * selectedPeriods;

      const { error: paymentError } = await supabase
        .from("apartment_lease_payments")
        .insert({
          lease_id: data.leaseId,
          amount: totalAmount,
          payment_method: data.paymentMethod,
          status: "paid",
          payment_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          agency_id: agencyId,
          payment_type: "rent"
        });

      if (paymentError) throw paymentError;

      await queryClient.invalidateQueries({ queryKey: ["leases"] });

      toast({
        title: "Paiement effectué",
        description: "Le paiement a été enregistré avec succès",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
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