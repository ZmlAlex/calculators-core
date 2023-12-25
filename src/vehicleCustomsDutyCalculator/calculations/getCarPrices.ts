import { match } from 'ts-pattern';
import { getCurrencyRatePairs } from './getCurrencyRatePairs';

type CarPricesParams = {
  carPrice: number;
  currency: string;
};

export const getCarPrices = async ({ carPrice, currency }: CarPricesParams) => {
  const {
    pairs: { EURtoRUB = 0 },
  } = await getCurrencyRatePairs({ baseCurrency: 'EUR', pairs: ['RUB'] });

  const carPrices: { EUR: number; RUB: number } = await match(currency)
    .with('RUB', () => ({
      EUR: carPrice / EURtoRUB,
      RUB: carPrice,
    }))
    .with('EUR', () => ({
      EUR: carPrice,
      RUB: carPrice * EURtoRUB,
    }))
    .otherwise(async () => {
      const { pairs } = await getCurrencyRatePairs({
        baseCurrency: currency,
        pairs: ['RUB', 'EUR'],
      });

      const baseCurrencyToRub = pairs?.[`${currency}toRUB`] ?? 0;
      const baseCurrencyToEur = pairs?.[`${currency}toEUR`] ?? 0;

      return {
        EUR: carPrice * baseCurrencyToEur,
        RUB: carPrice * baseCurrencyToRub,
      };
    });

  return carPrices;
};
