//Contains logic for filtering the coin dataset.

// פעולת פילטר לרשימת מטבעות
export function filterCoins(coins, searchInput) {
  const searchText = searchInput.toLowerCase().trim();
  if (!searchText) {
    return coins;
  }
  return coins.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(searchText) ||
      coin.symbol.toLowerCase().includes(searchText)
    );
  });
}
