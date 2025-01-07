import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTenantPayments(tenantId?: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["tenant-payments", tenantId],
    queryFn: async () => {
      if (!tenantId) return null;

      // Fetch lease payments
      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases (
            tenant_id,
            unit_id,
            rent_amount,
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId)
        .order("due_date", { ascending: false });

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements",
          variant: "destructive",
        });
        throw paymentsError;
      }

      // Fetch late payment fees
      const { data: lateFees, error: lateFeesError } = await supabase
        .from("late_payment_fees")
        .select(`
          *,
          apartment_leases!late_payment_fees_lease_id_fkey (
            tenant_id,
            apartment_tenants (
              first_name,
              last_name
            )
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId)
        .order("created_at", { ascending: false });

      if (lateFeesError) {
        console.error("Error fetching late fees:", lateFeesError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les pénalités de retard",
          variant: "destructive",
        });
        throw lateFeesError;
      }

      // Fetch notifications
      const { data: notifications, error: notificationsError } = await supabase
        .from("payment_notifications")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

      if (notificationsError) {
        console.error("Error fetching notifications:", notificationsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les notifications",
          variant: "destructive",
        });
        throw notificationsError;
      }

      return {
        payments: payments || [],
        lateFees: lateFees || [],
        notifications: notifications || [],
      };
    },
    enabled: !!tenantId,
  });
}