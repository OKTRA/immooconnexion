import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionLimits, SubscriptionPlan } from "@/types/subscription";

export function useSubscriptionLimits() {
  const { data: limits } = useQuery({
    queryKey: ['subscription-limits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single();

      if (!profile?.agency_id) {
        throw new Error("No agency associated");
      }

      const { data: agency } = await supabase
        .from('agencies')
        .select(`
          current_properties_count,
          current_tenants_count,
          current_profiles_count,
          subscription_plan:subscription_plans (
            id,
            name,
            price,
            max_properties,
            max_tenants,
            max_users,
            features
          )
        `)
        .eq('id', profile.agency_id)
        .single();

      if (!agency) throw new Error("Agency not found");

      const plan = agency.subscription_plan as SubscriptionPlan;

      return {
        max_properties: plan?.max_properties ?? -1,
        max_tenants: plan?.max_tenants ?? -1,
        max_users: plan?.max_users ?? -1,
        current_properties: agency.current_properties_count,
        current_tenants: agency.current_tenants_count,
        current_users: agency.current_profiles_count,
      } as SubscriptionLimits;
    }
  });

  const checkLimitReached = async (type: "property" | "user" | "tenant") => {
    if (!limits) return false;

    switch (type) {
      case "property":
        return limits.max_properties !== -1 && limits.current_properties >= limits.max_properties;
      case "tenant":
        return limits.max_tenants !== -1 && limits.current_tenants >= limits.max_tenants;
      case "user":
        return limits.max_users !== -1 && limits.current_users >= limits.max_users;
      default:
        return false;
    }
  };

  return {
    limits,
    checkLimitReached
  };
}