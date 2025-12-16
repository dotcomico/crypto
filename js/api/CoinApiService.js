const API_COINS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1";
const API_COINS_DATA = "https://api.coingecko.com/api/v3/coins/"; // + COIN ID

// קבלת נתונים Api
export function getCryptoCoins() {
  return fetch(API_COINS)
    .then((res) => res.json())
    .then((data) => data.slice(0, 30));
}

// קבלת נתונים מורחבים למטבע בודד

export function getCoinDetails(coinId) {
  return fetch(API_COINS_DATA + coinId).then((res) => res.json());
}
