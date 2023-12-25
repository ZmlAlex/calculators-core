import { toFixedNumber } from 'src/helpers/toFixedNumber';
import type { EngineType, SubjectType } from 'src/vehicleCustomsDutyCalculator/types';

type VatParams = {
  carPriceRub: number;
  exciseTax: number;
  customsDuty: number;
  engineType: EngineType;
  subjectType: SubjectType;
};

/**  5.Helper function to calculate vat(НДС) */
export const getVat = ({
  carPriceRub,
  exciseTax,
  customsDuty,
  engineType,
  subjectType,
}: VatParams) => {
  if (subjectType === 'legalEntity' || engineType === 'electric') {
    const coefficient = 0.2;
    return {
      vat: toFixedNumber((carPriceRub + customsDuty + exciseTax) * coefficient),
      coefficient,
    };
  } else {
    return { vat: 0, coefficient: 0 };
  }
};
