import { TenantReceiptData } from "@/types/tenant";

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  contractId?: string;
  inspection?: {
    has_damages: boolean;
    damage_description?: string;
    repair_costs: number;
    deposit_returned: number;
  };
}

export function TenantReceipt({ 
  tenant, 
  isInitialReceipt, 
  isEndReceipt, 
  inspection,
  contractId 
}: TenantReceiptProps) {
  return (
    <div className="p-4 border rounded space-y-4">
      <div className="text-center border-b pb-4">
        <h3 className="text-lg font-semibold">
          {isEndReceipt ? "Reçu de fin de contrat" : "Reçu de paiement"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Date: {new Date().toLocaleDateString()}
        </p>
        {contractId && (
          <p className="text-sm text-muted-foreground">
            Contrat N°: {contractId}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p>
          <span className="font-medium">Nom:</span> {tenant.first_name} {tenant.last_name}
        </p>
        <p>
          <span className="font-medium">Téléphone:</span> {tenant.phone_number}
        </p>
        {tenant.profession && (
          <p>
            <span className="font-medium">Profession:</span> {tenant.profession}
          </p>
        )}
      </div>

      {tenant.agency_fees && (
        <div className="border-t pt-4">
          <p>
            <span className="font-medium">Frais d'agence:</span> {tenant.agency_fees.toLocaleString()} FCFA
          </p>
        </div>
      )}

      {tenant.lease && (
        <div className="border-t pt-4 space-y-2">
          <p>
            <span className="font-medium">Montant du loyer:</span> {tenant.lease.rent_amount.toLocaleString()} FCFA
          </p>
          <p>
            <span className="font-medium">Caution:</span> {tenant.lease.deposit_amount.toLocaleString()} FCFA
          </p>
        </div>
      )}

      {isEndReceipt && inspection && (
        <div className="border-t pt-4 space-y-2">
          <h4 className="font-medium">État des lieux</h4>
          <p>
            <span className="font-medium">Dégâts constatés:</span> {inspection.has_damages ? "Oui" : "Non"}
          </p>
          {inspection.has_damages && inspection.damage_description && (
            <p>
              <span className="font-medium">Description:</span> {inspection.damage_description}
            </p>
          )}
          {inspection.has_damages && (
            <p>
              <span className="font-medium">Coût des réparations:</span> {inspection.repair_costs.toLocaleString()} FCFA
            </p>
          )}
          <p>
            <span className="font-medium">Caution remboursée:</span> {inspection.deposit_returned.toLocaleString()} FCFA
          </p>
        </div>
      )}

      <div className="border-t pt-4 text-center text-sm text-muted-foreground">
        <p>Ce reçu fait office de preuve de paiement</p>
      </div>
    </div>
  );
}