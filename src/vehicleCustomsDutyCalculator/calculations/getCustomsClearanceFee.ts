/**
 * 1.Helper function to calculate customs clearance fee(Сбор за таможенное оформление)
 * @returns The customs clearance fee in RUB.
 */
export const getCustomsClearanceFee = (carPriceRub: number) => {
  if (carPriceRub <= 200_000) return 775;
  if (carPriceRub <= 450_000) return 1550;
  if (carPriceRub <= 1_200_000) return 3100;
  if (carPriceRub <= 2_700_000) return 8530;
  if (carPriceRub <= 4_200_000) return 12000;
  if (carPriceRub <= 5_500_000) return 15500;
  if (carPriceRub <= 7_000_000) return 20000;
  if (carPriceRub <= 8_000_000) return 23000;
  if (carPriceRub <= 9_000_000) return 25000;
  if (carPriceRub <= 10_000_000) return 27000;
  return 30000;
};
