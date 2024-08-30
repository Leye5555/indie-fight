const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576; // 16 : 9 aspect ratio

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

let isGameOver = false;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  maxFrames: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  maxFrames: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: { imageSrc: "assets/samuraiMack/Idle.png", maxFrames: 8 },
    run: {
      imageSrc: "assets/samuraiMack/Run.png",
      maxFrames: 8,
    },
    jump: {
      imageSrc: "assets/samuraiMack/Jump.png",
      maxFrames: 2,
    },
    fall: {
      imageSrc: "assets/samuraiMack/Fall.png",
      maxFrames: 2,
    },
    attack1: {
      imageSrc: "assets/samuraiMack/Attack1.png",
      maxFrames: 6,
    },
    attack2: {
      imageSrc: "assets/samuraiMack/Attack2.png",
      maxFrames: 6,
    },
    takeHit: {
      imageSrc: "assets/samuraiMack/Take Hit - white silhouette.png",
      maxFrames: 4,
    },
    death: {
      imageSrc: "assets/samuraiMack/Death.png",
      maxFrames: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  maxFrames: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: { imageSrc: "assets/kenji/Idle.png", maxFrames: 4 },
    run: {
      imageSrc: "assets/kenji/Run.png",
      maxFrames: 8,
    },
    jump: {
      imageSrc: "assets/kenji/Jump.png",
      maxFrames: 2,
    },
    fall: {
      imageSrc: "assets/kenji/Fall.png",
      maxFrames: 2,
    },
    attack1: {
      imageSrc: "assets/kenji/Attack1.png",
      maxFrames: 4,
    },
    attack2: {
      imageSrc: "assets/kenji/Attack2.png",
      maxFrames: 4,
    },
    takeHit: {
      imageSrc: "assets/kenji/Take hit.png",
      maxFrames: 3,
    },
    death: {
      imageSrc: "assets/kenji/Death.png",
      maxFrames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  // for every frame moved per time, reset the canvas.
  // this enables the player sprites start at a new drawn location
  // on each render to the canvas
  // the repetition of this process over time creates the concept of sprite motion
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(0,0,0, 0.3)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  // player jump
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // player jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect collision
  // player attack

  // player takes hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4 &&
    !isGameOver
  ) {
    player.isAttacking = false;
    enemy.takeHit();

    gsap.to(".enemy-health > .current", {
      width: enemy.health + "%",
    });
  }

  // player misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  // enemy attack
  // player takes hit
  else if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    enemy.isAttacking &&
    enemy.currentFrame == 2 &&
    !isGameOver
  ) {
    enemy.isAttacking = false;
    player.takeHit();

    gsap.to(".player-health > .current", {
      width: player.health + "%",
    });
  }

  // player misses
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  // end game if timer is done
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = event.key;
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = event.key;
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;

      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

// sound control

const bgSong = document.getElementById("bg-song");

document.getElementById("sound-control").onclick = () => {
  if (bgSong.paused) {
    bgSong.play();
    document.querySelector("#sound-control > img").src =
      "assets/pause-circle-svgrepo-com.svg";
  } else {
    bgSong.pause();
    document.querySelector("#sound-control > img").src =
      "assets/play-circle-svgrepo-com.svg";
  }
};
