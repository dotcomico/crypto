export function fetchCoinsList() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1";
  return fetch(url).then(res => res.json());
}

export function fetchCoinDetails(coinId) {
  return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    .then(res => res.json());
}
