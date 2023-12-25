import { getCurrencyRatePairs } from './getCurrencyRatePairs';
import { currencyRatesService } from 'src/vehicleCustomsDutyCalculator/services/currencyRates.service';

vi.mock('src/vehicleCustomsDutyCalculator/services/currencyRates.service');

describe('getCurrencyRatePairs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return mapped currency rate pairs on successful API call', async () => {
    const mockResponse = {
      base_code: 'USD',
      rates: { EUR: 0.85, GBP: 0.75 },
    };
    vi.mocked(currencyRatesService.getCurrencyRates).mockResolvedValue(mockResponse);

    const result = await getCurrencyRatePairs({
      baseCurrency: 'USD',
      pairs: ['EUR', 'GBP'],
    });

    expect(result).toEqual({
      baseCurrency: 'USD',
      pairs: { USDtoEUR: 0.85, USDtoGBP: 0.75 },
    });
  });

  it('should throw an error when the API call fails', async () => {
    vi.mocked(currencyRatesService.getCurrencyRates).mockRejectedValue(
      new Error('API Error')
    );

    await expect(
      getCurrencyRatePairs({ baseCurrency: 'USD', pairs: ['EUR'] })
    ).rejects.toThrow('API Error');
  });
});
