import { getCryptoCoins } from "./api/CoinApiService.js";
import { filterCoins } from "./modules/CoinSearchHandler.js";
import { renderCoins } from "./ui/CoinCardRenderer.js";
import { createErrorAlert } from "./ui/ErrorAlert.js";
import { closeDialog } from "./ui/MaxCoinsDialogManager.js";

$(() => {
  let coins = [];
  const $searchBar = $("#searchBar");
  const $coinsContainer = $("#coinsGrid");

  // קריאה לטעינת מטבעות
  getCoins();

  // קבלת מטבעות
  function getCoins() {
    getCryptoCoins()
      .then((data) => {
        coins = data;
        renderCoins(coins, $coinsContainer);
      })
      .catch((err) => {
        displayErrorAlert(err.message);
        $searchBar.prop("disabled", true);
      });
  }

  // פונקציה להצגת שגיאת fetch
  function displayErrorAlert(message) {
    $coinsContainer.empty();
    $coinsContainer.append(createErrorAlert(message));
  }

  // טיפול בלחיצה על כפתור חיפוש מטבעות
  $("#searchBtn").on("click", function () {
    const filteredCoins = filterCoins(coins, $searchBar.val());
    renderCoins(filteredCoins, $coinsContainer);
  });

  // טיפול בכפתור דיאלוג
  $("#cancel-button").on("click", function () {
    closeDialog();
  });

  // טיפול בלחיצה מחוץ למסגרת הדיאלוג
  $("#simpleDialog").on("click", function (e) {
    closeDialog();
  });
});
