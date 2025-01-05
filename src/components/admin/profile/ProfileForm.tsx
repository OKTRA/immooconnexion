import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { ProfileFormProps } from "./types"
import { useState } from "react"

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSuccess,
  isEditing = false,
  step = 1,
  setStep,
  agencyId,
  onCreateAuthUser,
  onUpdateProfile,
  selectedAgencyId
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const form = useForm({
    defaultValues: newProfile
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (step === 1 && setStep) {
        // First step - validate email and password
        if (!newProfile?.email || !newProfile?.password) {
          throw new Error("Email et mot de passe requis")
        }
        
        if (isEditing && onUpdateProfile) {
          await onUpdateProfile(newProfile.email)
          setStep(2)
        } else if (onCreateAuthUser) {
          try {
            await onCreateAuthUser()
            setStep(2)
          } catch (error: any) {
            // If the error is not about duplicate user, we still want to move to step 2
            if (!error.message?.includes("User already exists")) {
              setStep(2)
            }
            throw error
          }
        }
      } else {
        // Second step - validate profile info
        if (!newProfile?.first_name || !newProfile?.last_name) {
          throw new Error("Nom et prénom requis")
        }

        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfileChange = (updatedProfile: Partial<typeof newProfile>) => {
    if (setNewProfile && newProfile) {
      setNewProfile({
        ...newProfile,
        ...updatedProfile,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoFields 
          form={form} 
          onProfileChange={handleProfileChange}
          isEditing={isEditing}
          step={step}
          selectedAgencyId={selectedAgencyId}
          newProfile={newProfile}
        />
        
        <div className="flex justify-between">
          {step === 2 && setStep && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}
          
          <Button type="submit" className="ml-auto" disabled={isSubmitting}>
            {isSubmitting ? (
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
    </Form>
  )
}