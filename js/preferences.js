$(document).ready(function () {
  var ufoPreference = localStorage["ufoPreference"] || undefined;
  var timePreference = localStorage["timePreference"] || undefined;
  if (ufoPreference != undefined) $("#numUfos").val(ufoPreference);
  if (timePreference != undefined) $("#gameTime").val(timePreference);
});

function savePreferences() {
  console.log("ufos:" + $("#numUfos").val());
  localStorage["ufoPreference"] = $("#numUfos").val();
  localStorage["timePreference"] = $("#gameTime").val();
  window.location.href = "game.html";
}
