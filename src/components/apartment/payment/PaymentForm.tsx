import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaymentMethodSelect } from "./components/PaymentMethodSelect";
import { PaymentFormData } from "./types";
import { PaymentDetails } from "./components/PaymentDetails";
import { PeriodSelector } from "./components/PeriodSelector";
import { InitialPaymentsForm } from "./components/InitialPaymentsForm";
import { usePaymentSubmission } from "./hooks/usePaymentSubmission";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";

interface PaymentFormProps {
  onSuccess: () => void;
  leaseId: string;
  initialPayment?: boolean;
  isHistorical?: boolean;
}

export function PaymentForm({ 
  onSuccess, 
  leaseId, 
  initialPayment = false,
  isHistorical = false 
}: PaymentFormProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [selectedPeriodRange, setSelectedPeriodRange] = useState<{ start: Date; end: Date } | null>(null);

  const { data: lease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["lease-details", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:tenant_id (
            id,
            first_name,
            last_name
          ),
          unit:unit_id (
            id,
            unit_number,
            apartment:apartments (
              id,
              name
            )
          )
        `)
        .eq("id", leaseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!leaseId
  });

  const { register, handleSubmit, setValue, watch } = useForm<PaymentFormData>({
    defaultValues: {
      leaseId: leaseId || "",
      amount: 0,
      paymentMethod: "cash",
      paymentDate: new Date(),
      numberOfPeriods: 1,
      notes: "",
      isHistorical: isHistorical
    }
  });

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess);

  // Calculer la plage de dates en fonction du nombre de périodes sélectionnées
  useEffect(() => {
    if (lease) {
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, selectedPeriod - 1));
      setSelectedPeriodRange({ start, end });
      
      // Mettre à jour le montant total
      setValue('amount', lease.rent_amount * selectedPeriod);
    }
  }, [selectedPeriod, lease, setValue]);

  if (isLoadingLease) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Bail non trouvé
      </div>
    );
  }

  if (initialPayment) {
    return (
      <InitialPaymentsForm
        leaseId={lease.id}
        depositAmount={lease.deposit_amount}
        rentAmount={lease.rent_amount}
        onSuccess={onSuccess}
        agencyId={lease.agency_id}
      />
    );
  }

  const onSubmit = (data: PaymentFormData) => {
    if (lease && selectedPeriodRange) {
      submitPayment({
        ...data,
        periodStart: selectedPeriodRange.start,
        periodEnd: selectedPeriodRange.end,
        numberOfPeriods: selectedPeriod
      }, lease, selectedPeriod, lease.agency_id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PaymentDetails
        selectedLease={lease}
        selectedPeriods={selectedPeriod}
        isHistorical={isHistorical}
      />

      <PeriodSelector
        periodOptions={Array.from({ length: 12 }, (_, i) => ({
          value: i + 1,
          label: `${i + 1} période${i + 1 > 1 ? 's' : ''}`
        }))}
        selectedPeriods={selectedPeriod}
        onPeriodsChange={setSelectedPeriod}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
        selectedPeriodRange={selectedPeriodRange}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Méthode de paiement</Label>
          <PaymentMethodSelect
            value={watch("paymentMethod")}
            onChange={(value) => setValue("paymentMethod", value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            {...register("notes")}
            placeholder="Ajouter des notes sur le paiement..."
            className="min-h-[100px]"
          />
        </div>
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
    </form>
  );
}