import { BasicInfoFields } from "./form/BasicInfoFields"
import { AgencySelect } from "./form/AgencySelect"
import { Button } from "@/components/ui/button"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
  onSubmit?: () => void;
  selectedAgencyId?: string;
}

export function ProfileForm({ newProfile, setNewProfile, onSubmit, selectedAgencyId }: ProfileFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields newProfile={newProfile} setNewProfile={setNewProfile} />
      <AgencySelect 
        value={selectedAgencyId || newProfile.agency_id || ''} 
        onChange={(value) => setNewProfile({ ...newProfile, agency_id: value })}
      />
      <Button type="submit" className="w-full">
        Ajouter
      </Button>
    </form>
  );
}