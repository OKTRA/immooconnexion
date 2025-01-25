import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePaymentForm } from "./hooks/usePaymentForm";
import { PaymentMethodSelect } from "./components/PaymentMethodSelect";
import { PaymentFormData } from "./types";
import { PaymentDetails } from "./components/PaymentDetails";
import { PeriodSelector } from "./components/PeriodSelector";
import { InitialPaymentsForm } from "./components/InitialPaymentsForm";
import { useLeaseSelection } from "./hooks/useLeaseSelection";
import { usePeriodManagement } from "./hooks/usePeriodManagement";
import { usePaymentSubmission } from "./hooks/usePaymentSubmission";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

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
        .maybeSingle()

      if (error) throw error
      return data
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

  const {
    periodOptions,
    generatePeriodOptions
  } = usePeriodManagement();

  const { isSubmitting, handleSubmit: submitPayment } = usePaymentSubmission(onSuccess);

  useEffect(() => {
    if (lease) {
      generatePeriodOptions(lease.start_date, lease.payment_frequency);
    }
  }, [lease, generatePeriodOptions]);

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
    if (lease) {
      submitPayment(data, lease, selectedPeriod, lease.agency_id);
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
        periodOptions={periodOptions}
        selectedPeriods={selectedPeriod}
        onPeriodsChange={setSelectedPeriod}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Date de paiement</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !paymentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {paymentDate ? (
                  format(paymentDate, "P", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={paymentDate}
                onSelect={(date) => {
                  if (date) {
                    setPaymentDate(date);
                    setValue("paymentDate", date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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