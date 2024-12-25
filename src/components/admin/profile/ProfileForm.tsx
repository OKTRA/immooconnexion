import { BasicInfoFields } from "./form/BasicInfoFields"
import { AgencySelect } from "./form/AgencySelect"
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
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSubmit,
  onCreateAuthUser,
  onUpdateProfile,
  selectedAgencyId,
  isEditing = false 
}: ProfileFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (step === 1) {
        if (onCreateAuthUser) {
          const newUserId = await onCreateAuthUser()
          setUserId(newUserId)
          setStep(2)
        }
      } else {
        if (onUpdateProfile) {
          await onUpdateProfile(userId)
        }
        if (onSubmit) {
          onSubmit()
        }
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
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
        step={step}
      />
      {step === 2 && (
        <AgencySelect 
          value={selectedAgencyId || newProfile?.agency_id || ''} 
          onChange={handleAgencyChange}
        />
      )}
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