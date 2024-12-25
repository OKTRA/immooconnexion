import { BasicInfoFields } from "./form/BasicInfoFields"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProfileFormProps {
  newProfile: any
  setNewProfile?: (profile: any) => void
  onSubmit?: () => void
  onCreateAuthUser?: () => Promise<string>
  onUpdateProfile?: (userId: string) => Promise<void>
  selectedAgencyId?: string
  isEditing?: boolean
  step?: 1 | 2
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSubmit,
  onCreateAuthUser,
  onUpdateProfile,
  selectedAgencyId,
  isEditing = false,
  step = 1
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (setNewProfile) {
        await setNewProfile(newProfile)
      }
      if (onSubmit) {
        onSubmit()
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (updatedProfile: any) => {
    if (setNewProfile) {
      setNewProfile({
        ...newProfile,
        ...updatedProfile,
        agency_id: selectedAgencyId
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields 
        newProfile={newProfile} 
        onProfileChange={handleProfileChange}
        isEditing={isEditing}
        step={step}
        selectedAgencyId={selectedAgencyId}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading 
          ? "Chargement..." 
          : step === 1 
            ? 'Suivant' 
            : isEditing 
              ? 'Enregistrer les modifications' 
              : 'Créer le profil'
        }
      </Button>
    </form>
  )
}