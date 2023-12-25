import { getVat } from './getVat';

// 5.
describe('getVat', () => {
  it('should calculate VAT correctly for legal entities', () => {
    const coefficient = 0.2;
    const carPriceRub = 1000000;
    const exciseTax = 50000;
    const customsDuty = 10000;
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
    const carPriceRub = 1500000;
    const exciseTax = 75000;
    const customsDuty = 15000;
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
        carPriceRub: 500000,
        exciseTax: 25000,
        customsDuty: 5000,
        engineType: 'petrol',
        subjectType: 'individual',
      })
    ).toEqual({ vat: 0, coefficient: 0 });
  });
});
