import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { usePaymentForm } from "./hooks/usePaymentForm";
import { PaymentMethodSelect } from "./components/PaymentMethodSelect";
import { PaymentFormData, PaymentFormProps, PeriodOption } from "./types";
import { supabase } from "@/lib/supabase";
import { LeaseSelector } from "./components/LeaseSelector";
import { PaymentDetails } from "./components/PaymentDetails";
import { PeriodSelector } from "./components/PeriodSelector";
import { InitialPaymentsForm } from "./components/InitialPaymentsForm";
import { useQueryClient } from "@tanstack/react-query";

export function PaymentForm({ onSuccess, tenantId }: PaymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    leases,
    isLoadingLeases,
    selectedLeaseId,
    setSelectedLeaseId,
    isSubmitting,
    setIsSubmitting,
    agencyId,
    refetchLeases
  } = usePaymentForm(onSuccess);

  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number>(1);

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId: "",
      amount: 0,
      paymentMethod: "cash",
      paymentPeriods: []
    }
  });

  useEffect(() => {
    if (selectedLeaseId) {
      const lease = leases.find(l => l.id === selectedLeaseId);
      setSelectedLease(lease);
      if (lease) {
        setValue("leaseId", lease.id);
        setValue("amount", lease.rent_amount);
        generatePeriodOptions(lease.payment_frequency);
      }
    }
  }, [selectedLeaseId, leases, setValue]);

  const generatePeriodOptions = (frequency: string) => {
    let options: PeriodOption[] = [];
    switch (frequency) {
      case 'daily':
        options = Array.from({length: 31}, (_, i) => ({
          value: i + 1,
          label: `${i + 1} jour${i > 0 ? 's' : ''}`
        }));
        break;
      case 'weekly':
        [1, 2, 3, 4].forEach(weeks => {
          options.push({
            value: weeks,
            label: `${weeks} semaine${weeks > 1 ? 's' : ''}`
          });
        });
        break;
      case 'monthly':
        Array.from({length: 12}, (_, i) => {
          options.push({
            value: i + 1,
            label: `${i + 1} mois`
          });
        });
        break;
      case 'yearly':
        [1, 2, 3, 4, 5].forEach(years => {
          options.push({
            value: years,
            label: `${years} an${years > 1 ? 's' : ''}`
          });
        });
        break;
    }
    setPeriodOptions(options);
  };

  const onSubmit = async (data: PaymentFormData) => {
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
      await refetchLeases();

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

  const handleInitialPaymentsSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["leases"] });
    await refetchLeases();
    
    // Force refresh of selected lease data
    const updatedLease = leases.find(l => l.id === selectedLeaseId);
    if (updatedLease) {
      setSelectedLease({
        ...updatedLease,
        initial_payments_completed: true,
        initial_fees_paid: true
      });
    }
  };

  const filteredLeases = leases.filter(lease => lease.tenant_id === tenantId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <LeaseSelector
        leases={filteredLeases}
        selectedLeaseId={selectedLeaseId}
        onLeaseSelect={setSelectedLeaseId}
        isLoading={isLoadingLeases}
      />

      {selectedLease && !selectedLease.initial_payments_completed && (
        <InitialPaymentsForm
          leaseId={selectedLease.id}
          depositAmount={selectedLease.deposit_amount}
          rentAmount={selectedLease.rent_amount}
          onSuccess={handleInitialPaymentsSuccess}
          agencyId={agencyId}
        />
      )}

      {selectedLease && selectedLease.initial_payments_completed && (
        <>
          <PaymentDetails
            selectedLease={selectedLease}
            selectedPeriods={selectedPeriods}
          />

          <PeriodSelector
            periodOptions={periodOptions}
            selectedPeriods={selectedPeriods}
            onPeriodsChange={setSelectedPeriods}
          />

          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <PaymentMethodSelect
              value={watch("paymentMethod")}
              onChange={(value) => setValue("paymentMethod", value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Effectuer le paiement"
            )}
          </Button>
        </>
      )}
    </form>
  );
}