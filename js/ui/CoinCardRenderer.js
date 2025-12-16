import { createSwitchSection } from "../modules/CoinSwitchHandler.js";
import { closeInfo, showInfo } from "./CoinInfoDisplay.js";

// רינדור רשימת מטבעות
export function renderCoins(coins, container) {
  container.empty();
  coins.forEach((element, index) => {
    addCoinCard(element, index, container);
  });
}

// הוספת כרטיס מטבע לקונטיינר
function addCoinCard(coin, index, container) {
  const card = createCoinCard(coin, index);
  const inlineCard = card.find(".coin-card");
  const moreInfoBtn = inlineCard.find(".btn-more-info");

  handleMoreInfoToggle(coin, inlineCard, moreInfoBtn);

  container.append(card);
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
