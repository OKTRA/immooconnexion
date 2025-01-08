import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2, Upload } from "lucide-react"

const inspectionSchema = z.object({
  has_damages: z.boolean().default(false),
  damage_description: z.string().optional(),
  repair_costs: z.number().min(0).default(0),
  deposit_returned: z.number().min(0).default(0),
  photo_urls: z.array(z.string()).default([]),
})

type InspectionFormData = z.infer<typeof inspectionSchema>

interface InspectionFormProps {
  lease: {
    id: string;
    deposit_amount?: number | null;
  };
  onSuccess?: () => void;
}

export function InspectionForm({ lease, onSuccess }: InspectionFormProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const depositAmount = lease.deposit_amount?.toString() || "0"

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      has_damages: false,
      damage_description: "",
      repair_costs: 0,
      deposit_returned: Number(depositAmount),
      photo_urls: [],
    },
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `inspection-photos/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('inspections')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('inspections')
            .getPublicUrl(filePath)
          
          uploadedUrls.push(publicUrl)
        }
      }

      const currentUrls = form.getValues('photo_urls')
      form.setValue('photo_urls', [...currentUrls, ...uploadedUrls])

      toast({
        title: "Photos téléchargées",
        description: "Les photos ont été téléchargées avec succès",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement des photos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: InspectionFormData) => {
    try {
      const { error } = await supabase
        .from('apartment_inspections')
        .insert({
          lease_id: lease.id,
          ...data,
        })

      if (error) throw error

      toast({
        title: "Inspection enregistrée",
        description: "L'inspection a été enregistrée avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="has_damages"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Dégâts constatés</FormLabel>
                <FormDescription>
                  Cochez si des dégâts ont été constatés lors de l'inspection
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch('has_damages') && (
          <>
            <FormField
              control={form.control}
              name="damage_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description des dégâts</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les dégâts constatés..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repair_costs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coûts de réparation (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="deposit_returned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant de la caution à rembourser (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Montant initial de la caution: {depositAmount} FCFA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo_urls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {field.value.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {field.value.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="rounded-md object-cover w-full h-32"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement en cours...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enregistrer l'inspection
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}