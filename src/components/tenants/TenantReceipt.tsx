import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TenantReceiptProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
    fraisAgence: string;
  };
  property?: {
    bien: string;
    loyer: number;
    caution: number;
  };
}

export function TenantReceipt({ tenant, property }: TenantReceiptProps) {
  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const today = format(new Date(), 'PP', { locale: fr });
    
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Paiement</title>
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
            .receipt-content {
              margin: 20px 0;
            }
            .footer {
              margin-top: 50px;
              text-align: right;
            }
            .amount {
              font-weight: bold;
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
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Reçu de Paiement</h2>
            <p>Date: ${today}</p>
          </div>
          
          <div class="receipt-content">
            <p><strong>Locataire:</strong> ${tenant.prenom} ${tenant.nom}</p>
            <p><strong>Téléphone:</strong> ${tenant.telephone}</p>
            ${property ? `<p><strong>Bien:</strong> ${property.bien}</p>` : ''}
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody>
                ${property?.loyer ? `
                <tr>
                  <td>Loyer</td>
                  <td class="amount">${property.loyer.toLocaleString('fr-FR')}</td>
                </tr>
                ` : ''}
                ${property?.caution ? `
                <tr>
                  <td>Caution</td>
                  <td class="amount">${property.caution.toLocaleString('fr-FR')}</td>
                </tr>
                ` : ''}
                ${tenant.fraisAgence ? `
                <tr>
                  <td>Frais d'agence</td>
                  <td class="amount">${parseFloat(tenant.fraisAgence).toLocaleString('fr-FR')}</td>
                </tr>
                ` : ''}
                <tr>
                  <td><strong>Total</strong></td>
                  <td class="amount">
                    ${((property?.loyer || 0) + 
                       (property?.caution || 0) + 
                       (parseFloat(tenant.fraisAgence) || 0)
                      ).toLocaleString('fr-FR')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Signature:</p>
            <div style="margin-top: 30px;">_____________________</div>
          </div>
        </body>
      </html>
    `);
    
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <button
      onClick={printReceipt}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      Imprimer le reçu
    </button>
  );
}