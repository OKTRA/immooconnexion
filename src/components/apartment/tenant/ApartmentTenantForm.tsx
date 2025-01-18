import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ContactFields } from "./form/ContactFields";
import { LeaseFields } from "./form/LeaseFields";
import { PhotoUpload } from "./form/PhotoUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ApartmentTenantFormProps {
  unitId: string;
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  initialData?: any;
}

export function ApartmentTenantForm({
  unitId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData
}: ApartmentTenantFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: initialData?.first_name || "",
    lastName: initialData?.last_name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phone_number || "",
    birthDate: initialData?.birth_date || "",
    profession: initialData?.profession || "",
    rentAmount: "",
    depositAmount: "",
    startDate: "",
    endDate: "",
    paymentFrequency: "monthly",
    durationType: "fixed",
    photos: null as FileList | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single();

      if (!profile?.agency_id) throw new Error("Agency ID not found");

      // Upload photos if provided
      let photoUrls: string[] = [];
      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          const file = formData.photos[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('tenant_photos')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('tenant_photos')
              .getPublicUrl(uploadData.path);
            photoUrls.push(publicUrl);
          }
        }
      }

      // Create tenant with optimized query
      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          birth_date: formData.birthDate,
          photo_id_url: photoUrls.length > 0 ? photoUrls[0] : null,
          profession: formData.profession,
          agency_id: profile.agency_id,
          unit_id: unitId
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Create lease with simplified query
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenant.id,
          unit_id: unitId,
          start_date: formData.startDate,
          end_date: formData.durationType === "fixed" ? formData.endDate : null,
          rent_amount: parseInt(formData.rentAmount),
          deposit_amount: parseInt(formData.depositAmount),
          payment_frequency: formData.paymentFrequency,
          duration_type: formData.durationType,
          status: "active",
          agency_id: profile.agency_id
        });

      if (leaseError) throw leaseError;

      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[600px] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <ContactFields formData={formData} setFormData={setFormData} />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              placeholder="Profession du locataire"
            />
          </div>
        </div>

        <PhotoUpload onPhotosSelected={(files) => setFormData({ ...formData, photos: files })} />
        <LeaseFields formData={formData} setFormData={setFormData} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsSubmitting(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Chargement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </div>
  );
}