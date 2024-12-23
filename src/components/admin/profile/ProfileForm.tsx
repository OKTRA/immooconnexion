import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfilePlanSelect } from "./ProfilePlanSelect"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
}

export function ProfileForm({ newProfile, setNewProfile }: ProfileFormProps) {
  // Fetch subscription plans to check features
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

  // Check if the current plan allows showing phone number
  const canShowPhoneNumber = subscriptionPlan?.features?.includes("show_phone_on_site");

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={newProfile.email}
          onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={newProfile.first_name}
          onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          value={newProfile.last_name}
          onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Numéro de téléphone</Label>
        <Input
          id="phone_number"
          value={newProfile.phone_number}
          onChange={(e) => setNewProfile({ ...newProfile, phone_number: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="agency_name">Nom de l'agence</Label>
        <Input
          id="agency_name"
          value={newProfile.agency_name}
          onChange={(e) => setNewProfile({ ...newProfile, agency_name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select
          value={newProfile.role}
          onValueChange={(value) => setNewProfile({ ...newProfile, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProfilePlanSelect 
        value={newProfile.subscription_plan_id} 
        onValueChange={(value) => setNewProfile({ ...newProfile, subscription_plan_id: value })}
      />
      <div className="flex items-center space-x-2">
        <Switch
          id="show_phone"
          checked={newProfile.show_phone_on_site}
          onCheckedChange={(checked) => 
            setNewProfile({ ...newProfile, show_phone_on_site: checked })
          }
          disabled={!canShowPhoneNumber}
        />
        <Label htmlFor="show_phone" className={!canShowPhoneNumber ? "text-gray-400" : ""}>
          Afficher le numéro sur le site {!canShowPhoneNumber && "(Nécessite un abonnement supérieur)"}
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="list_properties"
          checked={newProfile.list_properties_on_site}
          onCheckedChange={(checked) => 
            setNewProfile({ ...newProfile, list_properties_on_site: checked })
          }
        />
        <Label htmlFor="list_properties">Lister les propriétés sur le site</Label>
      </div>
    </div>
  );
}