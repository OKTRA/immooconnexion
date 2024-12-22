import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TenantFormFieldsProps {
  formData: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    telephone: string;
    photoId: File | null;
    fraisAgence: string;
    propertyId: string;
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
  return (
    <div className="grid grid-cols-2 gap-4">
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
      <div className="space-y-2">
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