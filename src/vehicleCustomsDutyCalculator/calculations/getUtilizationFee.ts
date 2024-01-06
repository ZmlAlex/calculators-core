import { toFixedNumber } from 'src/helpers/toFixedNumber';
import type { CarAge, EngineType, SubjectType } from 'src/vehicleCustomsDutyCalculator/types';
import { P, match } from 'ts-pattern';

type UtilizationFeeParams = {
  engineCapacityCubicCentimeters: number;
  carAge: CarAge;
  engineType: EngineType;
  subjectType: SubjectType;
};

const BASE_RATE = 20_000; //For non-commercial vehicles

/**  3 Helper function to calculate utilization fee(Утилизационный сбор) */
export const getUtilizationFee = ({ engineCapacityCubicCentimeters, carAge, subjectType, engineType }: UtilizationFeeParams) => {
  return subjectType === 'legalEntity'
    ? calculateUtilizationFeeLegalEntity({
        engineCapacityCubicCentimeters,
        carAge,
        engineType,
      })
    : calculateUtilizationFeeIndividual({
        engineCapacityCubicCentimeters,
        carAge,
        engineType,
      });
};

// 3.1 Utilization Fee for Individuals (физлица)
function calculateUtilizationFeeIndividual({ engineCapacityCubicCentimeters, carAge, engineType }: Omit<UtilizationFeeParams, 'subjectType'>) {
  const isLessThan3Years = carAge === '0-3';

  const coefficient = match({ engineType, engineCapacityCubicCentimeters, isLessThan3Years })
    .with({ engineType: 'electric' }, () => (isLessThan3Years ? 0.17 : 0.26))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_000) }, () => (isLessThan3Years ? 0.17 : 0.26))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_500) }, () => (isLessThan3Years ? 48.5 : 74.25))
    .otherwise(() => (isLessThan3Years ? 61.76 : 81.19));

  return {
    utilizationFee: toFixedNumber(BASE_RATE * coefficient),
    coefficient,
    baseRate: BASE_RATE,
  };
}

// 3.2 Utilization Fee for Legal Entities (юрлица)
function calculateUtilizationFeeLegalEntity({ engineCapacityCubicCentimeters, carAge, engineType }: Omit<UtilizationFeeParams, 'subjectType'>) {
  const isLessThan3Years = carAge === '0-3';

  const coefficient = match({ engineType, engineCapacityCubicCentimeters, isLessThan3Years })
    .with({ engineType: 'electric' }, () => (isLessThan3Years ? 18 : 67.34))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_000) }, () => (isLessThan3Years ? 4.06 : 10.36))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 2_000) }, () => (isLessThan3Years ? 15.03 : 26.44))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_000) }, () => (isLessThan3Years ? 42.24 : 63.95))
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_500) }, () => (isLessThan3Years ? 48.5 : 74.25))
    .otherwise(() => (isLessThan3Years ? 61.76 : 81.19));

  return {
    utilizationFee: toFixedNumber(BASE_RATE * coefficient),
    coefficient,
    baseRate: BASE_RATE,
  };
}
