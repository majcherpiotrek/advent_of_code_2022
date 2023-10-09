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

function maxProfit2(prices: number[]): number {
  let profit = 0;
  let buyDay = 0;
  let sellDay = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < prices[buyDay]) {
      buyDay = i;
    }

    if (prices[i] > prices[sellDay]) {
      sellDay = i;
    }

    if (sellDay < buyDay) {
      sellDay = buyDay;
    }

    const sellProfit = prices[sellDay] - prices[buyDay];

    if (sellProfit > 0) {
      profit += sellProfit;
      buyDay = sellDay;
    }
  }

  return profit;
}

console.log(maxProfit2([7,6,4,3,1]))
