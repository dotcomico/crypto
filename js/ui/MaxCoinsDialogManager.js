import { reportCoinsManager } from "../modules/ReportCoinsManager.js";

//  Logic for managing the 'Max 5 Coins' selection modal.

// פתיחת דיאלוג
export function openDialog(newCoinSymbol) {
  $("#simpleDialog").addClass("is-active");
  createCoinList(reportCoinsManager.reportCoins, newCoinSymbol);
}
// סגירת דיאלוג
export function closeDialog() {
  $("#simpleDialog").removeClass("is-active");
}

// יצירת הדיאלוג
function createCoinList(coinsArray, newCoinSymbol) {
  const $container = $("#dialogCoinContainer");
  $container.empty();

  coinsArray.forEach((coinSmbole) => {
    const $coinItem = $("<div>").addClass("dialog-coin-item").text(coinSmbole);
    $coinItem.on("click", function (e) {
      reportCoinsManager.remove(coinSmbole);
      reportCoinsManager.add(newCoinSymbol);
      location.reload(); // רענון הדף
    });
    $container.append($coinItem);
  });
}
