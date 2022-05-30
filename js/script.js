// Variáveis do jogo
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const score = document.querySelector(".score");
const coin = document.querySelector(".coin");
const clouds = document.querySelector(".clouds");
let initial_duration = 1.5;
const board = document.querySelector(".game-board");
const song = document.querySelector(".song");
const gameOver = document.querySelector(".game-over");

let points = 0;
// Funções auxiliares

function addGameOverText() {
  const gameOver = document.createElement("h2");
  gameOver.style.top = "50%";
  gameOver.style.width = "100%";
  gameOver.style.textAlign = "center";
  gameOver.style.position = "absolute";
  gameOver.innerText = "Game Over!";
  gameOver.classList.add("game-over");
  board.appendChild(gameOver);
}
function resetGame() {
  board.removeChild(document.querySelector(".replay"));
  board.removeChild(document.querySelector(".game-over"));
  points = 0;
  updateScore();

  mario.removeAttribute("style");
  clouds.removeAttribute("style");
  pipe.removeAttribute("style");
  mario.src = "../assets/images/mario.webp";
  board.classList.remove("darken");
  changeSong("main", true);
  initial_duration = 1.5;
  init_game();
}
function addReplayButton() {
  const replay = document.createElement("h4");

  replay.classList.add("replay", "object");
  replay.innerText = "Replay";
  board.appendChild(replay);

  replay.addEventListener("click", () => {
    resetGame();
  });
}

function removePxString(string) {
  return string.replace("px", "");
}
function jump(event) {
  if (event.key === "ArrowUp") {
    mario.classList.add("jump");

    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
}
function spawnCoin() {
  const rand = parseInt((Math.random() * 100) % 10);

  if (rand + 1 <= 4 && points % 50 == 0) {
    if (!coin) {
      coin = document.createElement("img");
      coin.src = "../assets/images/coin.png";

      coin.style.top = `${((rand * 10) % 50) + 1}%`;
      coin.classList.add("coin");
      coin.classList.remove("hidden");

      console.log(coin);
    }
  }
}
function getScore() {
  points = points + 1;
  updateScore();
}
function updateScore(bonus) {
  if (bonus) {
    points = points + bonus;
  }
  score.innerText = `Score: ${points}`;
  updateVelocity();
}

function updateVelocity() {
  console.log(initial_duration);
  setTimeout(() => {
    if (points != 0 && points % 10 == 0 && initial_duration > 0.92) {
      initial_duration -= 0.002;
      pipe.style["-webkit-animation-duration"] = `${initial_duration}s`;
    }
  }, 10);
}
function changeSong(name, loop) {
  song.pause();
  song.src = `../assets/sounds/${name}.mp3`;
  song.loop = loop;
  song.play();
}
function isGameOver(pipePosition, marioPosition) {
  return pipePosition <= 120 && pipePosition > 0 && marioPosition < 100;
}
function endGame(pipePosition, marioPosition, cloudsPosition) {
  changeSong("gameOver", false);
  pipe.style.animation = "none";
  pipe.style.left = `${pipePosition}px`;

  mario.style.animation = "none";
  mario.style.bottom = `${marioPosition}px`;

  mario.src = "../assets/images/game-over.png";
  mario.style.width = "75px";
  mario.style.marginLeft = "50px";
  board.classList.add("darken");

  clouds.style.animation = "none";
  clouds.style.left = `${cloudsPosition}px`;
  addGameOverText();
  addReplayButton();
}

function init_game() {
  const game = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const cloudsPosition = clouds.offsetLeft;
    const marioPosition = removePxString(window.getComputedStyle(mario).bottom);

    getScore();
    spawnCoin();
    if (isGameOver(pipePosition, marioPosition)) {
      endGame(pipePosition, marioPosition, cloudsPosition);
      clearInterval(game);
    }
  }, 10);
}
init_game();
document.addEventListener("keydown", jump);
