export class coinData{
    static CACHE_TIMEOUT_MINUTES = 2; 
    constructor(name,symbole, img , priceUSD, priceEUR , priceILS){
        this.name = name;
        this.symbole=symbole;
        this.time=Date.now();
        this.img = img;
        this.priceUSD =priceUSD;
        this.priceEUR = priceEUR;
        this.priceILS = priceILS;
    }
     isUpToDate() {
              // אם המידע כבר התקבל ונשמר &&  לא עברו 2 דקות מטעינה אחרונה - תציג שוב
                const now = Date.now();

                if (this.time) {  // אולי אין צורך אם מתחייבים שזה מידע שיהיה קיים
                    const diffMs = now - Number(this.time); // הפרש במילישניות
                    const diffMinutes = diffMs / 1000 / 60; // המרה לדקות
                    if (diffMinutes <= this.CACHE_TIMEOUT_MINUTES) {
                        console.log("המידע עדיין עדכני (פחות מ-2 דקות)");
                        return true;
                    } else {
                        console.log("המידע ישן (יותר מ-2 דקות)");
                        return false;
                    }
                }
                console.log('מידע לא קיים');
                return false;
    }
}