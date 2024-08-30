class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
    maxFrames = 1,
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.maxFrames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    velocity,
    color = "red",
    position,
    imageSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({ position, imageSrc, scale, maxFrames, offset });

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.dead = false;
    this.sprites = sprites;
    for (const spriteKey in this.sprites) {
      sprites[spriteKey].image = new Image();
      sprites[spriteKey].image.src = sprites[spriteKey].imageSrc;
    }
    console.log({ sprites });
  }

  //   draw() {
  //     c.fillStyle = this.color;
  //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //     if (this.isAttacking) {
  //       // draw attack box
  //       c.fillStyle = "green";
  //       c.fillRect(
  //         this.attackBox.position.x,
  //         this.attackBox.position.y,
  //         this.attackBox.width,
  //         this.attackBox.height
  //       );
  //     }
  //   }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // attack boxes
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    this.switchSprite("attack");
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else this.switchSprite("takeHit");
  }
  switchSprite(sprite) {
    // overriding all animations with the death animation
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.maxFrames - 1) {
        this.dead = true;
      }
      return;
    }

    // overriding all animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.maxFrames - 1
    )
      return;

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.maxFrames - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }

        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.maxFrames = this.sprites.attack1.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.maxFrames = this.sprites.takeHit.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.maxFrames = this.sprites.death.maxFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
