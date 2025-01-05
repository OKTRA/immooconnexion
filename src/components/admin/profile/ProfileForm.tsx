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
  handleSubmit: onSubmit,
  selectedAgencyId,
  onUpdateProfile,
  onCreateAuthUser
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const form = useForm({
    defaultValues: newProfile
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setNewProfile || !onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(e)
      if (onSuccess) {
        onSuccess()
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