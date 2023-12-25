import type { EngineType, SubjectType } from 'src/vehicleCustomsDutyCalculator/types';

type ExciseTaxParams = {
  horsePower: number;
  engineType: EngineType;
  subjectType: SubjectType;
};

/**  4.Helper function to calculate excise tax based on engine power(акциз) */
export const getExciseTax = ({ horsePower, subjectType, engineType }: ExciseTaxParams) => {
  if (subjectType === 'individual' || engineType === 'electric' || horsePower <= 90) {
    return { exciseTax: 0, pricePerHorsePower: 0 };
  }

  const priceTiers = [
    // hourse power / rub
    { horsePowerLimit: 150, pricePerHorsePower: 55 },
    { horsePowerLimit: 200, pricePerHorsePower: 531 },
    { horsePowerLimit: 300, pricePerHorsePower: 869 },
    { horsePowerLimit: 400, pricePerHorsePower: 1482 },
    { horsePowerLimit: 500, pricePerHorsePower: 1523 },
    { horsePowerLimit: Infinity, pricePerHorsePower: 1584 },
  ];

  // Determine price per horsepower based on horsePower
  const { pricePerHorsePower = 0 } = priceTiers.find((tier) => horsePower <= tier.horsePowerLimit) || {};

  return {
    exciseTax: horsePower * pricePerHorsePower,
    pricePerHorsePower,
  };
};
