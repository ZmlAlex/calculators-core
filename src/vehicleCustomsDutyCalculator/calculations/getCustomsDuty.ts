import { toFixedNumber } from 'src/helpers/toFixedNumber';
import { P, match } from 'ts-pattern';
import type { CarAge, EngineType, SubjectType } from 'src/vehicleCustomsDutyCalculator/types';

type CustomsDutyParams = {
  carPriceEur: number;
  carPriceRub: number;
  engineCapacityCubicCentimeters: number;
  carAge: CarAge;
  subjectType: SubjectType;
  engineType: EngineType;
};

/** 2.Helper function to calculate customs duty(Таможенная пошлина) */
export const getCustomsDuty = ({ carPriceEur, carPriceRub, engineCapacityCubicCentimeters, carAge, subjectType, engineType }: CustomsDutyParams) => {
  const customsDutyInfo: {
    customsDuty: number;
    coefficient?: number;
    pricePerCubicCentimeter?: number;
  } = match({ subjectType, engineType, carAge })
    .with({ engineType: 'electric' }, () => calculateCustomsDutyElectric(carPriceEur))
    .with({ subjectType: 'legalEntity', engineType: 'petrol' }, () =>
      calculateCustomsDutyLegalEntityPetrol({
        engineCapacityCubicCentimeters,
        carAge,
        carPriceEur,
      })
    )
    .with({ subjectType: 'legalEntity', engineType: 'diesel' }, () =>
      calculateCustomsDutyLegalEntityDiesel({
        engineCapacityCubicCentimeters,
        carAge,
      })
    )
    .with({ subjectType: 'individual', carAge: '0-3' }, () =>
      calculateCustomsDutyIndividualLessThan3Years({
        carPriceEur,
        engineCapacityCubicCentimeters,
      })
    )
    .with({ subjectType: 'individual', carAge: P.union('3-5', '5-7', '7-0') }, () =>
      calculateCustomsDutyIndividualOlderThan3Years({
        engineCapacityCubicCentimeters,
        carAge,
      })
    )
    .otherwise(() => ({ customsDuty: 0 }));

  console.log('customsDutyInfo: ', customsDutyInfo);

  return {
    ...customsDutyInfo,
    customsDuty: toFixedNumber(customsDutyInfo?.customsDuty * (carPriceRub / carPriceEur)),
  };
};

// 2.0 both - individual and legal entity
function calculateCustomsDutyElectric(carPriceEur: number) {
  const coefficient = 0.15;
  return { customsDuty: carPriceEur * coefficient, coefficient };
}
// 2.1 individual
const calculateCustomsDutyIndividualLessThan3Years = ({
  carPriceEur,
  engineCapacityCubicCentimeters,
}: Pick<CustomsDutyParams, 'carPriceEur' | 'engineCapacityCubicCentimeters'>) => {
  const { coefficient, pricePerCubicCentimeter } = match(carPriceEur)
    .with(
      P.when((price) => price <= 8_500),
      () => ({ coefficient: 0.54, pricePerCubicCentimeter: 2.5 })
    )
    .with(
      P.when((price) => price <= 16_700),
      () => ({ coefficient: 0.48, pricePerCubicCentimeter: 3.5 })
    )
    .with(
      P.when((price) => price <= 42_300),
      () => ({ coefficient: 0.48, pricePerCubicCentimeter: 5.5 })
    )
    .with(
      P.when((price) => price <= 84_500),
      () => ({ coefficient: 0.48, pricePerCubicCentimeter: 7.5 })
    )
    .with(
      P.when((price) => price <= 169_000),
      () => ({ coefficient: 0.48, pricePerCubicCentimeter: 15 })
    )
    .otherwise(() => ({ coefficient: 0.48, pricePerCubicCentimeter: 20 }));

  const customsDuty = Math.max(carPriceEur * coefficient, engineCapacityCubicCentimeters * pricePerCubicCentimeter);

  return {
    customsDuty,
    coefficient,
    pricePerCubicCentimeter,
  };
};

