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
    profession?: string;
  };
  contractId?: string;
  isEndOfContract?: boolean;
  inspection?: any;
}

export function TenantReceipt({ tenant, contractId, isEndOfContract, inspection }: TenantReceiptProps) {
  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const style = document.createElement('style');
    style.textContent = `
      @page {
        size: portrait;
        margin: 2cm;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 40px;
        line-height: 1.6;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f8f9fa;
      }
      .signature {
        margin-top: 50px;
        text-align: right;
      }
    `;

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de ${isEndOfContract ? 'Fin de Contrat' : 'Paiement'}</title>
          ${style.outerHTML}
        </head>
        <body>
          <div id="receipt-content">
            ${document.getElementById('receipt-content')?.innerHTML || ''}
          </div>
        </body>
      </html>
    `);
    
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div id="receipt-content" className="bg-white p-6 rounded-lg shadow-md">
      <ReceiptHeader tenant={tenant} />
      <ReceiptTable 
        tenant={{
          fraisAgence: tenant.fraisAgence,
          profession: tenant.profession
        }}
        propertyId={tenant.propertyId}
        isEndOfContract={isEndOfContract}
        contractId={contractId}
        inspection={inspection}
      />
      <div className="text-right mb-8">
        <p className="font-bold">Signature:</p>
        <div className="mt-4 border-t border-gray-400 w-48 ml-auto"></div>
      </div>
      <ReceiptActions onPrint={printReceipt} />
    </div>
  );
}