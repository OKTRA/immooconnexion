import { useState } from "react"
import { Profile } from "../types"

interface UseSteppedFormProps {
  initialData: Profile
  onSuccess: () => void
  onClose: () => void
}

export function useSteppedForm({ initialData, onSuccess, onClose }: UseSteppedFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Profile>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2))
  }

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const updateFormData = (data: Partial<Profile>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      // Validate first step (auth info)
      if (!formData.email || !formData.password) {
        throw new Error("Email et mot de passe requis")
      }
      nextStep()
      return
    }

    // Validate second step (profile info)
    if (!formData.first_name || !formData.last_name) {
      throw new Error("Nom et prénom requis")
    }

    try {
      setIsSubmitting(true)
      await onSuccess()
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    formData,
    isSubmitting,
    nextStep,
    previousStep,
    updateFormData,
    handleSubmit
  }
}