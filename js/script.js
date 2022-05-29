const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");

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

setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");

  if (pipePosition <= 120 && marioPosition < 100 && pipePosition > 0) {
    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;

    mario.src = "../assets/images/game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";

    clearInterval();
  }
}, 10);
document.addEventListener("keydown", jump);
