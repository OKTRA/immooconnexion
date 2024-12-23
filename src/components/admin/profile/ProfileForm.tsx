import { BasicInfoFields } from "./form/BasicInfoFields"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
}

export function ProfileForm({ newProfile, setNewProfile }: ProfileFormProps) {
  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields newProfile={newProfile} setNewProfile={setNewProfile} />
    </div>
  );
}