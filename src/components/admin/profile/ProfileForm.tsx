import { BasicInfoFields } from "./form/BasicInfoFields"
import { AgencySelect } from "./form/AgencySelect"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  newProfile: any;
  setNewProfile?: (profile: any) => void;
  onSubmit?: () => void;
  selectedAgencyId?: string;
  isEditing?: boolean;
}

export function ProfileForm({ 
  newProfile, 
  setNewProfile, 
  onSubmit, 
  selectedAgencyId,
  isEditing = false 
}: ProfileFormProps) {
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", newProfile)

    try {
      // Update or create profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: newProfile.id,
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          email: newProfile.email,
          phone_number: newProfile.phone_number,
          agency_id: newProfile.agency_id || selectedAgencyId,
          role: 'user'
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été enregistré avec succès",
      })

      if (onSubmit) {
        onSubmit()
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    }
  }

  const handleAgencyChange = (value: string) => {
    console.log("Agency changed to:", value)
    if (setNewProfile) {
      setNewProfile({ 
        ...newProfile, 
        agency_id: value 
      })
    }
  }

  const handleProfileChange = (updatedProfile: any) => {
    console.log("Profile updated:", updatedProfile)
    if (setNewProfile) {
      setNewProfile({
        ...newProfile,
        ...updatedProfile
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto px-4 md:px-0">
      <BasicInfoFields 
        newProfile={newProfile} 
        onProfileChange={handleProfileChange}
        isEditing={isEditing}
      />
      <AgencySelect 
        value={selectedAgencyId || newProfile?.agency_id || ''} 
        onChange={handleAgencyChange}
      />
      <Button type="submit" className="w-full">
        {isEditing ? 'Enregistrer' : 'Ajouter'}
      </Button>
    </form>
  )
}