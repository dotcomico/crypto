
// - createAndShowCollapse()
// - creatExtendedData()
// - setLoadingState()
// - handleFetchError()

import { getCoinDetails } from "../api/CoinApiService.js";
import { CoinData } from "../modules/CoinData.js";
import { coinsManager } from "../modules/CoinsDataManager.js";


 // סגירת מידע נוסף
  export  function closeInfo(collapse, moreInfoBtn) {
    collapse.slideUp(300, function () {
      collapse.remove();
    });
    moreInfoBtn.html(`<i class="bi bi-info-circle-fill"></i> More info`);
  }

  //הצגת מידע נוסף
  export  function showInfo(coin, inlineCard, moreInfoBtn) {
    const cachedCoinData = coinsManager.getCoinDataBySymbol(coin.symbol);

    if (cachedCoinData && cachedCoinData.isUpToDate()) {
      console.log(cachedCoinData.symbol + "נתונים תקינים, מציג מחדש");
      moreInfoBtn.html(`<i class="bi bi-x-circle-fill"></i> Close`);
      return createAndShowCollapse(cachedCoinData, inlineCard);
    } else {
      console.log(coin.symbol + "נתונים לא תקינים, שולף מחדש");
      return displayCoinData(coin, inlineCard, moreInfoBtn);
    }
  }

    function displayCoinData(coin, inlineCard, moreInfoBtn) {
      setLoadingState(moreInfoBtn);
  
      const collapse = $("<div>").css("display", "none");
      inlineCard.append(collapse);
  
      getCoinDetails(coin.id)
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

  //טיפול בשגיאות (נראות כפתור moreInfo)
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
    extendedData.append(`<img src="${img}" alt="${name}" class="mb-3 coin-img">`);
    extendedData.append(`
                        <div class="price-item">
                            <span>Dollar (USD): </span>
                            <span class="price-value">${priceUSD}$</span>
                        </div>
                    `);
    extendedData.append(`
                        <div class="price-item">
                            <span class="price-label">Euro (EUR): </span>
                            <span class="price-value">${priceEUR}€</span>
                        </div>
                    `);
    extendedData.append(`
                        <div class="price-item">
                            <span class="price-label">Shekel (ILS): </span>
                            <span class="price-value">${priceILS}₪</span>
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
