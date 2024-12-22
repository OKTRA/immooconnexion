import { ReceiptHeader } from "./receipt/ReceiptHeader";
import { ReceiptTable } from "./receipt/ReceiptTable";
import { ReceiptActions } from "./receipt/ReceiptActions";

interface TenantReceiptProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
    fraisAgence: string;
    propertyId: string;
  };
  contractId?: string;
  isEndOfContract?: boolean;
}

export function TenantReceipt({ tenant, contractId, isEndOfContract }: TenantReceiptProps) {
  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de ${isEndOfContract ? 'Fin de Contrat' : 'Paiement'}</title>
          <style>
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
          </style>
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
    <div id="receipt-content" className="space-y-6">
      <ReceiptHeader tenant={tenant} />
      <ReceiptTable 
        tenant={tenant}
        propertyId={tenant.propertyId}
        isEndOfContract={isEndOfContract}
        contractId={contractId}
      />
      <div className="text-right mb-8">
        <p className="font-bold">Signature:</p>
        <div className="mt-4 border-t border-gray-400 w-48 ml-auto"></div>
      </div>
      <ReceiptActions
        onPrint={printReceipt}
        contractId={contractId}
        isEndOfContract={isEndOfContract}
      />
    </div>
  );
}