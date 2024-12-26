import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProfileFormData } from "../types"

interface UseSteppedFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function useSteppedForm({ onSuccess, onClose }: UseSteppedFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({})
  const { toast } = useToast()

  const handleAuthStep = async (createAuthUser: () => Promise<string>) => {
    setIsLoading(true)
    try {
      const userId = await createAuthUser()
      setFormData(prev => ({ ...prev, id: userId }))
      setStep(2)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileStep = async (updateProfile: (userId: string) => Promise<void>) => {
    if (!formData.id) {
      toast({
        title: "Erreur",
        description: "ID utilisateur manquant",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await updateProfile(formData.id)
      toast({
        title: "Succès",
        description: "Le profil a été créé avec succès",
      })
      onSuccess?.()
      onClose?.()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    step,
    isLoading,
    formData,
    setFormData,
    handleAuthStep,
    handleProfileStep
  }
}