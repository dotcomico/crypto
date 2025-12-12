const $coinsNav = $("#coinsNav");
const $LiveReportsNav = $("#LiveReportsNav");
const $aboutNav = $("#aboutNav");

// Displays
const $coinsDisplay = $("#coinsDisplay");
const $liveReportsDisplay = $("#liveReportsDisplay");
const $aboutDisplay = $("#aboutDisplay");

// Events
$coinsNav.on("click", function () {
  showSection($coinsDisplay);
});
$LiveReportsNav.on("click", function () {
  showSection($liveReportsDisplay);
});
$aboutNav.on("click", function () {
  showSection($aboutDisplay);
});

  function showSection(sectionToShow) {
    $(".display-section").hide();
    sectionToShow.show();
  }
