import { getCustomsDuty } from './getCustomsDuty';
import { toFixedNumber } from 'src/helpers/toFixedNumber';
import type { CarAge } from 'src/vehicleCustomsDutyCalculator/types';

// 2
describe('getCustomsDuty', () => {
  // 2.0
  describe('getCustomsDuty for electric cars', () => {
    it('should return correct custom duty for electric cars', () => {
      expect(
        getCustomsDuty({
          carPriceEur: 10_000,
          carPriceRub: 1_000_000,
          engineCapacityCubicCentimeters: 0,
          carAge: '0-3',
          subjectType: 'individual',
          engineType: 'electric',
        })
      ).toEqual({ customsDuty: 150_000, coefficient: 0.15 });
    });
  });
  // 2.1
  describe('getCustomsDuty for Individuals (Cars less than 3 years old)', () => {
    const scenarios = [
      {
        carPriceEur: 5_000,
        carPriceRub: 500_000,
        engineCapacityCubicCentimeters: 1_000,
        pricePerCubicCentimeter: 2.5,
        coefficient: 0.54,
        expected: Math.max(5_000 * 0.54, 1_000 * 2.5),
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 1_200,
        pricePerCubicCentimeter: 3.5,
        coefficient: 0.48,
        expected: Math.max(10_000 * 0.48, 1_200 * 3.5),
      },
      {
        carPriceEur: 30_000,
        carPriceRub: 3_000_000,
        engineCapacityCubicCentimeters: 1_500,
        pricePerCubicCentimeter: 5.5,
        coefficient: 0.48,
        expected: Math.max(30_000 * 0.48, 1_500 * 5.5),
      },
      {
        carPriceEur: 60_000,
        carPriceRub: 6_000_000,
        engineCapacityCubicCentimeters: 2_000,
        pricePerCubicCentimeter: 7.5,
        coefficient: 0.48,
        expected: Math.max(60_000 * 0.48, 2_000 * 7.5),
      },
      {
        carPriceEur: 120_000,
        carPriceRub: 12_000_000,
        engineCapacityCubicCentimeters: 2_500,
        pricePerCubicCentimeter: 15,
        coefficient: 0.48,
        expected: Math.max(120_000 * 0.48, 2_500 * 15),
      },
      {
        carPriceEur: 200_000,
        carPriceRub: 20_000_000,
        engineCapacityCubicCentimeters: 3_000,
        pricePerCubicCentimeter: 20,
        coefficient: 0.48,
        expected: Math.max(200_000 * 0.48, 3_000 * 20),
      },
    ];

    scenarios.forEach(({ carPriceEur, carPriceRub, engineCapacityCubicCentimeters, pricePerCubicCentimeter, coefficient, expected }) => {
      it(`should calculate duty correctly for a car priced at ${carPriceEur} euros with ${engineCapacityCubicCentimeters} cubic cantimers`, () => {
        expect(
          getCustomsDuty({
            carPriceEur,
            carPriceRub,
            engineCapacityCubicCentimeters,
            carAge: '0-3',
            subjectType: 'individual',
            engineType: 'petrol',
          })
        ).toEqual({
          customsDuty: expected * 100,
          coefficient,
          pricePerCubicCentimeter,
        });
      });
    });
  });

  // 2.2
  describe('getCustomsDuty for Individuals (Cars older than 3 years)', () => {
    const scenarios = [
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 1_000,
        carAge: '5-7',
        pricePerCubicCentimeter: 3,
        expected: 1_000 * 3,
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 1_200,
        carAge: '3-5',
        pricePerCubicCentimeter: 1.7,
        expected: 1_200 * 1.7,
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 1_600,
        carAge: '7-0',
        pricePerCubicCentimeter: 3.5,
        expected: 1_600 * 3.5,
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,

        engineCapacityCubicCentimeters: 2_200,
        carAge: '5-7',
        pricePerCubicCentimeter: 4.8,
        expected: 2_200 * 4.8,
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 2_800,
        carAge: '7-0',
        pricePerCubicCentimeter: 5,
        expected: 2_800 * 5,
      },
      {
        carPriceEur: 10_000,
        carPriceRub: 1_000_000,
        engineCapacityCubicCentimeters: 3_500,
        carAge: '5-7',
        pricePerCubicCentimeter: 5.7,
        expected: 3_500 * 5.7,
      },
    ];

    scenarios.forEach(({ carPriceEur, carPriceRub, engineCapacityCubicCentimeters, carAge, pricePerCubicCentimeter, expected }) => {
      it(`should calculate duty correctly for a ${engineCapacityCubicCentimeters} engineCapacityCubicCentimeters car aged ${carAge} years`, () => {
        expect(
          getCustomsDuty({
            carPriceEur,
            carPriceRub,
            engineCapacityCubicCentimeters,
            carAge: carAge as CarAge,
            subjectType: 'individual',
            engineType: 'petrol',
          })
        ).toEqual({
          customsDuty: expected * 100,
          pricePerCubicCentimeter,
        });
      });
    });
  });

  // 2.3
  describe('getCustomsDuty for Legal Entities (Petrol Engines)', () => {
    const scenarios = [
      {
        carPriceEur: 20_000,
        carPriceRub: 2_000_000,
        engineCapacityCubicCentimeters: 800,
        carAge: '0-3',
        pricePerCubicCentimeter: 0.36,
        coefficient: 0.15,
        expected: Math.max(800 * 0.36, 20_000 * 0.15),
      },
      {
        carPriceEur: 30_000,
        carPriceRub: 3_000_000,
        engineCapacityCubicCentimeters: 1_500,
        carAge: '3-5',
        pricePerCubicCentimeter: 0.4,
        coefficient: 0.2,
        expected: Math.max(1_500 * 0.4, 30_000 * 0.2),
      },
      {
        carPriceEur: 50_000,
        carPriceRub: 5_000_000,
        engineCapacityCubicCentimeters: 1_800,
        carAge: '5-7',
        pricePerCubicCentimeter: 0.36,
        coefficient: 0.2,
        expected: Math.max(1_800 * 0.36, 50_000 * 0.2),
      },
      {
        carPriceEur: 80_000,
        carPriceRub: 8_000_000,
        coefficient: 0,
        engineCapacityCubicCentimeters: 2_500,
        carAge: '7-0',
        pricePerCubicCentimeter: 2.2,
        expected: 2_500 * 2.2,
      },
      {
        carPriceEur: 120_000,
        carPriceRub: 12_000_000,
        coefficient: 0,
        engineCapacityCubicCentimeters: 3_200,
        carAge: '7-0',
        pricePerCubicCentimeter: 3.2,
        expected: 3_200 * 3.2,
      },
    ];

    scenarios.forEach(({ carPriceEur, carPriceRub, engineCapacityCubicCentimeters, coefficient, pricePerCubicCentimeter, carAge, expected }) => {
      it(`should calculate duty correctly for a car with ${engineCapacityCubicCentimeters} engineCapacityCubicCentimeters, aged ${carAge} years, priced at ${carPriceEur} euros`, () => {
        expect(
          getCustomsDuty({
            carPriceEur,
            carPriceRub,
            engineCapacityCubicCentimeters,
            carAge: carAge as CarAge,
            subjectType: 'legalEntity',
            engineType: 'petrol',
          })
        ).toEqual({
          customsDuty: expected * 100,
          coefficient,
          pricePerCubicCentimeter,
        });
      });
    });
  });
  // 2.4
  describe('getCustomsDuty for Legal Entities (Diesel Engines)', () => {
    const scenarios = [
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 1_400,
        carAge: '0-3',
        coefficient: 0.15,
        expected: 1_400 * 0.15,
      },
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 2_000,
        carAge: '3-5',
        pricePerCubicCentimeter: 0.4,
        coefficient: 0.2,
        expected: Math.max(2_000 * 0.2, 2_000 * 0.4),
      },
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 2_800,
        carAge: '5-7',
        pricePerCubicCentimeter: 0.8,
        coefficient: 0.2,
        expected: Math.max(2_800 * 0.2, 2_800 * 0.8),
      },
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 1_400,
        carAge: '7-0',
        pricePerCubicCentimeter: 1.5,
        coefficient: 0.2,
        expected: 1_400 * 1.5,
      },
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 1_600,
        carAge: '7-0',
        pricePerCubicCentimeter: 2.2,
        coefficient: 0.2,
        expected: 1_600 * 2.2,
      },
      {
        carPriceRub: 10_000_000,
        carPriceEur: 100_000,
        engineCapacityCubicCentimeters: 3_000,
        carAge: '7-0',
        pricePerCubicCentimeter: 3.2,
        coefficient: 0.2,
        expected: 3_000 * 3.2,
      },
    ];

    scenarios.forEach(({ carPriceEur, carPriceRub, engineCapacityCubicCentimeters, carAge, coefficient, pricePerCubicCentimeter, expected }) => {
      it(`should calculate duty correctly for a diesel car with ${engineCapacityCubicCentimeters} engineCapacityCubicCentimeters, aged ${carAge} years`, () => {
        expect(
          getCustomsDuty({
            carPriceEur,
            carPriceRub,
            engineCapacityCubicCentimeters,
            carAge: carAge as CarAge,
            subjectType: 'legalEntity',
            engineType: 'diesel',
          })
        ).toEqual({
          customsDuty: toFixedNumber(expected * 100),
          coefficient,
          pricePerCubicCentimeter,
        });
      });
    });
  });
});
