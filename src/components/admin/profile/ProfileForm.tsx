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
      if (!newProfile?.email || !newProfile?.password) {
        throw new Error("Email et mot de passe requis")
      }
      
      if (isEditing && onUpdateProfile) {
        await onUpdateProfile(newProfile.email)
      } else if (onCreateAuthUser) {
        try {
          await onCreateAuthUser()
        } catch (error: any) {
          // If the error is not about duplicate user, we still want to proceed
          if (!error.message?.includes("User already exists")) {
            throw error
          }
        }
      }

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
          selectedAgencyId={selectedAgencyId}
          newProfile={newProfile}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              isEditing
                ? "Mettre à jour"
                : "Créer le profil"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}