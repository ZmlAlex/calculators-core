import { getCarPrices } from './getCarPrices';
// 1.Сбор за таможенное оформление. -> customs clearance fee
import { getCustomsClearanceFee } from './getCustomsClearanceFee';
// 2.Таможенная пошлина. -> customs duty
import { getCustomsDuty } from './getCustomsDuty';
// 3.Утилизационный сбор -> utilization fee
import { getUtilizationFee } from './getUtilizationFee';
// 4.Акциз -> excise tax.
import { getExciseTax } from './getExciseTax';
// 5.НДС -> tax.
import { getVat } from './getVat';

import { toFixedNumber } from 'src/helpers/toFixedNumber';
import type { CarAge, EngineType, SubjectType } from 'src/vehicleCustomsDutyCalculator/types';

type FinalCustomsValues = {
  engineType: EngineType;
  engineCapacityCubicCentimeters: number;
  horsePower: number;
  carAge: CarAge;
  subjectType: SubjectType;
};
type GetFinalCustomsValuesParams = FinalCustomsValues & {
  carPrice: number;
  currency: string;
};

type CalculateFinalCustomsValuesParams = FinalCustomsValues & {
  carPriceRub: number;
  carPriceEur: number;
};

export const getFinalCustomsValues = async ({
  carPrice,
  currency,
  engineCapacityCubicCentimeters,
  horsePower,
  carAge,
  subjectType,
  engineType,
}: GetFinalCustomsValuesParams) => {
  const { EUR: carPriceEur, RUB: carPriceRub } = await getCarPrices({
    carPrice,
    currency,
  });

  const finalCustomsValues = calculateFinalCustomsValues({
    carPriceRub,
    carPriceEur,
    engineCapacityCubicCentimeters,
    carAge,
    horsePower,
    subjectType,
    engineType,
  });

  return finalCustomsValues;
};

export function calculateFinalCustomsValues({
  carPriceRub,
  carPriceEur,
  engineType,
  engineCapacityCubicCentimeters,
  horsePower,
  carAge,
  subjectType,
}: CalculateFinalCustomsValuesParams) {
  //1
  const customsClearanceFee = getCustomsClearanceFee(carPriceRub);
  //2
  const customsDutyInfo = getCustomsDuty({
    engineCapacityCubicCentimeters,
    carPriceRub,
    carPriceEur,
    carAge,
    subjectType,
    engineType,
  });
  //3
  const utilizationFeeInfo = getUtilizationFee({
    engineCapacityCubicCentimeters,
    carAge,
    engineType,
    subjectType,
  });
  //4
  const exciseTaxInfo = getExciseTax({ subjectType, engineType, horsePower });
  //5
  const vatInfo = getVat({
    carPriceRub,
    exciseTax: exciseTaxInfo.exciseTax,
    customsDuty: customsDutyInfo.customsDuty,
    engineType,
    subjectType,
  });

  const totalDuty = customsClearanceFee + customsDutyInfo.customsDuty + exciseTaxInfo.exciseTax + vatInfo.vat + utilizationFeeInfo.utilizationFee;
  const totalAmount = toFixedNumber(carPriceRub + totalDuty);

  return {
    currency: 'RUB',
    customsClearanceFee,
    customsDutyInfo,
    utilizationFeeInfo,
    exciseTaxInfo,
    vatInfo,

    totalDuty,
    totalAmount,
  };
}
