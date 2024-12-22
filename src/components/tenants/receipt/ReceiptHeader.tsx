import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptHeaderProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
  };
}

export function ReceiptHeader({ tenant }: ReceiptHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reçu de Paiement</h2>
        <p className="text-lg">
          Date: {format(new Date(), "d MMM yyyy", { locale: fr })}
        </p>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-bold">Locataire:</span> {tenant.prenom} {tenant.nom}
        </p>
        <p className="text-lg">
          <span className="font-bold">Téléphone:</span> {tenant.telephone}
        </p>
      </div>
    </div>
  );
}