import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

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
  const navigate = useNavigate();
  
  const { data: property } = useQuery({
    queryKey: ['property', tenant.propertyId],
    queryFn: async () => {
      if (!tenant.propertyId) return null;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', tenant.propertyId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!tenant.propertyId
  });

  const { data: inspection } = useQuery({
    queryKey: ['inspection', contractId],
    queryFn: async () => {
      if (!contractId) return null;
      
      const { data, error } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', contractId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching inspection:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!contractId && isEndOfContract
  });

  const handleEndContract = () => {
    if (contractId) {
      navigate(`/inspections/${contractId}`);
    }
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return;

    const today = format(new Date(), 'PP', { locale: fr });
    
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
            <h2>Reçu de ${isEndOfContract ? 'Fin de Contrat' : 'Paiement'}</h2>
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
                ${!isEndOfContract ? `
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
                <tr>
                  <td>Frais d'agence</td>
                  <td class="amount">${parseFloat(tenant.fraisAgence).toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td><strong>Total</strong></td>
                  <td class="amount">
                    ${((property?.loyer || 0) + 
                       (property?.caution || 0) + 
                       (parseFloat(tenant.fraisAgence) || 0)
                      ).toLocaleString('fr-FR')}
                  </td>
                </tr>
                ` : `
                ${inspection?.deposit_returned ? `
                <tr>
                  <td>Caution retournée</td>
                  <td class="amount">${inspection.deposit_returned.toLocaleString('fr-FR')}</td>
                </tr>
                ` : ''}
                ${inspection?.repair_costs ? `
                <tr>
                  <td>Coûts de réparation</td>
                  <td class="amount">${inspection.repair_costs.toLocaleString('fr-FR')}</td>
                </tr>
                ` : ''}
                `}
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
    <div className="space-y-4">
      <Button
        onClick={printReceipt}
        className="w-full"
      >
        Imprimer le reçu
      </Button>
      
      {!isEndOfContract && contractId && (
        <Button
          onClick={handleEndContract}
          variant="outline"
          className="w-full"
        >
          <FileText className="mr-2 h-4 w-4" />
          Mettre fin au contrat
        </Button>
      )}
    </div>
  );
}