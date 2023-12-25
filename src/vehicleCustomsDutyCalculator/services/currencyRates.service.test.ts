import { describe, it, expect, afterEach } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { axiosClient, currencyRatesService } from './currencyRates.service';

const mockAxios = new AxiosMockAdapter(axiosClient);

describe('currencyRateService', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should fetch currency rates successfully', async () => {
    const baseCurrency = 'USD';
    const mockResponse = { rates: { EUR: 0.85, GBP: 0.75 } };

    mockAxios.onGet(`/${baseCurrency}`).reply(200, mockResponse);

    const rates = await currencyRatesService.getCurrencyRates(baseCurrency);

    expect(rates).toEqual(mockResponse);
    expect(mockAxios.history.get?.length).toBe(1);
  });

  it('should handle API responses with error information', async () => {
    const baseCurrency = 'UNKNOWN';

    mockAxios.onGet(`/${baseCurrency}`).reply(200, { result: 'error', 'error-type': 'unsupported-code' });

    await expect(currencyRatesService.getCurrencyRates(baseCurrency)).rejects.toThrow('unsupported-code');
  });

  // ex. when you have wrong headers in axios client
  it('should handle 401 Not Found error', async () => {
    const baseCurrency = 'USD';

    mockAxios.onGet(`/${baseCurrency}`).reply(401);

    await expect(currencyRatesService.getCurrencyRates(baseCurrency)).rejects.toThrow('Request failed with status code 401');
  });
});
