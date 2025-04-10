import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TenantFormFieldsProps {
  formData: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    telephone: string;
    photoId: File | null;
    fraisAgence: string;
    propertyId: string;
    profession: string;
  };
  setFormData: (data: any) => void;
  properties: any[];
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string;
}

export function TenantFormFields({
  formData,
  setFormData,
  properties,
  handlePhotoChange,
  previewUrl,
}: TenantFormFieldsProps) {
  const { data: selectedProperty } = useQuery({
    queryKey: ['property', formData.propertyId],
    queryFn: async () => {
      if (!formData.propertyId) return null;
      const { data, error } = await supabase
        .from('properties')
        .select('*, agencies(name)')
        .eq('id', formData.propertyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!formData.propertyId
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateNaissance">Date de Naissance</Label>
        <Input
          id="dateNaissance"
          type="date"
          value={formData.dateNaissance}
          onChange={(e) =>
            setFormData({ ...formData, dateNaissance: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          value={formData.telephone}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="propertyId">Propriété</Label>
        <Select
          value={formData.propertyId}
          onValueChange={(value) => setFormData({ ...formData, propertyId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une propriété" />
          </SelectTrigger>
          <SelectContent>
            {properties?.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.bien} - {property.ville}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedProperty && (
        <>
          <div className="space-y-2">
            <Label>Loyer mensuel</Label>
            <Input
              value={`${selectedProperty.loyer?.toLocaleString()} FCFA`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Caution</Label>
            <Input
              value={`${selectedProperty.caution?.toLocaleString()} FCFA`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Agence</Label>
            <Input
              value={selectedProperty.agencies?.name || ''}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="fraisAgence">Frais d'Agence (FCFA)</Label>
        <Input
          id="fraisAgence"
          type="number"
          value={formData.fraisAgence}
          onChange={(e) =>
            setFormData({ ...formData, fraisAgence: e.target.value })
          }
          placeholder="Montant négocié avec le locataire"
          required
        />
      </div>
      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label htmlFor="photoId">Photo d'identité</Label>
        <Input
          id="photoId"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="cursor-pointer"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Aperçu de la photo d'identité"
            className="mt-2 max-h-32 object-contain"
          />
        )}
      </div>
    </div>
  );
}