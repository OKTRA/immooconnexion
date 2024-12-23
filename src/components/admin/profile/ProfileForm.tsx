import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { RoleSelect } from "./form/RoleSelect"
import { ProfilePlanSelect } from "./ProfilePlanSelect"
import { FeatureToggles } from "./form/FeatureToggles"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
}

export function ProfileForm({ newProfile, setNewProfile }: ProfileFormProps) {
  const { data: subscriptionPlan } = useQuery({
    queryKey: ["subscription-plan", newProfile.subscription_plan_id],
    queryFn: async () => {
      if (!newProfile.subscription_plan_id) return null;
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", newProfile.subscription_plan_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!newProfile.subscription_plan_id,
  });

  const canShowPhoneNumber = subscriptionPlan?.features?.includes("show_phone_on_site");
  const canListProperties = subscriptionPlan?.name === "Professionnel" || subscriptionPlan?.name === "Enterprise";

  return (
    <div className="space-y-4">
      <BasicInfoFields newProfile={newProfile} setNewProfile={setNewProfile} />
      <RoleSelect 
        value={newProfile.role} 
        onValueChange={(value) => setNewProfile({ ...newProfile, role: value })} 
      />
      <ProfilePlanSelect 
        value={newProfile.subscription_plan_id} 
        onValueChange={(value) => setNewProfile({ ...newProfile, subscription_plan_id: value })}
      />
      <FeatureToggles 
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        canShowPhoneNumber={canShowPhoneNumber}
        canListProperties={canListProperties}
      />
    </div>
  );
}