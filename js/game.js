var ship = document.getElementById("jet");
var board = document.getElementById("board");
var points = document.getElementById("points");
var createEnemiesInterval;
var moveEnemiesInterval;
var isRuning = false;

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

window.addEventListener("keydown", (e) => {
  if (!isRuning) return;
  var left = parseInt(window.getComputedStyle(ship).getPropertyValue("left"));
  if (e.key == "ArrowLeft" && left > 0) {
    ship.style.left = left - SHIP_MOVEMENT + "px";
  } else if (e.key == "ArrowRight" && left <= BOARD_WIDTH - SHIP_WIDTH * 1.5) {
    ship.style.left = left + SHIP_MOVEMENT + "px";
  }

  if (e.key == "ArrowUp" || e.key == " ") {
    shot();
  }
});

function shot() {
  var bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.bottom = ship.style.bottom;
  bullet.style.left = ship.style.left;
  board.appendChild(bullet);

  var movebullet = setInterval(() => {
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
    var bulletbottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    if (bulletbottom >= BOARD_TOP) {
      clearInterval(movebullet);
    }

    bullet.style.left = left + SHIP_WIDTH / 3.2 + "px";
    bullet.style.bottom = bulletbottom + 3 + "px";
  });
}

function playPauseGame() {
  isRuning = !isRuning;
  changePlayPauseText();
  if (createEnemiesInterval == undefined && moveEnemiesInterval == undefined) createBoard();
}

function changePlayPauseText() {
  var text = document.getElementById("playText");
  if (isRuning) text.innerHTML = "Pause";
  else text.innerHTML = "Play";
}

function createBoard() {
  createEnemiesInterval = setInterval(() => {
    if (!isRuning) return;
    var rock = document.createElement("div");
    rock.classList.add("rocks");
    rock.style.left = Math.floor(Math.random() * (BOARD_WIDTH - ENEMY_WIDTH)) + "px";
    board.appendChild(rock);
  }, 1000);

  moveEnemiesInterval = setInterval(() => {
    if (!isRuning) return;
    var rocks = document.getElementsByClassName("rocks");
    if (rocks != undefined) {
      for (var i = 0; i < rocks.length; i++) {
        var rock = rocks[i];
        var rocktop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));
        if (rocktop >= BOARD_HEIGHT - ENEMY_HEIGHT + 25) {
          alert("Game Over");
          clearInterval(moveEnemiesInterval);
          window.location.reload();
          createEnemiesInterval = undefined;
          moveEnemiesInterval = undefined;
          isRuning = false;
        }

        rock.style.top = rocktop + ROCKET_MOVEMENT + "px";
      }
    }
  }, 100);
}
