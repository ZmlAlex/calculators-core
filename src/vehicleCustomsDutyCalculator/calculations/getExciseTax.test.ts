import { getExciseTax } from './getExciseTax';

// 4.
describe('getExciseTax', () => {
  describe('when subject type is legalEntity or engineType is electric', () => {
    it('should return 0 for horsepower up to 90', () => {
      expect(getExciseTax({ horsePower: 90, subjectType: 'legalEntity', engineType: 'petrol' })).toEqual({ exciseTax: 0, pricePerHorsePower: 0 }); //(0);
      expect(
        getExciseTax({
          horsePower: 50,
          subjectType: 'individual',
          engineType: 'electric',
        })
      ).toEqual({ exciseTax: 0, pricePerHorsePower: 0 });
    });

    it('should correctly calculate tax for horsepower between 151 and 200', () => {
      expect(
        getExciseTax({
          horsePower: 151,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 80181, pricePerHorsePower: 531 });
      expect(
        getExciseTax({
          horsePower: 200,
          subjectType: 'individual',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 0, pricePerHorsePower: 0 });
    });

    it('should correctly calculate tax for horsepower between 201 and 300', () => {
      expect(
        getExciseTax({
          horsePower: 201,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 174669, pricePerHorsePower: 869 });
      expect(
        getExciseTax({
          horsePower: 300,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 260700, pricePerHorsePower: 869 });
    });

    it('should correctly calculate tax for horsepower between 301 and 400', () => {
      expect(
        getExciseTax({
          horsePower: 301,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 446082, pricePerHorsePower: 1482 });
      expect(
        getExciseTax({
          horsePower: 400,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 592800, pricePerHorsePower: 1482 });
    });

    it('should correctly calculate tax for horsepower between 401 and 500', () => {
      expect(
        getExciseTax({
          horsePower: 401,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 610723, pricePerHorsePower: 1523 });
      expect(
        getExciseTax({
          horsePower: 500,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 761500, pricePerHorsePower: 1523 });
    });

    it('should correctly calculate tax for horsepower over 500', () => {
      expect(
        getExciseTax({
          horsePower: 501,
          subjectType: 'legalEntity',
          engineType: 'petrol',
        })
      ).toEqual({ exciseTax: 793584, pricePerHorsePower: 1584 });
      expect(
        getExciseTax({
          horsePower: 600,
          subjectType: 'legalEntity',
          engineType: 'electric',
        })
      ).toEqual({ exciseTax: 0, pricePerHorsePower: 0 });
    });
  });

  describe('when subject type is individual and engineType is not electric', () => {
    it('should correctly calculate tax', () => {
      expect(getExciseTax({ horsePower: 400, subjectType: 'individual', engineType: 'petrol' })).toEqual({ exciseTax: 0, pricePerHorsePower: 0 });
    });
  });
});
