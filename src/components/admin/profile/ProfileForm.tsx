import { BasicInfoFields } from "./form/BasicInfoFields"
import { AgencySelect } from "./form/AgencySelect"
import { Button } from "@/components/ui/button"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile?: (profile: any) => void;
  onSubmit?: () => void;
  selectedAgencyId?: string;
  isEditing?: boolean;
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSubmit, 
  selectedAgencyId,
  isEditing = false 
}: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", newProfile)
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleAgencyChange = (value: string) => {
    console.log("Agency changed to:", value)
    if (setNewProfile) {
      setNewProfile({ 
        ...newProfile, 
        agency_id: value 
      })
    }
  }

  const handleProfileChange = (updatedProfile: any) => {
    console.log("Profile updated:", updatedProfile)
    if (setNewProfile) {
      setNewProfile({
        ...newProfile,
        ...updatedProfile
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields 
        newProfile={newProfile} 
        onProfileChange={handleProfileChange}
        isEditing={isEditing}
      />
      <AgencySelect 
        value={selectedAgencyId || newProfile?.agency_id || ''} 
        onChange={handleAgencyChange}
      />
      <Button type="submit" className="w-full">
        {isEditing ? 'Enregistrer' : 'Ajouter'}
      </Button>
    </form>
  )
}