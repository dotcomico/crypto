import { getCoinDetails, getCryptoCoins } from "./api/CoinApiService.js";
import { CoinData } from "./modules/CoinData.js";
import { coinsManager } from "./modules/CoinsDataManager.js";
import { filterCoins } from "./modules/CoinSearchHandler.js";
import { createSwitchSection } from "./modules/CoinSwitchHandler.js";
import { reportCoinsManager } from "./modules/ReportCoinsManager.js";
import { closeInfo, showInfo } from "./ui/CoinInfoDisplay.js";
import { createErrorAlert } from "./ui/ErrorAlert.js";

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
        renderCoins(coins);
      })
      .catch((err) => {
        displayErrorAlert(err.message);
        $searchBar.prop("disabled", true);
      });
  }

  //
  function renderCoins(coins) {
    $coinsContainer.empty();
    coins.forEach((element, index) => {
      addCoinCard(element, index);
    });
  }

  // הוספת כרטיס מטבע לקונטיינר
  function addCoinCard(coin, index) {
    const card = createCoinCard(coin, index);
    const inlineCard = card.find(".coin-card");
    const moreInfoBtn = inlineCard.find(".btn-more-info");

    handleMoreInfoToggle(coin, inlineCard, moreInfoBtn);

    $coinsContainer.append(card);
  }

  //יצירת מבנה כרטיס
  function createCoinCard(coin, index) {
    const card = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12");
    const inlineCard = $("<div>").addClass("card coin-card");
    const cardBody = $("<div>").addClass("card-body");

    const flex = createCardLayout(coin, index);

    cardBody.append(flex);
    inlineCard.append(cardBody);
    card.append(inlineCard);

    return card;
  }

  //יצירת לייאאוט פנימי לכרטיס
  function createCardLayout(coin, index) {
    const flex = $("<div>").addClass(
      "d-flex justify-content-between align-items-start"
    );
    const leftDiv = createLeftSection(coin);
    const switchDiv = createSwitchSection(index, coin.symbol);

    flex.append(leftDiv, switchDiv);
    return flex;
  }

  //יצירת צד שמאל
  function createLeftSection(coin) {
    const leftDiv = $("<div>");
    leftDiv.append(`<h5 class="card-title">${coin.symbol}</h5>`);
    leftDiv.append(`<p class="card-text">${coin.name}</p>`);

    const moreInfoBtn = createMoreInfoButton();
    leftDiv.append(moreInfoBtn);

    return leftDiv;
  }

  // יצירת כפתור More Info
  function createMoreInfoButton() {
    return $("<button>")
      .addClass("btn-more-info btn btn-primary btn-sm rounded-pill")
      .attr({ type: "button" })
      .html(`<i class="bi bi-info-circle-fill"></i> More info`);
  }

  //טיפול באירוע לחיצה
  function handleMoreInfoToggle(coin, inlineCard, moreInfoBtn) {
    let isInfoVisible = false;
    let collapse = null;

    moreInfoBtn.on("click", () => {
      if (isInfoVisible) {
        closeInfo(collapse, moreInfoBtn);
        isInfoVisible = false;
        collapse = null;
      } else {
        collapse = showInfo(coin, inlineCard, moreInfoBtn);
        isInfoVisible = true;
      }
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
    renderCoins(filteredCoins);
  });
});
