export const validateAgencyData = (agencyData: {
  name: string;
  subscription_plan_id: string;
}) => {
  const errors: string[] = [];

  if (!agencyData.name) {
    errors.push("Le nom de l'agence est obligatoire");
  }

  if (!agencyData.subscription_plan_id) {
    errors.push("Le plan d'abonnement est obligatoire");
  }

  return errors;
}