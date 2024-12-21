import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TenantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: any;
}

export function TenantsDialog({ open, onOpenChange, tenant }: TenantsDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    photoId: null as File | null,
  });
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (tenant) {
      setFormData({
        ...tenant,
        photoId: null,
      });
      if (tenant.photoIdUrl) {
        setPreviewUrl(tenant.photoIdUrl);
      }
    } else {
      setFormData({
        nom: "",
        prenom: "",
        dateNaissance: "",
        email: "",
        telephone: "",
        photoId: null,
      });
      setPreviewUrl("");
    }
  }, [tenant]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoId: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: tenant ? "Locataire modifié" : "Locataire ajouté",
      description: tenant
        ? "Le locataire a été modifié avec succès."
        : "Le locataire a été ajouté avec succès.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              {tenant ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}