var ship = document.getElementById("jet");
var board = document.getElementById("board");
var time = document.getElementById("time");
var points = document.getElementById("points");
var isRuning = false;
var bullet = undefined;
var gameInterval;
var score = 0;

var rectBoard = board.getBoundingClientRect();
var rectShip = ship.getBoundingClientRect();

const BOARD_LEFT = rectBoard.left;
const BOARD_RIGHT = rectBoard.right;
const BOARD_TOP = rectBoard.top;
const BOARD_BOTTOM = rectBoard.bottom;

const SHIP_BOTTOM = rectShip.bottom;

const BOARD_WIDTH = BOARD_RIGHT - BOARD_LEFT;
const BOARD_HEIGHT = BOARD_BOTTOM - BOARD_TOP;

const SHIP_WIDTH = 60;
const SHIP_HEIGHT = 80;
const ENEMY_WIDTH = 65;
const ENEMY_HEIGHT = 65;

const BULLET_MOVEMENT = 3;
const SHIP_MOVEMENT = 20;
const ROCKET_MOVEMENT = 5;

var ufoPreference = localStorage["ufoPreference"] || 1;
var timePreference = localStorage["timePreference"] || 60;
var userName = localStorage["userName"] || undefined;
var authorization = localStorage["authorization"] || undefined;

time.innerHTML = timePreference;

$(document).ready(function () {
  createBoard();
});

window.addEventListener("keydown", (e) => {
  if (!isRuning) return;
  var left = parseInt(window.getComputedStyle(ship).getPropertyValue("left"));
  if (e.key == "ArrowLeft" && left > 0) {
    ship.style.left = left - SHIP_MOVEMENT + "px";
  } else if (e.key == "ArrowRight" && left <= BOARD_WIDTH - SHIP_WIDTH * 1.5) {
    ship.style.left = left + SHIP_MOVEMENT + "px";
  }

  if ((e.key == "ArrowUp" || e.key == " ") && bullet == undefined) {
    shot();
  }
});

function shot() {
  bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = ship.getBoundingClientRect().left + SHIP_WIDTH / 3 + "px";
  bullet.style.bottom = ship.getBoundingClientRect().bottom - BOARD_HEIGHT + SHIP_HEIGHT + "px";
  board.appendChild(bullet);

  var maxBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom")) + BOARD_HEIGHT - 80;
  var movebullet = setInterval(() => {
    if (!isRuning) return;
    var enemies = document.getElementsByClassName("enemies");

    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      if (enemy != undefined) {
        var enemyBound = enemy.getBoundingClientRect();
        var bulletBound = bullet.getBoundingClientRect();
        if (
          ((bulletBound.left >= enemyBound.left && bulletBound.left <= enemyBound.right) ||
            (bulletBound.right >= enemyBound.left && bulletBound.right <= enemyBound.right)) &&
          bulletBound.top < enemyBound.bottom
        ) {
          addScore();
          enemy.parentElement.removeChild(enemy);
          if (enemies.length < 1) createBoard();
          clearInterval(movebullet);
          $(".bullets").remove();
          bullet = undefined;
          return;
        }
      }
    }
    var bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    if (bulletBottom >= maxBottom) {
      substractScore();
      clearInterval(movebullet);
      $(".bullets").remove();
      bullet = undefined;
      return;
    }
    bullet.style.bottom = bulletBottom + 3 + "px";
  });
}

function addScore() {
  score += 100;
  points.innerHTML = score;
}
function substractScore() {
  score -= 25;
  points.innerHTML = score;
}

function playPauseGame() {
  isRuning = !isRuning;
  board.focus();
  changePlayPauseText();
}

function changePlayPauseText() {
  var text = document.getElementById("playText");
  if (isRuning) text.innerHTML = "Pause";
  else text.innerHTML = "Play";

  if (gameInterval != undefined) return;
  var interval = timePreference * 1000;
  gameInterval = setInterval(() => {
    if (!isRuning) return;
    interval -= 1000;
    time.innerHTML = interval / 1000;
    if (interval <= 0) {
      clearInterval(gameInterval);
      isRuning = false;
      showErrorDialog();
    }
  }, 1000);
}

function createBoard() {
  for (var i = 0; i < ufoPreference; i++) {
    generateEnemy();
  }
}

