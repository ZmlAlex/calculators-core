import { z } from 'zod';
import { decode } from '~/helpers/decode';
import { currencyRatesService } from 'src/vehicleCustomsDutyCalculator/services/currencyRates.service';

const currencyRateResponseSchema = z.object({
  base_code: z.string(),
  rates: z.record(z.number()),
});

type CurrencyRatePairsParams = {
  baseCurrency: string;
  pairs: string[];
};

type MapToCurrencyParams = z.infer<typeof currencyRateResponseSchema> &
  CurrencyRatePairsParams;

export const getCurrencyRatePairs = async ({
  baseCurrency,
  pairs,
}: CurrencyRatePairsParams) => {
  try {
    const response = await currencyRatesService.getCurrencyRates(baseCurrency);

    const validatedResponse = decode(response, currencyRateResponseSchema);

    return mapToCurrencyRatePairs({ ...validatedResponse, pairs, baseCurrency });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

function mapToCurrencyRatePairs({
  base_code,
  pairs,
  rates,
  baseCurrency,
}: MapToCurrencyParams): { baseCurrency: string; pairs: Record<string, number> } {
  return {
    baseCurrency: base_code,
    pairs: pairs.reduce(
      (acc, currency) => ({
        ...acc,
        [`${baseCurrency}to${currency}`]: rates[currency],
      }),
      {}
    ),
  };
}
