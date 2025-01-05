import { ProfileForm } from "../profile/ProfileForm"

interface AuthSettingsTabProps {
  profile: any
  onProfileUpdate: () => void
}

export function AuthSettingsTab({ profile, onProfileUpdate }: AuthSettingsTabProps) {
  return (
    <ProfileForm
      newProfile={profile}
      isEditing={true}
      onUpdateProfile={onProfileUpdate}
    />
  )
}