var ship = document.getElementById("jet");
var board = document.getElementById("board");
var createEnemiesInterval;
var moveEnemiesInterval;
var isRuning = false;

const BOARD_WIDTH = 700;
const BOARD_HEIGHT = 500;
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
  } else if (e.key == "ArrowRight" && left <= BOARD_WIDTH - SHIP_WIDTH) {
    ship.style.left = left + SHIP_MOVEMENT + "px";
  }

  if (e.key == "ArrowUp" || e.key == " ") {
    var bullet = document.createElement("div");
    bullet.classList.add("bullets");
    board.appendChild(bullet);

    var movebullet = setInterval(() => {
      var rocks = document.getElementsByClassName("rocks");

      for (var i = 0; i < rocks.length; i++) {
        var rock = rocks[i];
        if (rock != undefined) {
          var rockbound = rock.getBoundingClientRect();
          var bulletbound = bullet.getBoundingClientRect();

          //Condition to check whether the rock/alien and the bullet are at the same position..!
          //If so,then we have to destroy that rock

          if (
            bulletbound.left >= rockbound.left &&
            bulletbound.right <= rockbound.right &&
            bulletbound.top <= rockbound.top &&
            bulletbound.bottom <= rockbound.bottom
          ) {
            rock.parentElement.removeChild(rock); //Just removing that particular rock;
            //Scoreboard
            document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML) + 1;
          }
        }
      }
      var bulletbottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));

      //Stops the bullet from moving outside the gamebox
      if (bulletbottom >= 500) {
        clearInterval(movebullet);
      }

      bullet.style.left = left + "px"; //bullet should always be placed at the top of my jet..!
      bullet.style.bottom = bulletbottom + 3 + "px";
    });
  }
});

function playPauseGame() {
  isRuning = !isRuning;
  if (createEnemiesInterval == undefined && moveEnemiesInterval == undefined) createBoard();
}

function createBoard() {
  createEnemiesInterval = setInterval(() => {
    if (!isRuning) return;
    var rock = document.createElement("div");
    rock.classList.add("rocks");
    //Just getting the left of the rock to place it in random position...
    var rockleft = parseInt(window.getComputedStyle(rock).getPropertyValue("left"));
    //generate value between 0 to (board width - rock width)
    rock.style.left = Math.floor(Math.random() * (BOARD_WIDTH - ENEMY_WIDTH)) + "px";

    board.appendChild(rock);
  }, 1000);

  moveEnemiesInterval = setInterval(() => {
    if (!isRuning) return;
    var rocks = document.getElementsByClassName("rocks");
    if (rocks != undefined) {
      for (var i = 0; i < rocks.length; i++) {
        //Now I have to increase the top of each rock,so that the rocks can move downwards..
        var rock = rocks[i]; //getting each rock
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
