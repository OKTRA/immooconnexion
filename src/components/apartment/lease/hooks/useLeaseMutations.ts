import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface InitialPaymentsParams {
  leaseId: string;
  depositAmount: number;
  rentAmount: number;
  firstRentStartDate: Date;
}

export function useLeaseMutations() {
  const queryClient = useQueryClient();

  const handleInitialPayments = useMutation({
    mutationFn: async ({ 
      leaseId, 
      depositAmount, 
      rentAmount,
      firstRentStartDate 
    }: InitialPaymentsParams) => {
      try {
        console.log("Starting initial payments with params:", {
          leaseId,
          depositAmount,
          rentAmount,
          firstRentStartDate: firstRentStartDate.toISOString()
        });

        const { data: leaseData, error: leaseError } = await supabase
          .from('apartment_leases')
          .select('agency_id, payment_frequency')
          .eq('id', leaseId)
          .single();

        if (leaseError) {
          console.error("Error fetching lease:", leaseError);
          throw leaseError;
        }

        if (!leaseData?.agency_id) {
          console.error("No agency ID found for lease");
          throw new Error('Agency ID not found');
        }

        // Insérer le paiement de dépôt avec first_rent_start_date
        console.log("Creating deposit payment...");
        const { error: depositError } = await supabase.rpc(
          'create_lease_payment',
          {
            p_lease_id: leaseId,
            p_amount: depositAmount,
            p_payment_type: 'deposit',
            p_payment_method: 'cash',
            p_payment_date: new Date().toISOString().split('T')[0],
            p_period_start: new Date().toISOString().split('T')[0],
            p_period_end: new Date().toISOString().split('T')[0],
            p_notes: 'Initial deposit payment'
          }
        );

        if (depositError) {
          console.error("Error creating deposit payment:", depositError);
          throw depositError;
        }

        // Insérer les frais d'agence
        console.log("Creating agency fees payment...");
        const { error: feesError } = await supabase.rpc(
          'create_lease_payment',
          {
            p_lease_id: leaseId,
            p_amount: Math.round(rentAmount * 0.5),
            p_payment_type: 'agency_fees',
            p_payment_method: 'cash',
            p_payment_date: new Date().toISOString().split('T')[0],
            p_period_start: new Date().toISOString().split('T')[0],
            p_period_end: new Date().toISOString().split('T')[0],
            p_notes: 'Initial agency fees'
          }
        );

        if (feesError) {
          console.error("Error creating agency fees payment:", feesError);
          throw feesError;
        }

        // Mettre à jour le statut du bail
        console.log("Updating lease status...");
        const { error: updateError } = await supabase
          .from('apartment_leases')
          .update({
            initial_fees_paid: true,
            initial_payments_completed: true
          })
          .eq('id', leaseId);

        if (updateError) {
          console.error("Error updating lease status:", updateError);
          throw updateError;
        }

        console.log("Initial payments completed successfully");
        return true;
      } catch (error) {
        console.error("Error in handleInitialPayments:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lease"] });
      queryClient.invalidateQueries({ queryKey: ["lease-payment-stats"] });
      toast({
        title: "Succès",
        description: "Les paiements initiaux ont été enregistrés avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Error handling initial payments:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paiements initiaux",
        variant: "destructive",
      });
    }
  });

  return {
    handleInitialPayments
  };
}