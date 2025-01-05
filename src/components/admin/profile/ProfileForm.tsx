import { BasicInfoFields } from "./form/BasicInfoFields"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Steps } from "./form/Steps"
import { UserRole } from "@/types/profile"

interface ProfileFormProps {
  newProfile?: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone_number: string
    role: UserRole
  }
  setNewProfile?: (profile: any) => void
  onSuccess?: () => void
  onCreateAuthUser?: () => Promise<string>
  onUpdateProfile?: (userId: string) => Promise<void>
  selectedAgencyId?: string
  isEditing?: boolean
  step?: 1 | 2
  setStep?: (step: 1 | 2) => void
  agencyId?: string
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSuccess,
  onCreateAuthUser,
  onUpdateProfile,
  selectedAgencyId,
  isEditing = false,
  step = 1,
  setStep,
  agencyId
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setNewProfile) return
    
    setIsLoading(true)

    try {
      if (step === 1) {
        if (onCreateAuthUser) {
          const userId = await onCreateAuthUser()
          console.log("Auth user created with ID:", userId)
          if (userId) {
            setNewProfile({ ...newProfile, id: userId })
            setStep?.(2)
          }
        } else if (setNewProfile) {
          await setNewProfile(newProfile)
          toast({
            title: "Succès",
            description: "Les informations d'authentification ont été mises à jour",
          })
        }
      } else if (step === 2 && onUpdateProfile && newProfile?.id) {
        await onUpdateProfile(newProfile.id)
        toast({
          title: "Succès",
          description: isEditing ? "Le profil a été mis à jour" : "Le profil a été créé avec succès",
        })
        if (onSuccess) {
          onSuccess()
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
        agency_id: selectedAgencyId || agencyId
      })
    }
  }

  return (
    <div className="space-y-6">
      <Steps currentStep={step} />
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
        <BasicInfoFields 
          newProfile={newProfile} 
          onProfileChange={handleProfileChange}
          isEditing={isEditing}
          step={step}
          selectedAgencyId={selectedAgencyId || agencyId}
        />
        
        <div className="flex justify-between">
          {step === 2 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setStep?.(1)}
              disabled={isLoading}
            >
              Retour
            </Button>
          )}
          
          <Button type="submit" className="ml-auto" disabled={isLoading}>
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
        </div>
      </form>
    </div>
  )
}