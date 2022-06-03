// Variáveis do jogo
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const score = document.querySelector(".score");
const coin = document.querySelector(".coin");
const clouds = document.querySelector(".clouds");
const instructionsContainer = document.querySelector(".instructions");
let initial_duration = 1500;

const board = document.querySelector(".game-board");
const song = document.querySelector(".song");
const gameOver = document.querySelector(".game-over");

let points = 0;
// Funções auxiliares
async function changeSong(name, isLoop = false) {
  song.src = "../assets/sounds/" + name + ".mp3";
  song.loop = isLoop;
  playSound(song);
}
function hideElements() {
  mario.classList.add("hidden");
  pipe.classList.add("hidden");
  score.classList.add("hidden");
  coin.classList.add("hidden");
}
function showElements() {
  mario.classList.remove("hidden");
  pipe.classList.remove("hidden");
  score.classList.remove("hidden");
}

function menuGame() {
  pipe.style.animationPlayState = "paused";

  hideElements();
  addStartButton();
  addInstructionButton();
}

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

async function resetGame() {
  board.classList.remove("end");
  board.classList.remove("darken");
  board.removeAttribute("style");
  board.removeChild(document.querySelector(".play-again"));
  board.removeChild(document.querySelector(".game-over"));
  points = 0;

  pipe.removeAttribute("style");
  pipe.animation = "none";
  pipe.style.right = "-80px";
  pipe.classList.add("passing");
  updateScore();

  mario.removeAttribute("style");
  coin.removeAttribute("style");
  clouds.removeAttribute("style");

  mario.src = "../assets/images/mario.webp";
  changeSong("main", true);
  song.play();

  initGame();
}
function addPlayAgainButton() {
  const playAgain = document.createElement("button");

  playAgain.classList.add("play-again", "object", "pixel-font");
  playAgain.innerText = "Play again";
  playAgain.classList.add("fade-in");
  playAgain.disabled = true;

  board.appendChild(playAgain);

  playAgain.addEventListener("animationend", () => {
    playAgain.disabled = false;
  });
  playAgain.addEventListener("click", () => {
    initial_duration = 1500;
    updateSpeed();
    resetGame();
  });
}

function addStartButton() {
  const start = document.createElement("h4");

  start.classList.add("start", "object");
  start.innerText = "Start";
  board.appendChild(start);

  start.addEventListener("click", () => {
    showElements();
    board.removeChild(start);
    board.removeChild(document.querySelector(".instructions-button"));
    board.removeChild(document.querySelector(".instructions"));
    initGame();
    song.play();
    document.addEventListener("keydown", jump);
    pipe.style.animationPlayState = "running";
    clouds.style.animationPlayState = "running";
  });
}
function showInstructions() {
  instructionsContainer.classList.remove("hidden");
}
function addInstructionButton() {
  const instructionsButton = document.createElement("h4");

  instructionsButton.classList.add("instructions-button", "object");
  instructionsButton.innerText = "Instructions";
  board.appendChild(instructionsButton);

  instructionsButton.addEventListener("click", () => {
    showInstructions();
  });
}

function removePxString(string) {
  return string.replace("px", "");
}
function jump(event) {
  if (event.key === "ArrowUp") {
    mario.classList.add("jump");
    if (!board.classList.contains("end")) {
      document.querySelector(".jump-sound").play();
    }

    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
}

function coinColission(marioPosition, coinX, coinY) {
  if (
    !coin.classList.contains("hidden") &&
    coinX <= 100 &&
    coinX > 0 &&
    Math.abs(marioPosition - coinY) < 60
  ) {
    removeCoin();
    updateScore(50);
    document.querySelector(".coin-sound").play();
  }
}
function removeCoin() {
  coin.classList.add("hidden");
}
function spawnCoin() {
  const rand = parseInt((Math.random() * 100) % 10);

  if (rand + 1 <= 4 && points % 100 == 0) {
    if (coin.classList.contains("hidden")) {
      coin.style.bottom = `${((rand * 10) % 50) + 1}%`;
      coin.classList.remove("coin");
      coin.classList.add("coin");
      coin.classList.remove("hidden");
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

  if (points == 2000) {
    song.playbackRate = 1.5;
  }
}

async function updateSpeed() {
  if (points != 0 && initial_duration > 0.98) {
    pipe.style.animation = "none";
    initial_duration -= 0.15;

    pipe.style.animation =
      "pipe-animation " + initial_duration + "ms " + "linear infinite";
  }
}

function isGameOver(pipePosition, marioPosition) {
  return pipePosition <= 120 && pipePosition > 0 && marioPosition < 100;
}
async function playSound(sound) {
  sound.load();
  sound.play();
}
async function endGame(
  pipePosition,
  marioPosition,
  cloudsPosition,
  coinXPosition
) {
  changeSong("gameOver", false);
  pipe.style.animation = "none";
  pipe.style.left = `${pipePosition}px`;
  pipe.classList.remove("passing");
  mario.style.animation = "none";
  mario.style.bottom = `${marioPosition}px`;

  mario.src = "../assets/images/game-over.png";
  mario.style.width = "75px";
  mario.style.marginLeft = "50px";
  board.classList.add("darken");

  clouds.style.animation = "none";
  clouds.style.left = `${cloudsPosition}px`;

  coin.style.animation = "none";
  coin.style.left = `${coinXPosition}px`;

  addGameOverText();

  addPlayAgainButton();

  board.classList.add("end");
}
async function levelUp() {
  if (!board.classList.contains("end")) {
    pipe.style.animation = "none";
    setInterval(() => {
      board.classList.add("darken");

      clouds.style.animationPlayState = "paused";
      coin.style.animationPlayState = "paused";

      clouds.style.animationPlayState = "running";
      coin.style.animationPlayState = "running";
    }, 4000);
  }
}
async function initGame() {
  coin.classList.add("hidden");

  const game = setInterval(() => {
    const pipePosition = pipe.offsetLeft;

    const cloudsPosition = clouds.offsetLeft;
    const marioPosition = removePxString(window.getComputedStyle(mario).bottom);
    const coinYPosition = removePxString(window.getComputedStyle(coin).bottom);
    const coinXPosition = coin.offsetLeft;

    getScore();
    spawnCoin();

    coinColission(marioPosition, coinXPosition, coinYPosition);
    if (isGameOver(pipePosition, marioPosition)) {
      endGame(pipePosition, marioPosition, cloudsPosition, coinXPosition);
      clearInterval(game);
    }

    if (Math.floor(initial_duration) > 0.95) updateSpeed();
  }, 10);
}

menuGame();
