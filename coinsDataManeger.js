import { CoinData } from "./coinData.js";

class CoinsDataManeger {
    LS_KEY = 'crypto_coins_data';
    coinsDataList = [];

    constructor() {
        this.loadCoinsFromLocal(); // טוען את הנתונים ברגע יצירת המופע
    }

    // 1. טעינת נתונים מה-Local Storage ויצירת מופעים מחדש
    loadCoinsFromLocal() {
        const jsonString = localStorage.getItem(this.LS_KEY);
        if (jsonString) {
            const dataArray = JSON.parse(jsonString);

            // חובה ליצור מופע coinData מכל אובייקט JSON כדי שיהיו לו את המתודות!
            this.coinsDataList = dataArray.map(item => new CoinData(
                item.name, 
                item.symbol, // שם המשתנה כפי שהגדרת במחלקת coinData
                item.img, 
                item.priceUSD, 
                item.priceEUR, 
                item.priceILS
            ));
        }
    }

    // 2. שמירה או עדכון של מטבע בודד
    saveCoinData(coin) {
        // בדוק אם המטבע כבר קיים
        const existingIndex = this.coinsDataList.findIndex(c => c.symbol === coin.symbol)

        if (existingIndex !== -1) {
            // אם קיים - עדכן (כתוב עליו מחדש)
            this.coinsDataList[existingIndex] = coin;
            console.log('מידע המטבע ' + coin.symbol + ' עודכן');
        } else {
            // אם לא קיים - הוסף
            this.coinsDataList.push(coin);
            console.log('מידע המטבע ' + coin.symbol + ' נשמר');
        }

        // שמור את כל הרשימה ל-Local Storage לאחר השינוי
        this.saveListToLocal();
    }

    // פונקציית עזר לשמירת הרשימה כולה
    saveListToLocal() {
        localStorage.setItem(this.LS_KEY, JSON.stringify(this.coinsDataList));
    }
    // 3. שליפה (מתוקן)
    getCoinDataBySymbol(symbol) { // 🛑 הוספת הפרמטר symbol
        return this.coinsDataList.find(coin => coin.symbol === symbol);
    }
    isCoinInCache(symbol) {
        // אם המתודה מחזירה אובייקט (כלומר, לא undefined), זה אומר שהמטבע קיים.
        return !!this.getCoinDataBySymbol(symbol);
        
        // לחלופין, ניתן להשתמש ב-findIndex:
        // return this.coinsDataList.findIndex(coin => coin.symbole === symbol) !== -1;
    }
}

export const coinsManager = new CoinsDataManeger(); // ייצוא מופע יחיד (Singleton)