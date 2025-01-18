import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAgencies } from "@/hooks/useAgencies"

const apartmentFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  description: z.string().optional(),
  owner_id: z.string().min(1, "Le propriétaire est requis"),
})

type ApartmentFormData = z.infer<typeof apartmentFormSchema>

export interface ApartmentFormProps {
  onSuccess?: () => void
  initialData?: {
    id?: string
    name: string
    address: string
    description?: string
    owner_id?: string
  }
  isEditing?: boolean
  owners: Array<{
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }>
}

export function ApartmentForm({ onSuccess, initialData, isEditing = false, owners }: ApartmentFormProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { agencyId } = useAgencies()
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const form = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      description: "",
      owner_id: "",
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setPhotos(files)
      const urls = Array.from(files).map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  async function uploadPhotos(apartmentId: string) {
    if (!photos) return []

    const uploadPromises = Array.from(photos).map(async (photo) => {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${apartmentId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('apartment_photos')
        .upload(filePath, photo)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('apartment_photos')
        .getPublicUrl(filePath)

      return publicUrl
    })

    return Promise.all(uploadPromises)
  }

  async function onSubmit(data: ApartmentFormData) {
    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from("apartments")
          .update({
            name: data.name,
            address: data.address,
            description: data.description,
            owner_id: data.owner_id,
          })
          .eq("id", initialData.id)

        if (error) throw error

        if (photos) {
          await uploadPhotos(initialData.id)
        }

        toast({
          title: "Appartement modifié",
          description: "L'appartement a été modifié avec succès",
        })
      } else {
        const { data: apartment, error } = await supabase
          .from("apartments")
          .insert([{
            name: data.name,
            address: data.address,
            description: data.description,
            agency_id: agencyId,
            owner_id: data.owner_id,
          }])
          .select()
          .single()

        if (error) throw error

        if (photos && apartment) {
          await uploadPhotos(apartment.id)
        }

        toast({
          title: "Appartement créé",
          description: "L'appartement a été créé avec succès",
        })
      }

      queryClient.invalidateQueries({ queryKey: ["apartments"] })
      onSuccess?.()
      if (!isEditing) {
        navigate("/agence/appartements")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="owner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propriétaire</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un propriétaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.first_name} {owner.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'appartement</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Résidence Les Palmiers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123 Rue de la Paix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de l'appartement..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="photos">Photos</Label>
          <Input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="cursor-pointer"
          />
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <Button type="submit">
          {isEditing ? "Modifier" : "Créer"} l'appartement
        </Button>
      </form>
    </Form>
  )
}