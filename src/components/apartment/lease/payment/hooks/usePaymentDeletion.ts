import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function usePaymentDeletion() {
  const queryClient = useQueryClient();

  const deletePayment = useMutation({
    mutationFn: async (paymentId: string) => {
      console.log("Deleting payment:", paymentId);
      
      const { error } = await supabase
        .from("apartment_lease_payments")
        .delete()
        .eq("id", paymentId);

      if (error) {
        console.error("Error deleting payment:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      // Invalider les requêtes pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["lease"] });
      queryClient.invalidateQueries({ queryKey: ["lease-payment-stats"] });
      
      toast({
        title: "Succès",
        description: "Le paiement a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Error in deletePayment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du paiement",
        variant: "destructive",
      });
    }
  });

  return {
    deletePayment
  };
}