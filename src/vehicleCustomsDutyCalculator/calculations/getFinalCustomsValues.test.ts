import { getVat } from './getVat';
import { getCustomsClearanceFee } from './getCustomsClearanceFee';
import { getUtilizationFee } from './getUtilizationFee';
import { getCustomsDuty } from './getCustomsDuty';
import { getExciseTax } from './getExciseTax';
import { getFinalCustomsValues } from './getFinalCustomsValues';
import { getCarPrices } from './getCarPrices';

vi.mock('./getCarPrices');
vi.mock('./getCustomsClearanceFee');
vi.mock('./getCustomsDuty');
vi.mock('./getUtilizationFee');
vi.mock('./getExciseTax');
vi.mock('./getVat');

describe('getFinalCustomsValues', () => {
  it('correctly calculates total customs values', async () => {
    vi.mocked(getCarPrices).mockResolvedValue({ EUR: 20_000, RUB: 2_000_000 });
    vi.mocked(getCustomsClearanceFee).mockReturnValue(8530);
    vi.mocked(getCustomsDuty).mockReturnValue({
      customsDuty: 1_100_000,
      coefficient: 0.48,
      pricePerCubicCentimeter: 5.5,
    });
    vi.mocked(getUtilizationFee).mockReturnValue({
      utilizationFee: 3400,
      coefficient: 0.17,
      baseRate: 20000,
    });
    vi.mocked(getExciseTax).mockReturnValue({ exciseTax: 0, pricePerHorsePower: 0 });
    vi.mocked(getVat).mockReturnValue({ vat: 0, coefficient: 0.0 });

    const carPrice = 2_000_000;
    const expectedTotalDuty = 1_111_930;
    const expectedTotalAmount = carPrice + expectedTotalDuty;

    const result = await getFinalCustomsValues({
      carPrice: 2_000_000,
      currency: 'RUB',
      engineCapacityCubicCentimeters: 2000,
      horsePower: 150,
      carAge: '0-3',
      subjectType: 'individual',
      engineType: 'petrol',
    });

    expect(result.totalDuty).toBe(expectedTotalDuty);
    expect(result.totalAmount).toBe(expectedTotalAmount);
  });
});
