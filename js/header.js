$(document).ready(function () {
  $("#headerP").load("header.html", function () {
    var authorization = localStorage["authorization"] || undefined;
    var register = document.getElementById("register");
    var login = document.getElementById("login");
    var logOut = document.getElementById("logOut");

    if (authorization == undefined) {
      register.style.visibility = "visible";
      login.style.visibility = "visible";
      logOut.style.visibility = "hidden";
    } else {
      register.style.visibility = "hidden";
      login.style.visibility = "hidden";
      logOut.style.visibility = "visible";
    }
  });
});

function logOutUser() {
  window.localStorage.removeItem("authorization");
  window.localStorage.removeItem("ufoPreference");
  window.localStorage.removeItem("timePreference");
  window.location.reload();
}
