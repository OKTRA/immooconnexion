import React from 'react';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./form/BasicInfoFields"
import { ProfileFormProps } from "./types"

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSuccess,
  isEditing = false,
  onCreateAuthUser,
  onUpdateProfile,
  isSubmitting = false
}: ProfileFormProps) {
  const { toast } = useToast()
  const form = useForm({
    defaultValues: newProfile,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      if (!newProfile?.email) {
        throw new Error("Email requis")
      }
      
      if (isEditing && onUpdateProfile) {
        await onUpdateProfile(newProfile.id)
      } else if (onCreateAuthUser) {
        await onCreateAuthUser()
      }

      toast({
        title: "Succès",
        description: isEditing ? "Profil mis à jour" : "Profil créé",
      })

      if (onSuccess) {
        await onSuccess()
      }

      // Only reset form if creating new profile, not when editing
      if (!isEditing) {
        form.reset()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoFields 
          form={form} 
          onProfileChange={(updatedFields) => {
            setNewProfile({
              ...newProfile,
              ...updatedFields
            })
          }}
          isEditing={isEditing}
          newProfile={newProfile}
          showPasswordField={true}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Création..."}
              </>
            ) : (
              isEditing ? "Mettre à jour" : "Créer le profil"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}