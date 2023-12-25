import { getCarPrices } from './getCarPrices';
import { getCurrencyRatePairs } from './getCurrencyRatePairs';

vi.mock('./getCurrencyRatePairs');

describe('getCarPrices', () => {
  it('should correctly calculate prices for RUB currency', async () => {
    const currency = 'RUB';
    const mockedResponse = {
      baseCurrency: currency,
      pairs: { EURtoRUB: 90 },
    };
    vi.mocked(getCurrencyRatePairs).mockResolvedValue(mockedResponse);

    const result = await getCarPrices({ carPrice: 1000, currency });

    expect(result).toEqual({ EUR: 1000 / 90, RUB: 1000 });
  });

  it('should correctly calculate prices for EUR currency', async () => {
    const currency = 'EUR';
    const mockedResponse = {
      baseCurrency: currency,
      pairs: { EURtoRUB: 90 },
    };
    vi.mocked(getCurrencyRatePairs).mockResolvedValue(mockedResponse);

    const result = await getCarPrices({ carPrice: 1000, currency });

    expect(result).toEqual({ EUR: 1000, RUB: 1000 * 90 });
  });

  it('should correctly calculate prices for USD currency', async () => {
    const currency = 'USD';
    const mockedResponse = {
      baseCurrency: currency,
      pairs: { USDtoRUB: 75, USDtoEUR: 0.9 },
    };
    vi.mocked(getCurrencyRatePairs).mockResolvedValue(mockedResponse);

    const result = await getCarPrices({ carPrice: 1000, currency });

    expect(result).toEqual({ RUB: 1000 * 75, EUR: 1000 * 0.9 });
  });

  it('should throw an error when the API call fails', async () => {
    vi.mocked(getCurrencyRatePairs).mockRejectedValue(new Error('unsupported-code'));

    await expect(getCarPrices({ carPrice: 1000, currency: 'WRONG' })).rejects.toThrow(
      'unsupported-code'
    );
  });
});
