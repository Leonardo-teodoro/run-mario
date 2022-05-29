// Variáveis do jogo
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const score = document.querySelector(".score");
const clouds = document.querySelector(".clouds");
const coin = document.createElement("img");
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
  board.appendChild(gameOver);
}
function resetGame() {
  points = 0;
  pipe.style.right = "-80px";
  mario.style.bottom = 0;
  changeSong("main", true);
  pipe.style.animation = "pipe-animation";
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

  if (rand + 1 <= 4 && points % 100 == 0) {
    if (coin) {
      coin.style.top = `${((rand * 10) % 50) + 1}%`;
      coin.classList.toggle("hidden");
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

const game = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const cloudsPosition = clouds.offsetLeft;
  const marioPosition = removePxString(window.getComputedStyle(mario).bottom);

  getScore();
  if (isGameOver(pipePosition, marioPosition)) {
    endGame(pipePosition, marioPosition, cloudsPosition);
    clearInterval(game);
  }
}, 10);

document.addEventListener("keydown", jump);