function generateEnemy() {
  var rock = document.createElement("div");
  rock.classList.add("enemies");
  var maxLeft = BOARD_LEFT + 5;
  var maxRigh = BOARD_RIGHT - ENEMY_WIDTH - 5;
  var maxTop = BOARD_BOTTOM - BOARD_TOP + ENEMY_HEIGHT + 5;
  var maxBottom = (BOARD_BOTTOM - BOARD_TOP) / 2 + ENEMY_HEIGHT + 5;

  rock.style.left = Math.floor(Math.random() * (maxRigh - maxLeft + 1)) + maxLeft + "px";
  rock.style.bottom = Math.floor(Math.random() * (maxTop - maxBottom + 1)) + maxBottom + "px";
  board.appendChild(rock);
}

function saveRecords() {
  var http_request = new XMLHttpRequest();
  var url = "http://wd.etsisi.upm.es:10000/records";
  http_request.open("POST", url, true);
  http_request.responseType = "json";
  http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  http_request.setRequestHeader("Authorization", authorization);
  http_request.onload = saveRecordsTreatment;
  http_request.send("punctuation=" + score + "&ufos=" + ufoPreference + "&disposedTime=" + timePreference);

  function saveRecordsTreatment() {
    switch (http_request.status) {
      case 201:
        $("#dialog").dialog("close");
        break;
      default:
        alert("ERROR SAVING RECORD");
        $("#dialog").dialog("close");
        break;
    }
  }
}

function calculateFinalScore() {
  var minutesDivider = timePreference / 60;
  var ufosSubstract = (ufoPreference - 1) * 50;
  console.log("divider: " + minutesDivider + " - substract: " + ufosSubstract);
  return score / minutesDivider - ufosSubstract;
}

function showErrorDialog() {
  $("#dialog").addClass("ui-dialog-titlebar");
  $("#dialog").addClass("ui-widget-header");
  $("#dialog").addClass("ui-corner-all");
  $("#dialog").addClass("ui-helper-clearfix");
  $("#dialog").addClass("neon_text");
  $("#dialog").append(generateDialogString());
  $("#dialog")
    .dialog({
      title: "Game score",
      modal: true,
      width: 600,
      height: 500,
      position: {
        my: "center",
        at: "center",
        of: $("#board"),
      },

      buttons: [
        {
          text: "Play again",
          click: function () {
            $(this).dialog("close");
          },
        },
        {
          text: "Save result",
          click: function () {
            saveRecords();
          },
        },
      ],
      open: function () {
        $(".ui-dialog-buttonpane").find('button:contains("Play again")').addClass("neon_border");
        $(".ui-dialog-buttonpane").find('button:contains("Save result")').addClass("neon_border");
        if (userName == undefined) {
          $(".ui-dialog-buttonpane").find('button:contains("Save result")').remove();
        }
      },
    })
    .prev(".ui-dialog-titlebar")
    .css("background", "rgb(152, 246, 255)");

  $("#dialog").on("dialogclose", function (event) {
    location.reload();
  });
}

function generateDialogString() {
  if (userName == undefined) {
    return (
      '</p><div class="container text-center container_neon_border"><div class="row justify-content-md-center" id="records_table"><table><tr class="tr"><th class="th">punctuation</th><th class="th">ufos</th><th class="th">disposedTime</th><th class="th">recordDate</th></tr><tr class="tr"><td>' +
      calculateFinalScore() +
      "</td><td>" +
      ufoPreference +
      "</td><td>" +
      timePreference +
      "</td><td>" +
      new Date().toLocaleDateString("es-ES") +
      "</td></tr></table></div></div>"
    );
  } else {
    return (
      '</p><div class="container text-center container_neon_border"><div class="row justify-content-md-center" id="records_table"><table><tr class="tr"><th class="th">username</th><th class="th">punctuation</th><th class="th">ufos</th><th class="th">disposedTime</th><th class="th">recordDate</th></tr><tr class="tr"><td>' +
      userName +
      "</td><td>" +
      calculateFinalScore() +
      "</td><td>" +
      ufoPreference +
      "</td><td>" +
      timePreference +
      "</td><td>" +
      new Date().toLocaleDateString("es-ES") +
      "</td></tr></table></div></div>"
    );
  }
}
