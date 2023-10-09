function maxProfit(prices: number[]): number {
  if (prices.length < 2) return 0;

  return prices.reduce((current, price) => {
    const min = Math.min(current.min, price);

    return {
      min,
      max: Math.max(current.max, price - min),
    }
  }, { min: prices[0], max: 0 }).max;

}


console.log(maxProfit([7, 1, 5, 3, 6, 4]))
