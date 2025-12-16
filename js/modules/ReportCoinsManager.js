import { openDialog } from "../ui/MaxCoinsDialogManager.js";

class ReportCoinsManager {
  LS_KEY = "report_coins_data";
  LIMIT = 5;
  reportCoins = [];

  constructor() {
    this.loadCoinsFromLocal(); // טעינת הנתונים ברגע יצירת reportCoinsManeger
  }

  // טעינת נתונים מהlocalStorge
  loadCoinsFromLocal() {
    const jsonString = localStorage.getItem(this.LS_KEY);
    if (jsonString) {
      this.reportCoins = JSON.parse(jsonString);
      console.log("מטבעות לדיווח -נטען");
    }
  }
  // שמירת נתונים לlocalStorege
  saveListToLocal() {
    localStorage.setItem(this.LS_KEY, JSON.stringify(this.reportCoins));
  }

  //שמירת מטבע
  add(symbol) {
    if (this.isInCache(symbol.trim().toUpperCase())) return true;

    if (this.reportCoins.length >= this.LIMIT) {
      openDialog(symbol.trim());
      return false;
    }

    this.reportCoins.push(symbol.trim().toUpperCase());
    this.saveListToLocal();
    return true;
  }

  // הסרת מטבע
  remove(symbol) {
    this.reportCoins = this.reportCoins.filter(
      (rc) => rc.toLowerCase() !== symbol.toLowerCase()
    );
    this.saveListToLocal();
  }
  // בדיקה האם מטבע שמור בנתונים
  isInCache(symbol) {
    return this.reportCoins.some(
      (rc) => rc.toLowerCase() === symbol.toLowerCase()
    );
  }
}

export const reportCoinsManager = new ReportCoinsManager();
