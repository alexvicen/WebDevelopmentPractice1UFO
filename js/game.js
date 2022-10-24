var ship = document.getElementById("jet");
var board = document.getElementById("board");
var points = document.getElementById("points");
var createdEnemies = false;
var isRuning = false;
var bullet = undefined;

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
  bullet.style.bottom = ship.getBoundingClientRect().bottom - BOARD_HEIGHT + SHIP_HEIGHT - 30 + "px";
  board.appendChild(bullet);

  var maxBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom")) + (BOARD_HEIGHT - 100);
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
          bulletBound.top <= enemyBound.top &&
          bulletBound.bottom <= enemyBound.bottom
        ) {
          addScore();
          enemy.parentElement.removeChild(enemy);
          clearInterval(movebullet);
          $(".bullets").remove();
          bullet = undefined;
        }
      }
    }
    var bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    if (bulletBottom >= maxBottom) {
      substractScore();
      clearInterval(movebullet);
      $(".bullets").remove();
      bullet = undefined;
    }
    bullet.style.bottom = bulletBottom + 3 + "px";
  });
}

function addScore() {
  points.innerHTML = parseInt(points.innerHTML) + 100;
}
function substractScore() {
  points.innerHTML = parseInt(points.innerHTML) - 25;
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
}

function createBoard() {
  createdEnemies = true;
  for (var i = 0; i < 5; i++) {
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

  rock.style.left = maxRigh + "px";
  rock.style.bottom = maxBottom + "px";
  board.appendChild(rock);
}
