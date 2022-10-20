$("#userName").focusout(function () {
  if ($("#userName").val().length <= 0) return;
  checkUserNameExist();
});

$("#userName").focusin(function () {
  $("#userNameDiv").removeClass("neon_text_error");
  $("#userNameDiv").addClass("neon_text");
});

function registerUser() {
  if ($("#password").val().length > 8) {
    alert("The password can contain a maximum of 8 characters");
    return;
  }
  if ($("#password").val() != $("#repeatPassword").val()) {
    alert("Passwords must match");
    return;
  }
  var http_request = new XMLHttpRequest();
  var url = "http://wd.etsisi.upm.es:10000/users";
  http_request.open("POST", url, true);
  http_request.responseType = "json";
  http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  http_request.onload = registerTreatment;
  http_request.send("username=" + $("#userName").val() + "&email=" + $("#email").val() + "&password=" + $("#password").val());

  function registerTreatment() {
    switch (http_request.status) {
      case 400:
        showErrorDialog(undefined, undefined, "No username or email or password");
        break;
      case 409:
        showErrorDialog("#userNameDiv", "#userName", "Duplicated user name");
        break;
      case 500:
        showErrorDialog(undefined, undefined, "Server error");
        break;
      case 201:
        loginUser();
        break;
      default:
        showErrorDialog(undefined, undefined, "Unknown error");
        break;
    }
  }
}
function checkUserNameExist() {
  var http_request = new XMLHttpRequest();
  var url = "http://wd.etsisi.upm.es:10000/users/" + $("#userName").val();
  http_request.open("GET", url, true);
  http_request.onload = checkUserNameTreatment;
  http_request.send();

  function checkUserNameTreatment() {
    console.log("Status-" + http_request.status);
    switch (http_request.status) {
      case 404:
        break;
      case 500:
        showErrorDialog(undefined, undefined, "Server error");
        break;
      case 200:
        showErrorDialog("#userNameDiv", "#userName", "User name in use");
        break;
      default:
        showErrorDialog(undefined, undefined, "Unknown error");
        break;
    }
  }
}
function loginUser() {
  var http_request = new XMLHttpRequest();
  var url = "http://wd.etsisi.upm.es:10000/users/login?" + new URLSearchParams({ username: $("#userName").val(), password: $("#password").val() });
  http_request.open("GET", url, true);
  http_request.onload = loginTreatment;
  http_request.send();

  function loginTreatment() {
    switch (http_request.status) {
      case 400:
        showErrorDialog(undefined, "#userName", "no username or password");
        break;
      case 401:
        showErrorDialog(undefined, "#userName", "invalid username/password supplied");
        break;
      case 500:
        showErrorDialog(undefined, undefined, "Server error");
        break;
      case 200:
        localStorage["authorization"] = http_request.getResponseHeader("Authorization");
        history.back();
        break;
      default:
        showErrorDialog(undefined, undefined, "Unknown error");
        break;
    }
  }
}

function showErrorDialog(divTarget, tarjetInput, messageText) {
  if (divTarget != undefined) {
    $(divTarget).removeClass("neon_text");
    $(divTarget).addClass("neon_text_error");
  }

  $("#dialog").addClass("ui-dialog-titlebar");
  $("#dialog").addClass("ui-widget-header");
  $("#dialog").addClass("ui-corner-all");
  $("#dialog").addClass("ui-helper-clearfix");
  $("#dialog").addClass("container_neon_border");
  $("#dialog").addClass("neon_text");
  $("#dialog").append('<p class="neon_text text-center" id="message">' + messageText + "</p>");
  $("#dialog")
    .dialog({
      title: "Error",
      modal: true,
      position: {
        my: "left",
        at: "right",
        of: $("#registerForm"),
      },
    })
    .prev(".ui-dialog-titlebar")
    .css("background", "rgb(152, 246, 255)");

  $("#dialog").on("dialogclose", function (event) {
    $("#message").remove();
    if (tarjetInput != undefined) {
      $(tarjetInput).focus();
    }
  });
}
