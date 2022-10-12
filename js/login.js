function loginUser() {
  var name = document.getElementById("userName");
  var password = document.getElementById("password");
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
  xhttp.open("GET", "http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: name.value, password: password.value }), false);
  xhttp.send(null);
}
