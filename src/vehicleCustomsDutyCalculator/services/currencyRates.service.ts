import axios, { type AxiosResponse } from 'axios';

type HTTPClient<T> = {
  get: (url: string) => Promise<T>;
};

// TODO: ADD CACHE https://axios-cache-interceptor.js.org/guide/getting-started
export const axiosClient = axios.create({
  baseURL: 'https://exchangerate-api.p.rapidapi.com/rapid/latest',
  headers: {
    //*  it's not sensetive, it's fine to keep it here
    'X-RapidAPI-Key': 'df03474a0fmsh3a1ab67b761bdf7p1b2599jsn52d46c32554d',
    'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com',
  },
});

const createCurrencyRatesService = (httpClient: HTTPClient<AxiosResponse>) => {
  return {
    async getCurrencyRates(baseCurrency: string) {
      const { data } = await httpClient.get(`/${baseCurrency}`);

      if (data.result === 'error') {
        throw new Error(data['error-type']);
      }

      return data;
    },
  };
};

export const currencyRatesService = createCurrencyRatesService(axiosClient);
