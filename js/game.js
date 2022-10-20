var ship = document.getElementById("jet");
var board = document.getElementById("board");
var points = document.getElementById("points");
var createdEnemies = false;
var isRuning = false;
var bullet = undefined;

var rect = board.getBoundingClientRect();

const BOARD_LEFT = rect.left;
const BOARD_RIGHT = rect.right;
const BOARD_TOP = rect.top;
const BOARD_BOTTOM = rect.bottom;

const BOARD_WIDTH = BOARD_RIGHT - BOARD_LEFT;
const BOARD_HEIGHT = BOARD_BOTTOM - BOARD_TOP;

const SHIP_WIDTH = 60;
const SHIP_HEIGHT = 80;
const ENEMY_WIDTH = 65;
const ENEMY_HEIGHT = 65;

const BULLET_MOVEMENT = 3;
const SHIP_MOVEMENT = 20;
const ROCKET_MOVEMENT = 5;

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
  bullet.style.left = ship.style.left;
  board.appendChild(bullet);

  var maxBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom")) + (BOARD_HEIGHT - 100);
  var movebullet = setInterval(() => {
    if (!isRuning) return;
    var rocks = document.getElementsByClassName("rocks");

    for (var i = 0; i < rocks.length; i++) {
      var rock = rocks[i];
      if (rock != undefined) {
        var rockbound = rock.getBoundingClientRect();
        var bulletbound = bullet.getBoundingClientRect();
        if (
          bulletbound.left >= rockbound.left &&
          bulletbound.right <= rockbound.right &&
          bulletbound.top <= rockbound.top &&
          bulletbound.bottom <= rockbound.bottom
        ) {
          rock.parentElement.removeChild(rock);
          points.innerHTML = parseInt(points.innerHTML) + 1;
        }
      }
    }
    var bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    if (bulletBottom >= maxBottom) {
      clearInterval(movebullet);
      $(".bullets").remove();
      bullet = undefined;
    }
    bullet.style.bottom = bulletBottom + 3 + "px";
  });
}

function playPauseGame() {
  isRuning = !isRuning;
  changePlayPauseText();
}

function changePlayPauseText() {
  var text = document.getElementById("playText");
  if (isRuning) text.innerHTML = "Pause";
  else text.innerHTML = "Play";
}

function createBoard() {
  createdEnemies = true;
  for (var i = 0; i < 5; i++) {
    generateEnemy();
  }
}

function generateEnemy() {
  var rock = document.createElement("div");
  rock.classList.add("rocks");
  var maxLeft = BOARD_RIGHT - BOARD_LEFT - ENEMY_WIDTH - 5;
  rock.style.left = Math.floor(Math.random() * maxLeft) + "px";
  board.appendChild(rock);
}
