import { BasicInfoFields } from "./form/BasicInfoFields"
import { AgencySelect } from "./form/AgencySelect"
import { Button } from "@/components/ui/button"

interface Profile {
  email?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  agency_id?: string
}

interface ProfileFormProps {
  newProfile: Profile
  setNewProfile: (profile: Profile) => void
  onSubmit?: () => void
  selectedAgencyId?: string
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSubmit, 
  selectedAgencyId 
}: ProfileFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit?.()
    }} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields newProfile={newProfile} setNewProfile={setNewProfile} />
      {!selectedAgencyId && (
        <AgencySelect 
          value={newProfile.agency_id || ''} 
          onChange={(value) => setNewProfile({ ...newProfile, agency_id: value })}
        />
      )}
      {onSubmit && (
        <Button type="submit" className="w-full">
          Ajouter
        </Button>
      )}
    </form>
  )
}