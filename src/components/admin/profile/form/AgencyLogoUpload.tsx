import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AgencyLogoUploadProps {
  agencyId: string | null
}

export function AgencyLogoUpload({ agencyId }: AgencyLogoUploadProps) {
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !agencyId) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product_photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product_photos')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('agencies')
        .update({ logo_url: publicUrl })
        .eq('id', agencyId)

      if (updateError) throw updateError

      toast({
        title: "Logo mis à jour",
        description: "Le logo de l'agence a été mis à jour avec succès",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du logo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="logo">Logo de l'agence (optionnel)</Label>
      <Input
        id="logo"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="cursor-pointer w-full"
      />
    </div>
  )
}