import { BasicInfoFields } from "./form/BasicInfoFields"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

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
  const [currentStep, setCurrentStep] = useState(step)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setNewProfile) return
    
    setIsLoading(true)

    try {
      if (currentStep === 1) {
        if (onCreateAuthUser) {
          const userId = await onCreateAuthUser()
          console.log("Auth user created with ID:", userId)
          if (userId) {
            setNewProfile({ ...newProfile, id: userId })
            setCurrentStep(2)
          }
        } else if (setNewProfile) {
          await setNewProfile(newProfile)
          toast({
            title: "Succès",
            description: "Les informations d'authentification ont été mises à jour",
          })
        }
      } else if (currentStep === 2 && onUpdateProfile && newProfile.id) {
        await onUpdateProfile(newProfile.id)
        toast({
          title: "Succès",
          description: isEditing ? "Le profil a été mis à jour" : "Le profil a été créé avec succès",
        })
        if (onSubmit) {
          onSubmit()
        }
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du profil",
        variant: "destructive"
      })
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
        step={currentStep}
        selectedAgencyId={selectedAgencyId}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          isEditing
            ? currentStep === 1
              ? "Mettre à jour l'authentification"
              : "Mettre à jour le profil"
            : currentStep === 1 
              ? 'Suivant' 
              : 'Créer le profil'
        )}
      </Button>
    </form>
  )
}