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
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || null,
    profession: initialData?.profession || "",
    rent_amount: initialData?.rent_amount?.toString() || "",
    deposit_amount: initialData?.deposit_amount?.toString() || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    payment_frequency: initialData?.payment_frequency || "monthly",
    duration_type: initialData?.duration_type || "fixed",
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

      // Create tenant with proper date handling
      const tenantData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || null,
        phone_number: formData.phone_number,
        birth_date: formData.birth_date || null,
        photo_id_url: photoUrls.length > 0 ? photoUrls[0] : null,
        profession: formData.profession || null,
        agency_id: profile.agency_id,
        unit_id: unitId
      };

      const { data: tenant, error: tenantError } = await supabase
        .from("apartment_tenants")
        .insert(tenantData)
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Create lease with proper date handling
      const leaseData = {
        tenant_id: tenant.id,
        unit_id: unitId,
        start_date: formData.start_date || null,
        end_date: formData.duration_type === "fixed" ? formData.end_date || null : null,
        rent_amount: parseInt(formData.rent_amount) || 0,
        deposit_amount: parseInt(formData.deposit_amount) || 0,
        payment_frequency: formData.payment_frequency,
        duration_type: formData.duration_type,
        status: "active",
        agency_id: profile.agency_id
      };

      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert(leaseData);

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