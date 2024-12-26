import { BasicInfoFields } from "./form/BasicInfoFields"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSteppedForm } from "./hooks/useSteppedForm"

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
  isEditing = false,
}: ProfileFormProps) {
  const {
    step,
    isLoading,
    handleAuthStep,
    handleProfileStep
  } = useSteppedForm({
    onSuccess: onSubmit
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setNewProfile) return
    
    if (step === 1 && onCreateAuthUser) {
      await handleAuthStep(onCreateAuthUser)
    } else if (step === 2 && onUpdateProfile) {
      await handleProfileStep(onUpdateProfile)
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
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          isEditing
            ? step === 1
              ? "Mettre à jour l'authentification"
              : "Mettre à jour le profil"
            : step === 1 
              ? 'Suivant' 
              : 'Créer le profil'
        )}
      </Button>
    </form>
  )
}