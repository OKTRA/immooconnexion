import { TenantReceiptData } from "@/types/tenant";

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  lease?: {
    rent_amount: number;
    deposit_amount: number;
  };
}

export function TenantReceipt({ tenant, isInitialReceipt, isEndReceipt, lease }: TenantReceiptProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">
        Reçu {isEndReceipt ? "de fin de contrat" : ""}
      </h3>
      <div className="space-y-2">
        <p>Nom: {tenant.first_name} {tenant.last_name}</p>
        <p>Téléphone: {tenant.phone_number}</p>
        {tenant.agency_fees && <p>Frais d'agence: {tenant.agency_fees} FCFA</p>}
        {lease && (
          <>
            <p>Montant du loyer: {lease.rent_amount} FCFA</p>
            <p>Caution: {lease.deposit_amount} FCFA</p>
          </>
        )}
      </div>
    </div>
  );
}