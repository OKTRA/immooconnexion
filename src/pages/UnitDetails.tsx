import { useParams } from "react-router-dom"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitTenantTab } from "@/components/apartment/unit/UnitTenantTab"
import { TenantPaymentsTab } from "@/components/apartment/tenant/TenantPaymentsTab"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function UnitDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const { data: unitDetails, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select(`
          *,
          apartment:apartments(name),
          current_lease:apartment_leases(
            *,
            tenant:apartment_tenants(*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id
  })

  const updateUnit = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('apartment_units')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-details', id] })
      toast({
        title: "Succès",
        description: "L'unité a été mise à jour avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  })

  const deleteUnit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('apartment_units')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'unité a été supprimée avec succès",
      })
      // Navigate back or refresh
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  })

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${id}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('apartment_photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('apartment_photos')
        .getPublicUrl(filePath)

      await updateUnit.mutateAsync({
        photo_url: publicUrl
      })

      toast({
        title: "Succès",
        description: "La photo a été téléchargée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = (status: string, hasActiveLease: boolean) => {
    if (hasActiveLease) {
      return <Badge variant="default">Occupé</Badge>
    }
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoadingUnit) {
    return (
      <AgencyLayout>
        <div className="container mx-auto py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </AgencyLayout>
    )
  }

  const currentTenant = unitDetails?.current_lease?.[0]?.tenant
  const hasActiveLease = currentTenant && unitDetails?.current_lease?.[0]?.status === 'active'

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Unité {unitDetails?.unit_number} - {unitDetails?.apartment?.name}
            </h1>
            <p className="text-muted-foreground">
              Détails et gestion de l'unité
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={handlePhotoUpload}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="tenant">Locataire</TabsTrigger>
            {currentTenant && <TabsTrigger value="payments">Paiements</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'unité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Numéro d'unité</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.unit_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Étage</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.floor_number || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surface</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.area || "-"} m²</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Loyer</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.rent_amount?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Caution</p>
                    <p className="text-sm text-muted-foreground">{unitDetails?.deposit_amount?.toLocaleString() || "-"} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Statut</p>
                    {getStatusBadge(unitDetails?.status, hasActiveLease)}
                  </div>
                </div>
                {unitDetails?.photo_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Photo</p>
                    <img 
                      src={unitDetails.photo_url} 
                      alt="Unit" 
                      className="rounded-lg max-w-md h-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenant">
            <UnitTenantTab unitId={id!} />
          </TabsContent>

          {currentTenant && (
            <TabsContent value="payments">
              <TenantPaymentsTab tenantId={currentTenant.id} />
            </TabsContent>
          )}
        </Tabs>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement l'unité et toutes les données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteUnit.mutate()}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AgencyLayout>
  )
}