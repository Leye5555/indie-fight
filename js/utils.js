function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

let timer = 60;
let timerId = null;

function determineWinner({ player, enemy }) {
  if (timerId) clearTimeout(timerId);
  if (!isGameOver) {
    isGameOver = true;
    setTimeout(() => {
      document.querySelector(".start-game-wrapper").classList.remove("hide");
      window.location.reload();
    }, 5000);
  }
  document.querySelector(".game-outcome").classList.add("active");
  if (player.health === enemy.health) {
    document.querySelector(".game-outcome").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector(".game-outcome").innerHTML = "Player 1 Wins";
  } else {
    document.querySelector(".game-outcome").innerHTML = "Player 2 Wins";
  }
}

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector(".timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}
