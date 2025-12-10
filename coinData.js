export class CoinData {
  static CACHE_TIMEOUT_MINUTES = 2;
  constructor(name, symbol, img, priceUSD, priceEUR, priceILS, time = null) {
    this.name = name;
    this.symbol = symbol;
    this.time = time || Date.now();
    this.img = img;
    this.priceUSD = priceUSD;
    this.priceEUR = priceEUR;
    this.priceILS = priceILS;
  }
  isUpToDate() {
    // אם ערך זמן קיים &&  לא עברו 2 דקות מטעינה אחרונה - תציג שוב
    const now = Date.now();

    if (this.time) {
      const diffMs = now - Number(this.time); // הפרש במילישניות
      const diffMinutes = diffMs / 1000 / 60; // המרה לדקות
      if (diffMinutes <= CoinData.CACHE_TIMEOUT_MINUTES) {
        console.log(this.name+" המידע עדיין עדכני - "+diffMinutes);
        return true;
      } else {
        console.log(this.name+" המידע ישן - "+diffMinutes);
        return false;
      }
    }
    console.log(this.name + 'אין זמן קיים');
    return false;
  }
}
