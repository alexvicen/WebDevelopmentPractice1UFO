var forms = document.querySelectorAll(".needs-validation");

function loginUser() {
  loginCall();
}

function loginCall() {
  var name = document.getElementById("userName");
  var password = document.getElementById("password");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.status != 200) {
    } else {
    }
  };
  console.log("http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: name.value, password: password.value }));
  xhttp.open("GET", "http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: name.value, password: password.value }), false);
  xhttp.send(null);
}