// 2.2 individual
function calculateCustomsDutyIndividualOlderThan3Years({
  engineCapacityCubicCentimeters,
  carAge,
}: Pick<CustomsDutyParams, 'carAge' | 'engineCapacityCubicCentimeters'>) {
  const isOlderThan5Years = carAge === '5-7' || carAge === '7-0';

  const pricePerCubicCentimeter = match(engineCapacityCubicCentimeters)
    .with(
      P.when((capacity) => capacity <= 1_000),
      () => (isOlderThan5Years ? 3 : 1.5)
    )
    .with(
      P.when((capacity) => capacity <= 1_500),
      () => (isOlderThan5Years ? 3.2 : 1.7)
    )
    .with(
      P.when((capacity) => capacity <= 1_800),
      () => (isOlderThan5Years ? 3.5 : 2.5)
    )
    .with(
      P.when((capacity) => capacity <= 2_300),
      () => (isOlderThan5Years ? 4.8 : 2.7)
    )
    .with(
      P.when((capacity) => capacity <= 3_000),
      () => (isOlderThan5Years ? 5 : 3)
    )
    .otherwise(() => (isOlderThan5Years ? 5.7 : 3.6));

  const customsDuty = engineCapacityCubicCentimeters * pricePerCubicCentimeter;

  return {
    customsDuty,
    pricePerCubicCentimeter,
  };
}

// 2.3 legal entity
function calculateCustomsDutyLegalEntityPetrol({
  engineCapacityCubicCentimeters,
  carAge,
  carPriceEur,
}: Omit<CustomsDutyParams, 'subjectType' | 'engineType' | 'carPriceRub'>) {
  const isOlderThan7Years = carAge === '7-0';

  const coefficient = match(carAge)
    .with('0-3', () => 0.15)
    .with('7-0', () => 0)
    .otherwise(() => 0.2);

  const pricePerCubicCentimeter = match({ isOlderThan7Years, engineCapacityCubicCentimeters })
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_000) }, () => 1.4)
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_500) }, () => 1.5)
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_800) }, () => 1.6)
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 2_300) }, () => 2.2)
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_000) }, () => 2.2)
    .with({ isOlderThan7Years: true }, () => 3.2)
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_000) }, () => 0.36)
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_500) }, () => 0.4)
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_800) }, () => 0.36)
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 2_300) }, () => 0.44)
    .with({ engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 3_000) }, () => 0.44)
    .otherwise(() => 0.8);

  const duty = engineCapacityCubicCentimeters * pricePerCubicCentimeter;
  const customsDuty = !isOlderThan7Years ? Math.max(duty, carPriceEur * coefficient) : duty;

  return {
    customsDuty,
    pricePerCubicCentimeter,
    coefficient,
  };
}

// 2.4 legal entity
function calculateCustomsDutyLegalEntityDiesel({
  engineCapacityCubicCentimeters,
  carAge,
}: Pick<CustomsDutyParams, 'carAge' | 'engineCapacityCubicCentimeters'>) {
  const isLessThan3Years = carAge === '0-3';
  const isBetween3And7Years = ['3-5', '5-7'].includes(carAge);
  const isOlderThan7Years = carAge === '7-0';

  let coefficient = isLessThan3Years ? 0.15 : 0.2; // 15% for less than 3 years and 20% for 3-7 years

  const customsDutyInfo = match({ engineCapacityCubicCentimeters, isOlderThan7Years, isBetween3And7Years, isLessThan3Years })
    .with({ isLessThan3Years: true }, () => ({
      customsDuty: engineCapacityCubicCentimeters * coefficient,
    }))
    .with({ isBetween3And7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_500) }, () => ({
      customsDuty: Math.max(engineCapacityCubicCentimeters * coefficient, engineCapacityCubicCentimeters * 0.32),
      pricePerCubicCentimeter: 0.32,
    }))
    .with({ isBetween3And7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 2_500) }, () => ({
      customsDuty: Math.max(engineCapacityCubicCentimeters * coefficient, engineCapacityCubicCentimeters * 0.4),
      pricePerCubicCentimeter: 0.4,
    }))
    .with({ isBetween3And7Years: true }, () => ({
      customsDuty: Math.max(engineCapacityCubicCentimeters * coefficient, engineCapacityCubicCentimeters * 0.8),
      pricePerCubicCentimeter: 0.8,
    }))
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 1_500) }, () => ({
      customsDuty: engineCapacityCubicCentimeters * 1.5,
      pricePerCubicCentimeter: 1.5,
    }))
    .with({ isOlderThan7Years: true, engineCapacityCubicCentimeters: P.when((capacity) => capacity <= 2_500) }, () => ({
      customsDuty: engineCapacityCubicCentimeters * 2.2,
      pricePerCubicCentimeter: 2.2,
    }))
    .with({ isOlderThan7Years: true }, () => ({
      customsDuty: engineCapacityCubicCentimeters * 3.2,
      pricePerCubicCentimeter: 3.2,
    }))
    .otherwise(() => ({
      customsDuty: 0,
      pricePerCubicCentimeter: 0,
    }));

  return {
    ...customsDutyInfo,
    coefficient,
  };
}
