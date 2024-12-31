// Liste des pays d'Afrique de l'Ouest avec leurs codes ISO
export const westafrikanCountries = [
  { name: 'Bénin', code: 'BJ' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Guinée-Bissau', code: 'GW' },
  { name: 'Mali', code: 'ML' },
  { name: 'Niger', code: 'NE' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Togo', code: 'TG' }
] as const;

export const getCountryCode = (countryName: string): string => {
  const country = westafrikanCountries.find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.code || 'ML'; // Default to Mali if not found
};