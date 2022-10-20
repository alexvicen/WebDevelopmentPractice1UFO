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
