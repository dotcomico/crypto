import { reportCoinsManager } from "./ReportCoinsManager.js";

export function createSwitchSection(index, coinSymbol) {
  const switchDiv = $("<div>").addClass("form-check form-switch");
  const switchInput = $("<input>")
    .addClass("form-check-input switch")
    .attr({
      type: "checkbox",
      role: "switch",
      id: `switchCheckDefault-${index}`,
    });

  // בדיקה אם הסוויץ מסומן
  updateSwitchState(switchInput, coinSymbol);

  // טיפול בשינוי מצב הסוויץ
  switchInput.on("change", function () {
    handleSwitchChange($(this), coinSymbol);
  });

  switchDiv.append(switchInput);
  return switchDiv;
}

function updateSwitchState(switchElement, coinSymbol) {
  const shouldBeChecked = reportCoinsManager.isInCache(coinSymbol);
  switchElement.prop("checked", shouldBeChecked);
}

function handleSwitchChange(switchElement, coinSymbol) {
  const isNowChecked = switchElement.is(":checked");
  if (isNowChecked) {
    const success = reportCoinsManager.add(coinSymbol);
    if (!success) {
      switchElement.prop("checked", false);
    }
  } else {
    reportCoinsManager.remove(coinSymbol);
  }
  console.log(reportCoinsManager.reportCoins);
}
