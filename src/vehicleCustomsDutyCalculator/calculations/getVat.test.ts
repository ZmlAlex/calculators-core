import { getVat } from './getVat';

// 5.
describe('getVat', () => {
  it('should calculate VAT correctly for legal entities', () => {
    const coefficient = 0.2;
    const carPriceRub = 1_000_000;
    const exciseTax = 50_000;
    const customsDuty = 10_000;
    const vat = (carPriceRub + exciseTax + customsDuty) * coefficient;

    expect(
      getVat({
        carPriceRub,
        exciseTax,
        customsDuty,
        engineType: 'petrol',
        subjectType: 'legalEntity',
      })
    ).toEqual({ vat, coefficient });
  });

  it('should calculate VAT correctly for electric vehicles', () => {
    const coefficient = 0.2;
    const carPriceRub = 1_500_000;
    const exciseTax = 75_000;
    const customsDuty = 15_000;
    const vat = (carPriceRub + exciseTax + customsDuty) * coefficient;

    expect(
      getVat({
        carPriceRub,
        exciseTax,
        customsDuty,
        engineType: 'electric',
        subjectType: 'individual',
      })
    ).toEqual({ vat, coefficient });
  });

  it('should return 0 VAT for individual entities with non-electric engines', () => {
    expect(
      getVat({
        carPriceRub: 500_000,
        exciseTax: 25_000,
        customsDuty: 5_000,
        engineType: 'petrol',
        subjectType: 'individual',
      })
    ).toEqual({ vat: 0, coefficient: 0 });
  });
});
