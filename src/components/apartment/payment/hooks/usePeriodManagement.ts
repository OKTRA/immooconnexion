import { useState } from "react";
import { PeriodOption } from "../types";

export function usePeriodManagement() {
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number>(1);

  const generatePeriodOptions = (frequency: string) => {
    let options: PeriodOption[] = [];
    switch (frequency) {
      case 'daily':
        options = Array.from({length: 31}, (_, i) => ({
          value: i + 1,
          label: `${i + 1} jour${i > 0 ? 's' : ''}`
        }));
        break;
      case 'weekly':
        [1, 2, 3, 4].forEach(weeks => {
          options.push({
            value: weeks,
            label: `${weeks} semaine${weeks > 1 ? 's' : ''}`
          });
        });
        break;
      case 'monthly':
        Array.from({length: 12}, (_, i) => {
          options.push({
            value: i + 1,
            label: `${i + 1} mois`
          });
        });
        break;
      case 'yearly':
        [1, 2, 3, 4, 5].forEach(years => {
          options.push({
            value: years,
            label: `${years} an${years > 1 ? 's' : ''}`
          });
        });
        break;
    }
    setPeriodOptions(options);
  };

  return {
    periodOptions,
    selectedPeriods,
    setSelectedPeriods,
    generatePeriodOptions
  };
}