import React from 'react';
import { ReceiptHeader } from './receipt/ReceiptHeader';
import { ReceiptTable } from './receipt/ReceiptTable';
import { ReceiptActions } from './receipt/ReceiptActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TenantReceiptData } from '@/types/tenant';

interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  lease?: any;
}

export function TenantReceipt({ 
  tenant, 
  isInitialReceipt,
  isEndReceipt,
  lease 
}: TenantReceiptProps) {
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

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
          <title>Reçu - ${tenant.prenom} ${tenant.nom}</title>
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
      <ReceiptHeader 
        tenant={tenant} 
        agencyId={userProfile?.agency_id}
      />
      <ReceiptTable 
        tenant={tenant}
        isInitialReceipt={isInitialReceipt}
        isEndReceipt={isEndReceipt}
        lease={lease}
      />
      <div className="text-right mb-8">
        <p className="font-bold">Signature:</p>
        <div className="mt-4 border-t border-gray-400 w-48 ml-auto"></div>
      </div>
      <ReceiptActions onPrint={printReceipt} />
    </div>
  );
}
