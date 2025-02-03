import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { LeasePaymentViewProps } from "./types";
import { useState } from "react";
import { PaymentDialogs } from "./components/PaymentDialogs";
import { LeasePaymentHeader } from "./components/LeasePaymentHeader";
import { LeasePaymentStats } from "./components/LeasePaymentStats";
import { LeasePaymentContent } from "./components/LeasePaymentContent";

export function LeasePaymentView({ leaseId }: LeasePaymentViewProps) {
  const [showInitialPaymentDialog, setShowInitialPaymentDialog] = useState(false);
  const [showRegularPaymentDialog, setShowRegularPaymentDialog] = useState(false);

  const { data: lease, isLoading: isLoadingLease } = useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      console.log("Fetching lease data for:", leaseId);
      const { data: leaseData, error: leaseError } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants (
            id,
            first_name,
            last_name,
            phone_number,
            email,
            status
          ),
          unit:apartment_units (
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

      if (leaseError) throw leaseError;
      if (!leaseData) return null;

      const { data: payments, error: paymentsError } = await supabase
        .from("apartment_lease_payments")
        .select("*")
        .eq("lease_id", leaseId)
        .order("payment_date", { ascending: false });

      if (paymentsError) throw paymentsError;

      const initialPayments = payments?.filter(p => 
        p.payment_type === "deposit" || p.payment_type === "agency_fees"
      ).map(p => ({
        ...p,
        type: p.payment_type,
        displayStatus: p.payment_status_type || p.status
      })) || [];

      const regularPayments = payments?.filter(p => 
        p.payment_type !== "deposit" && p.payment_type !== "agency_fees"
      ).map(p => ({
        ...p,
        displayStatus: p.payment_status_type || p.status
      })) || [];

      return {
        ...leaseData,
        initialPayments,
        regularPayments
      };
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["lease-payment-stats", leaseId],
    queryFn: async () => {
      console.log("Fetching payment stats for lease:", leaseId);
      const { data: payments, error } = await supabase
        .from("apartment_lease_payments")
        .select("amount, status, due_date")
        .eq("lease_id", leaseId);

      if (error) throw error;

      return {
        totalReceived: payments?.filter(p => p.status === "paid")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        pendingAmount: payments?.filter(p => p.status === "pending")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        lateAmount: payments?.filter(p => p.status === "late")
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        latePayments: payments?.filter(p => p.status === "late").length || 0
      };
    }
  });

  if (isLoadingLease) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
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

  return (
    <div className="space-y-8">
      <LeasePaymentHeader
        lease={lease}
        onInitialPayment={() => setShowInitialPaymentDialog(true)}
        onRegularPayment={() => setShowRegularPaymentDialog(true)}
      />

      {stats && <LeasePaymentStats stats={stats} />}

      <LeasePaymentContent 
        lease={lease}
        initialPayments={lease.initialPayments || []}
        regularPayments={lease.regularPayments || []}
      />

      <PaymentDialogs
        lease={lease}
        showInitialPaymentDialog={showInitialPaymentDialog}
        showRegularPaymentDialog={showRegularPaymentDialog}
        onInitialDialogChange={setShowInitialPaymentDialog}
        onRegularDialogChange={setShowRegularPaymentDialog}
        onSuccess={() => {
          setShowInitialPaymentDialog(false);
          setShowRegularPaymentDialog(false);
        }}
      />
    </div>
  );
}