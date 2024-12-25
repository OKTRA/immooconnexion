import React from 'react';
import { ReceiptHeader } from './receipt/ReceiptHeader';
import { ReceiptTable } from './receipt/ReceiptTable';
import { ReceiptActions } from './receipt/ReceiptActions';

interface TenantReceiptProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
    fraisAgence: string;
    propertyId: string;
    profession?: string;  // Make profession optional
  };
}

export function TenantReceipt({ tenant }: TenantReceiptProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <ReceiptHeader />
      <ReceiptTable 
        tenant={{
          fraisAgence: tenant.fraisAgence,
          profession: tenant.profession
        }} 
        propertyId={tenant.propertyId} 
      />
      <ReceiptActions />
    </div>
  );
}