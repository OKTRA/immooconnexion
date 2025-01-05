import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Profile } from "../types"
import { AuthInfoFields } from "./AuthInfoFields"
import { ProfileInfoFields } from "./ProfileInfoFields"
import { useSteppedForm } from "./useSteppedForm"

interface SteppedProfileFormProps {
  initialData: Profile
  onSuccess: () => void
  onClose: () => void
  isEditing?: boolean
}

export function SteppedProfileForm({
  initialData,
  onSuccess,
  onClose,
  isEditing = false
}: SteppedProfileFormProps) {
  const form = useForm({
    defaultValues: initialData
  })

  const {
    currentStep,
    formData,
    isSubmitting,
    previousStep,
    updateFormData,
    handleSubmit
  } = useSteppedForm({
    initialData,
    onSuccess,
    onClose
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 ? (
          <AuthInfoFields
            form={form}
            formData={formData}
            onFormDataChange={updateFormData}
            isEditing={isEditing}
          />
        ) : (
          <ProfileInfoFields
            form={form}
            formData={formData}
            onFormDataChange={updateFormData}
          />
        )}
        
        <div className="flex justify-between">
          {currentStep === 2 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={previousStep}
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
                ? currentStep === 1
                  ? "Mettre à jour l'authentification"
                  : "Mettre à jour le profil"
                : currentStep === 1 
                  ? 'Suivant' 
                  : 'Créer le profil'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}