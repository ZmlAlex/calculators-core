import { getCustomsClearanceFee } from './getCustomsClearanceFee';

describe('getCustomsClearanceFee', () => {
  it('should return 775 for a car priced at 200,000 rubles or less', () => {
    expect(getCustomsClearanceFee(200_000)).toBe(775);
    expect(getCustomsClearanceFee(150_000)).toBe(775);
  });

  it('should return 1550 for a car priced over 200,000 and up to 450,000 rubles', () => {
    expect(getCustomsClearanceFee(450_000)).toBe(1_550);
    expect(getCustomsClearanceFee(300_000)).toBe(1_550);
  });

  it('should return 3100 for a car priced over 450,000 and up to 1,200,000 rubles', () => {
    expect(getCustomsClearanceFee(1_200_000)).toBe(3_100);
    expect(getCustomsClearanceFee(700_000)).toBe(3_100);
  });

  it('should return 8530 for a car priced over 1,200,000 and up to 2,700,000 rubles', () => {
    expect(getCustomsClearanceFee(2_700_000)).toBe(8_530);
    expect(getCustomsClearanceFee(2_000_000)).toBe(8_530);
  });

  it('should return 12000 for a car priced over 2,700,000 and up to 4,200,000 rubles', () => {
    expect(getCustomsClearanceFee(4_200_000)).toBe(12_000);
    expect(getCustomsClearanceFee(3_500_000)).toBe(12_000);
  });

  it('should return 15500 for a car priced over 4,200,000 and up to 5,500,000 rubles', () => {
    expect(getCustomsClearanceFee(5_500_000)).toBe(15_500);
    expect(getCustomsClearanceFee(5_000_000)).toBe(15_500);
  });

  it('should return 20000 for a car priced over 5,500,000 and up to 7,000,000 rubles', () => {
    expect(getCustomsClearanceFee(7_000_000)).toBe(20_000);
    expect(getCustomsClearanceFee(6_500_000)).toBe(20_000);
  });

  it('should return 23000 for a car priced over 7,000,000 and up to 8,000,000 rubles', () => {
    expect(getCustomsClearanceFee(8_000_000)).toBe(23_000);
    expect(getCustomsClearanceFee(7_500_000)).toBe(23_000);
  });

  it('should return 25000 for a car priced over 8,000,000 and up to 9,000,000 rubles', () => {
    expect(getCustomsClearanceFee(9_000_000)).toBe(25_000);
    expect(getCustomsClearanceFee(8_500_000)).toBe(25_000);
  });

  it('should return 27000 for a car priced over 9,000,000 and up to 10,000,000 rubles', () => {
    expect(getCustomsClearanceFee(10_000_000)).toBe(27_000);
    expect(getCustomsClearanceFee(9_500_000)).toBe(27_000);
  });

  it('should return 30000 for a car priced over 10,000,000 rubles', () => {
    expect(getCustomsClearanceFee(10_000_001)).toBe(30_000);
    expect(getCustomsClearanceFee(15_000_000)).toBe(30_000);
  });
});
