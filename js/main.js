import { CoinData } from "./modules/coinData.js";
import { coinsManager } from "./coinsDataManeger.js";

$(() => {
  const API_COINS =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1";
  const API_COINS_DATA = "https://api.coingecko.com/api/v3/coins/"; // + COIN ID !
  let coins = [];

  const $searchBar = $("#searchBar");
  const $coinsContainer = $("#coinsGrid");

  getCryptoCoins();

  $searchBar.on("input", function () {
    let searchInput = this.value + "";
    const filteredCoins = coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(searchInput) ||
        coin.symbol.toLowerCase().includes(searchInput)
      );
    });
    renderCoins(filteredCoins);
  });

  // Functions
  function renderCoins(coins) {
    $coinsContainer.empty();
    coins.forEach((element, index) => {
      addCoinCard(element, index);
    });
  }

  function getCryptoCoins() {
    // קבלת נתונים Api
    fetch(API_COINS)
      .then((res) => res.json())
      .then((data) => {
        coins = data.slice(0, 30);
        renderCoins(coins);
      })
      .catch((err) => alert(err));
  }

  function addCoinCard(coin, index) {
    let Card = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12");
    let inlineCard = $("<div>").addClass("card coin-card");
    let cardBody = $("<div>").addClass("card-body");
    let flex = $("<div>").addClass(
      "d-flex justify-content-between align-items-start"
    );

    //  צד שמאל #####
    let leftDiv = $("<div>");
    leftDiv.append(`<h5 class="card-title">${coin.symbol}</h5>`);
    leftDiv.append(`<p class="card-text">${coin.name}</p>`);

    // כפתור more info
    let moreInfoBtn = $("<button>")
      .addClass("btn-more-info btn btn-primary btn-sm rounded-pill")
      .attr({
        type: "button",
      })
      .html(`<i class="bi bi-info-circle-fill"></i> More info`);
    leftDiv.append(moreInfoBtn);

    //  צד ימין ####
    let switchDiv = $("<div>").addClass("form-check form-switch");
    let switchInput = $("<input>")
      .addClass("form-check-input switch")
      .attr({
        type: "checkbox",
        role: "switch",
        id: `switchCheckDefault-${index}`,
      });
    switchDiv.append(switchInput);

    // חיבור שני הצדדים
    flex.append(leftDiv);
    flex.append(switchDiv);

    // הוספה ל־card
    cardBody.append(flex);
    inlineCard.append(cardBody);
    Card.append(inlineCard);
    $coinsContainer.append(Card);

    // משתנה לעקוב אחרי מצב הצגה
    let isInfoVisible = false;
    let collapse = null;

    //---פעולות בעת לחיצה על כפתור---
    moreInfoBtn.on("click", function () {
      // אם מידע המטבע כבר מוצג - תסגור נראות
      if (isInfoVisible && collapse) {
        collapse.slideUp(300, function () {
          collapse.remove();
          collapse = null;
        });
        isInfoVisible = false;
        moreInfoBtn.html(`<img class="bi bi-info-circle-fill"></i> More info`);
        return;
      }
      // אם מידע המטבע לא מוצג
      const cachedCoinData = coinsManager.getCoinDataBySymbol(coin.symbol);
      if (cachedCoinData && cachedCoinData.isUpToDate()) {
        // בדוק תקינות נתונים שמורים
        //נתונים תקינים - הצג מחדש
        collapse = $("<div>").css("display", "none");
        let collapseBody = creatExtendedData(cachedCoinData);
        collapse.append(collapseBody);
        inlineCard.append(collapse);
        collapse.slideDown(300);
        isInfoVisible = true;
        moreInfoBtn.html(`<i class="bi bi-x-circle-fill"></i> Close`);
        console.log(coin.symbol + "תונים תקינים - מציג מחדש");
      } else {
        // נתונים לא תקינים - צור מחדש והצג
        console.log(coin.symbol + " נתונים לא תקינים - יוצר מחדש ומציג");
        // שנה נראות כפתור לטעינת נתונים
        moreInfoBtn.html(
          `<img src='Image/hourglass.gif' style="max-width: 20px;"></img> Loading...`
        );
        //קבל נתונים
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
            collapse = $("<div>").css("display", "none");
            let collapseBody = creatExtendedData(newCoinData);
            collapse.append(collapseBody);
            inlineCard.append(collapse);
            collapse.slideDown(300);
            isInfoVisible = true;
            moreInfoBtn.html(`<i class="bi bi-x-circle-fill"></i> Close`);
          })
          .catch((err) => {
            alert('"More info" API error: ' + err);
            moreInfoBtn.html(
              `<i class="bi bi-info-circle-fill"></i> More info`
            );
          });
      }
    });
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
});
