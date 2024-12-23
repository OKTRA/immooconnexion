import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface FeatureTogglesProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
  canShowPhoneNumber: boolean;
  canListProperties: boolean;
}

export function FeatureToggles({ 
  newProfile, 
  setNewProfile, 
  canShowPhoneNumber, 
  canListProperties 
}: FeatureTogglesProps) {
  return (
    <>
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
          disabled={!canListProperties}
        />
        <Label htmlFor="list_properties" className={!canListProperties ? "text-gray-400" : ""}>
          Lister les propriétés sur le site {!canListProperties && "(Nécessite un abonnement Professionnel ou supérieur)"}
        </Label>
      </div>
    </>
  );
}