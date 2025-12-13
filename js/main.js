import { CoinData } from "./modules/coinData.js";
import { coinsManager } from "./coinsDataManeger.js";
import { reportCoinsManeger } from "./ReportCoinsManager.js";

$(() => {
  const API_COINS =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1";
  const API_COINS_DATA = "https://api.coingecko.com/api/v3/coins/"; // + COIN ID !
  let coins = [];

  const $searchBar = $("#searchBar");
  const $coinsContainer = $("#coinsGrid");

  getCryptoCoins();

  $("#searchBtn").on("click", function () {
    let searchInput = $searchBar.val() + "";
    const filteredCoins = coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(searchInput) ||
        coin.symbol.toLowerCase().includes(searchInput)
      );
    });
    renderCoins(filteredCoins);
  });

  function getCryptoCoins() {
    // קבלת נתונים Api
    fetch(API_COINS)
      .then((res) => res.json())
      .then((data) => {
        coins = data.slice(0, 30);
        renderCoins(coins);
      })
      .catch((err) => {
        displayErrorAlert(err.message);
        $searchBar.prop("disabled", true);
      });
  }
  // הצגת שגיאת fetch
  function displayErrorAlert(message) {
    $coinsContainer.empty();
    const errorMessage = $(`
        <div class="alert alert-danger text-center" role="alert">
          <h4 class="alert-heading"><i class="bi bi-exclamation-triangle-fill"></i> Data Loading Error</h4>
            <p>${message}</p>
            <hr>
           <p class="mb-0">Please try refreshing the page or checking your internet connection.</p>
        </div>
    `);
    $coinsContainer.append(errorMessage);
  }

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

  //יצירת צד ימין - Switch
  function createSwitchSection(index, coinSymbol) {
    const switchDiv = $("<div>").addClass("form-check form-switch");
    const switchInput = $("<input>")
      .addClass("form-check-input switch")
      .attr({
        type: "checkbox",
        role: "switch",
        id: `switchCheckDefault-${index}`,
      });
// בדיקה אם הסוויץ מסומן 
    if ( reportCoinsManeger.isInCache(coinSymbol)) {
    switchInput.prop("checked", true);     
     }else {
    switchInput.prop("checked", false);
     }

    switchInput.on("change", function () {
      const isNowChecked = $(this).is(":checked");
      if (isNowChecked) {
        const success = reportCoinsManeger.add(coinSymbol); // מקבלים תשובה האם התווסף או לא
        if(!success){
          $(this).prop("checked", false);
        }
      } else {
        reportCoinsManeger.remove(coinSymbol);
      }
      console.log(reportCoinsManeger.reportCoins);
    });

    switchDiv.append(switchInput);
    return switchDiv;
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

  // סגירת מידע נוסף
  function closeInfo(collapse, moreInfoBtn) {
    collapse.slideUp(300, function () {
      collapse.remove();
    });
    moreInfoBtn.html(`<i class="bi bi-info-circle-fill"></i> More info`);
  }

  //הצגת מידע נוסף
  function showInfo(coin, inlineCard, moreInfoBtn) {
    const cachedCoinData = coinsManager.getCoinDataBySymbol(coin.symbol);

    if (cachedCoinData && cachedCoinData.isUpToDate()) {
      console.log(cachedCoinData.symbol + "נתונים תקינים, מציג מחדש");
      moreInfoBtn.html(`<i class="bi bi-x-circle-fill"></i> Close`);
      return createAndShowCollapse(cachedCoinData, inlineCard);
    } else {
      console.log(coin.symbol + "נתונים לא תקינים, שולף מחדש");
      return fetchAndDisplayData(coin, inlineCard, moreInfoBtn);
    }
  }

  //שליפה ושימוש בנתונים עדכניים
  function fetchAndDisplayData(coin, inlineCard, moreInfoBtn) {
    setLoadingState(moreInfoBtn);

    const collapse = $("<div>").css("display", "none");
    inlineCard.append(collapse);

    fetch(API_COINS_DATA + coin.id)
      .then((res) => res.json())
      .then((data) => {
        const newCoinData = new CoinData(
          coin.name,
          coin.symbol,
          data.image.small,
          data.market_data.current_price.usd,
          data.market_data.current_price.eur,
          data.market_data.current_price.ils
        );
        coinsManager.saveCoinData(newCoinData);

        const collapseBody = creatExtendedData(newCoinData);
        collapse.append(collapseBody);
        collapse.slideDown(300);
        moreInfoBtn.html(`<i class="bi bi-x-circle-fill"></i> Close`);
      })
      .catch((err) => handleFetchError(err, moreInfoBtn));

    return collapse;
  }

  //מצב טעינה
  function setLoadingState(moreInfoBtn) {
    moreInfoBtn.html(
      `<img src='Image/hourglass.gif' style="max-width: 20px;"> Loading...`
    );
  }

  //טיפול בשגיאות
  function handleFetchError(err, moreInfoBtn) {
    console.error('"More info" API error: ' + err);
    moreInfoBtn.prop("disabled", true);

    // מכפתור לאדום
    moreInfoBtn.addClass("btn-error");
    moreInfoBtn.html(`<i class="bi bi-info-circle-fill"></i> Error`);

    //טיימר לחזרה למצב רגיל
    setTimeout(() => {
      moreInfoBtn.removeClass("btn-error");
      moreInfoBtn.html(`<i class="bi bi-info-circle-fill"></i> More info`);
      moreInfoBtn.prop("disabled", false);
    }, 3000);
  }

  function creatExtendedData({
    name,
    symbol,
    time,
    img,
    priceUSD,
    priceEUR,
    priceILS,
  }) {
    let extendedData = $("<div>").addClass("card-body border-top");
    extendedData.append(`<img src="${img}" alt="${name}" class="mb-3">`);
    extendedData.append(`
                        <div class="price-item">
                            <span>Dollar (USD): </span>
                            <span class="price-value">$${priceUSD}</span>
                        </div>
                    `);
    extendedData.append(`
                        <div class="price-item">
                            <span class="price-label">Euro (EUR): </span>
                            <span class="price-value">€${priceEUR}</span>
                        </div>
                    `);
    extendedData.append(`
                        <div class="price-item">
                            <span class="price-label">שקל (ILS): </span>
                            <span class="price-value">₪${priceILS}</span>
                        </div>
                    `);
    return extendedData;
  }
  function createAndShowCollapse(coinData, inlineCard) {
    const collapse = $("<div>").css("display", "none");
    const collapseBody = creatExtendedData(coinData);
    collapse.append(collapseBody);
    inlineCard.append(collapse);
    collapse.slideDown(300);
    return collapse;
  }
});
