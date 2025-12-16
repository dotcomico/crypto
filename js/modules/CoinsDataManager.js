import { CoinData } from "./CoinData.js";


class CoinsDataManager {
  LS_KEY = "crypto_coins_data";
  coinsDataList = [];

  constructor() {
    this.loadCoinsFromLocal(); // טעינת הנתונים ברגע יצירת CoinsDataManager
  }

  // טעינת נתונים מהlocalStorge
  loadCoinsFromLocal() {
    const jsonString = localStorage.getItem(this.LS_KEY);
    if (jsonString) {
      const dataArray = JSON.parse(jsonString);

      this.coinsDataList = dataArray.map(
        (item) =>
          new CoinData(
            item.name,
            item.symbol,
            item.img,
            item.priceUSD,
            item.priceEUR,
            item.priceILS,
            item.time
          )
      );
      console.log("מידע מטבעות - נטען");
    }
  }
 // שמירת נתונים לlocalStorege
  saveListToLocal() {
    localStorage.setItem(this.LS_KEY, JSON.stringify(this.coinsDataList));
  }

  //שמירת/עדכון מטבע
  saveCoinData(coin) {
    // בדוק אם המטבע כבר קיים
    const existingIndex = this.coinsDataList.findIndex(
      (c) => c.symbol === coin.symbol
    );

    if (existingIndex !== -1) {
      // אם קיים - עדכן (כתוב עליו מחדש)
      this.coinsDataList[existingIndex] = coin;
      console.log("מידע המטבע " + coin.symbol + " עודכן");
    } else {
      // אם לא קיים - הוסף
      this.coinsDataList.push(coin);
      console.log("מידע המטבע " + coin.symbol + " נשמר");
    }

    // שמור את כל הרשימה לאחר השינוי
    this.saveListToLocal();
  }

  // שליפה
  getCoinDataBySymbol(symbol) {
      console.log(symbol + 'מידע התקבל  ');
    return this.coinsDataList.find((coin) => coin.symbol === symbol);
    
  }

  isCoinInCache(symbol) {
    // אם המתודה מחזירה אובייקט (כלומר, לא undefined), זה אומר שהמטבע קיים.
    return !!this.getCoinDataBySymbol(symbol);
    // לחלופין, ניתן להשתמש ב-findIndex:
    // return this.coinsDataList.findIndex(coin => coin.symbole === symbol) !== -1;
  }
}

export const coinsManager = new CoinsDataManager();
