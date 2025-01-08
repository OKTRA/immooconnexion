import { ApartmentTenantReceipt } from "@/components/apartment/types"

export interface TenantReceiptProps {
  tenant: ApartmentTenantReceipt['tenant'];
  isEndReceipt?: boolean;
  lease?: ApartmentTenantReceipt['lease'];
  contractId?: string;
}

export function TenantReceipt({ tenant, isEndReceipt, lease, contractId }: TenantReceiptProps) {
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
  )
}