var userName = document.getElementById("userName");
var email = document.getElementById("email");
var password = document.getElementById("password");
var repeatPassword = document.getElementById("repeatPassword");

function registerUser() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState != 4) return;
    switch (this.status) {
      case 400:
        alert("No username or email or password");
        break;
      case 409:
        alert("Duplicated user name");
        break;
      case 500:
        alert("Server error");
        break;
      case 201:
        loginUser();
        break;
      default:
        alert("Unknown error");
        break;
    }
  };
  xhttp.open("POST", "http://wd.etsisi.upm.es:10000/users", false);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(new URLSearchParams({ username: userName.value, email: email.value, password: password.value }));
}
function checkUserNameExist() {
  if (password.value.length > 8) {
    alert("The password can contain a maximum of 8 characters");
    return;
  }
  if (password.value != repeatPassword.value) {
    alert("Passwords must match");
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState != 4) return;
    switch (this.status) {
      case 404:
        registerUser();
        break;
      case 500:
        alert("Server error");
        break;
      case 200:
        alert("Username to indicate already exists");
        break;
      default:
        alert("Unknown error");
        break;
    }
  };
  xhttp.open("GET", "http://wd.etsisi.upm.es:10000/users/" + userName.value, false);
  xhttp.send(null);
}
function loginUser() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState != 4) return;
    switch (this.status) {
      case 400:
        alert("no username or password");
        break;
      case 401:
        alert("invalid username/password supplied");
        break;
      case 500:
        alert("Server error");
        break;
      case 200:
        localStorage["authorization"] = this.getResponseHeader("Authorization");
        history.back();
        break;
      default:
        alert("Unknown error");
        break;
    }
  };
  xhttp.open(
    "GET",
    "http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: userName.value, password: password.value }),
    false
  );
  xhttp.send(null);
}
