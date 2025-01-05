import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProfileSettingsTabProps {
  profileData: any
  onProfileUpdate: (data: any) => void
}

export function ProfileSettingsTab({ profileData, onProfileUpdate }: ProfileSettingsTabProps) {
  const { toast } = useToast()

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
          email: profileData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileData.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="first_name" className="text-right">
            Prénom
          </Label>
          <Input
            id="first_name"
            value={profileData?.first_name || ''}
            onChange={(e) => onProfileUpdate({ ...profileData, first_name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="last_name" className="text-right">
            Nom
          </Label>
          <Input
            id="last_name"
            value={profileData?.last_name || ''}
            onChange={(e) => onProfileUpdate({ ...profileData, last_name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            value={profileData?.email || ''}
            onChange={(e) => onProfileUpdate({ ...profileData, email: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Téléphone
          </Label>
          <Input
            id="phone"
            value={profileData?.phone_number || ''}
            onChange={(e) => onProfileUpdate({ ...profileData, phone_number: e.target.value })}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleProfileUpdate}>
          Mettre à jour le profil
        </Button>
      </div>
    </div>
  )
}