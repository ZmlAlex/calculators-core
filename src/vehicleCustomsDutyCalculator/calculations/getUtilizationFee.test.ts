import { getUtilizationFee } from './getUtilizationFee';
import type { CarAge, EngineType } from 'src/vehicleCustomsDutyCalculator/types';

const BASE_RATE = 20_000;
// 3.
describe('getUtilizationFee', () => {
  // 3.1
  describe('getUtilizationFee for Individuals', () => {
    const scenarios = [
      {
        engineCapacityCubicCentimeters: 0,
        carAge: '0-3',
        engineType: 'electric',
        coefficient: 0.17,
        expectedUtilizationFee: Number((BASE_RATE * 0.17).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 0,
        carAge: '3-5',
        engineType: 'electric',
        coefficient: 0.26,
        expectedUtilizationFee: Number((BASE_RATE * 0.26).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 1_000,
        carAge: '0-3',
        engineType: 'petrol',
        coefficient: 0.17,
        expectedUtilizationFee: Number((BASE_RATE * 0.17).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 1_500,
        carAge: '3-5',
        engineType: 'petrol',
        coefficient: 0.26,
        expectedUtilizationFee: Number((BASE_RATE * 0.26).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 3_000,
        carAge: '0-3',
        engineType: 'petrol',
        coefficient: 0.17,
        expectedUtilizationFee: Number((BASE_RATE * 0.17).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 3_500,
        carAge: '3-5',
        engineType: 'petrol',
        coefficient: 74.25,
        expectedUtilizationFee: Number((BASE_RATE * 74.25).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 4_000,
        carAge: '5-7',
        engineType: 'petrol',
        coefficient: 81.19,
        expectedUtilizationFee: Number((BASE_RATE * 81.19).toFixed(1)),
      },
    ];

    scenarios.forEach(({ engineCapacityCubicCentimeters, carAge, engineType, expectedUtilizationFee, coefficient }) => {
      it(`should calculate fee correctly for a ${engineCapacityCubicCentimeters} cubic cantimeters car, engine ${engineType} and aged ${carAge} years`, () => {
        expect(
          getUtilizationFee({
            engineCapacityCubicCentimeters,
            subjectType: 'individual',
            carAge: carAge as CarAge,
            engineType: engineType as EngineType,
          })
        ).toEqual({
          utilizationFee: expectedUtilizationFee,
          coefficient,
          baseRate: BASE_RATE,
        });
      });
    });
  });
  // 3.2
  describe('getUtilizationFee for Legal Entities', () => {
    const scenarios = [
      {
        engineCapacityCubicCentimeters: 0,
        carAge: '0-3',
        engineType: 'electric',
        coefficient: 4.06,
        expectedUtilizationFee: Number((BASE_RATE * 4.06).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 1_000,
        carAge: '0-3',
        engineType: 'petrol',
        coefficient: 4.06,
        expectedUtilizationFee: Number((BASE_RATE * 4.06).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 2_000,
        carAge: '3-5',
        engineType: 'petrol',
        coefficient: 26.44,
        expectedUtilizationFee: Number((BASE_RATE * 26.44).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 3_000,
        carAge: '3-5',
        engineType: 'petrol',
        coefficient: 63.95,
        expectedUtilizationFee: Number((BASE_RATE * 63.95).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 3_500,
        carAge: '0-3',
        engineType: 'petrol',
        coefficient: 48.5,
        expectedUtilizationFee: Number((BASE_RATE * 48.5).toFixed(1)),
      },
      {
        engineCapacityCubicCentimeters: 4_000,
        carAge: '5-7',
        engineType: 'petrol',
        coefficient: 81.19,
        expectedUtilizationFee: Number((BASE_RATE * 81.19).toFixed(1)),
      },
    ];

    scenarios.forEach(({ engineCapacityCubicCentimeters, carAge, engineType, expectedUtilizationFee, coefficient }) => {
      it(`should calculate fee correctly for a legal entity with a ${engineCapacityCubicCentimeters} cubic cantimeters car, engine ${engineType} and aged ${carAge} years`, () => {
        expect(
          getUtilizationFee({
            engineCapacityCubicCentimeters,
            carAge: carAge as CarAge,
            subjectType: 'legalEntity',
            engineType: 'petrol',
          })
        ).toEqual({
          utilizationFee: expectedUtilizationFee,
          coefficient,
          baseRate: BASE_RATE,
        });
      });
    });
  });
});
