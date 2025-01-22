import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, SubscriptionLimits } from "@/types/subscription";

export function useSubscriptionLimits(agencyId: string) {
  const { data: limits } = useQuery({
    queryKey: ["subscription-limits", agencyId],
    queryFn: async () => {
      const { data: agency } = await supabase
        .from("agencies")
        .select(`
          current_properties_count,
          current_tenants_count,
          current_profiles_count,
          subscription_plans (
            max_properties,
            max_tenants,
            max_users
          )
        `)
        .eq("id", agencyId)
        .single();

      if (!agency) {
        throw new Error("Agency not found");
      }

      const plan = agency.subscription_plans as SubscriptionPlan;

      return {
        max_properties: plan?.max_properties ?? -1,
        max_tenants: plan?.max_tenants ?? -1,
        max_users: plan?.max_users ?? -1,
        current_properties: agency.current_properties_count ?? 0,
        current_tenants: agency.current_tenants_count ?? 0,
        current_users: agency.current_profiles_count ?? 0,
      } as SubscriptionLimits;
    },
  });

  const checkLimitReached = async (type: "property" | "user" | "tenant") => {
    if (!limits) return false;

    switch (type) {
      case "property":
        return (
          limits.max_properties !== -1 &&
          limits.current_properties >= limits.max_properties
        );
      case "tenant":
        return (
          limits.max_tenants !== -1 &&
          limits.current_tenants >= limits.max_tenants
        );
      case "user":
        return (
          limits.max_users !== -1 && 
          limits.current_users >= limits.max_users
        );
      default:
        return false;
    }
  };

  const checkDowngradeEligibility = (newPlan: SubscriptionPlan) => {
    if (!limits) return false;

    return (
      (newPlan.max_properties === -1 || limits.current_properties <= newPlan.max_properties) &&
      (newPlan.max_tenants === -1 || limits.current_tenants <= newPlan.max_tenants) &&
      (newPlan.max_users === -1 || limits.current_users <= newPlan.max_users)
    );
  };

  return {
    limits,
    checkLimitReached,
    checkDowngradeEligibility
  };
}