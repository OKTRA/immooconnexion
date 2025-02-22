
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SubscriptionPlan, SubscriptionLimits } from "@/types/payment";

export function useSubscriptionLimits() {
  const { data: planData } = useQuery({
    queryKey: ["subscription-plan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .single();

      if (error) throw error;

      const plan: SubscriptionPlan = {
        id: data.id,
        name: data.name,
        price: data.price,
        maxProperties: data.max_properties,
        maxTenants: data.max_tenants,
        maxUsers: data.max_users,
        features: data.features,
      };

      return plan;
    },
  });

  const { data: limitsData } = useQuery({
    queryKey: ["subscription-limits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_limits")
        .select("*")
        .single();

      if (error) throw error;

      const limits: SubscriptionLimits = {
        maxProperties: data.max_properties,
        maxTenants: data.max_tenants,
        maxUsers: data.max_users,
        currentProperties: data.current_properties,
        currentTenants: data.current_tenants,
        currentUsers: data.current_users,
      };

      return limits;
    },
  });

  const isNearLimit = (current: number, max: number) => {
    return current >= max * 0.8;
  };

  const hasReachedLimit = (current: number, max: number) => {
    return current >= max;
  };

  if (!planData || !limitsData) {
    return {
      isLoading: true,
      hasReachedPropertyLimit: false,
      hasReachedTenantLimit: false,
      hasReachedUserLimit: false,
      isNearPropertyLimit: false,
      isNearTenantLimit: false,
      isNearUserLimit: false,
    };
  }

  return {
    isLoading: false,
    hasReachedPropertyLimit: hasReachedLimit(
      limitsData.currentProperties,
      planData.maxProperties
    ),
    hasReachedTenantLimit: hasReachedLimit(
      limitsData.currentTenants,
      planData.maxTenants
    ),
    hasReachedUserLimit: hasReachedLimit(
      limitsData.currentUsers,
      planData.maxUsers
    ),
    isNearPropertyLimit: isNearLimit(
      limitsData.currentProperties,
      planData.maxProperties
    ),
    isNearTenantLimit: isNearLimit(
      limitsData.currentTenants,
      planData.maxTenants
    ),
    isNearUserLimit: isNearLimit(
      limitsData.currentUsers,
      planData.maxUsers
    ),
  };
}
