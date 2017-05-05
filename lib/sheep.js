class Sheep {
  constructor(options = {}) {
    this.pos = options.pos || this.generateRandomPosition();
    this.width = options.width || 1;
    this.img = document.getElementById('sheep');
    this.growing = true;
    this.clicked = false;

    this.moving = options.moving || false;
    this.direction = this.generateRandomDirection();
    this.velocity = this.generateRandomVelocity();
    this.xInc = this.velocity * Math.cos(this.direction);
    this.yInc = this.velocity * Math.sin(this.direction);

    this.draw = this.draw.bind(this);
    this.move = this.move.bind(this);
    this.checkHit = this.checkHit.bind(this);
  }

  generateRandomPosition() {
    // multiplying by 540 to get a number between 1 and 540, add 50 so that it never goes off screen
    // max width is 100 px so 50 px radius --> won't hit edge
    let x = Math.floor((Math.random() * 540)) + 50;
    let y = Math.floor((Math.random() * 380)) + 50;
    return [x, y];
  }

  generateRandomDirection() {
    return (Math.random() * Math.PI * 2) // returns random angle between 0 and 2pi
  }

  generateRandomVelocity() {
    return Math.random() * 3;
  }

  move() {
    this.checkCollision();
    this.pos[0] += this.xInc;
    this.pos[1] += this.yInc;
  }

  checkCollision() {
    if(this.pos[0] + (this.width * 0.5) >= 640 && this.xInc > 0) {
      this.xInc = -this.xInc;
    } else if (this.pos[0] - (this.width * 0.5) <= 0 && this.xInc < 0) {
      this.xInc = -this.xInc;
    } else if (this.pos[1] + (this.width * 0.5) >= 480 && this.yInc > 0) {
      this.yInc = -this.yInc;
    } else if (this.pos[1] - (this.width * 0.5) <= 0 && this.yInc < 0) {
      this.yInc = -this.yInc;
    }
  }

  checkHit(e) {
    e.preventDefault();
    const xDist = e.layerX - this.pos[0];
    const yDist = e.layerY - this.pos[1];
    const directDist = Math.sqrt(xDist ** 2 + yDist ** 2)
    if ((this.width * 0.5) > directDist) {
      this.width = 0;
      this.clicked = true;
      return true;
    }
  }

  draw(ctx) {
    if (this.width > 0) {
      if(this.moving) {
        this.move();
      }
      ctx.drawImage(this.img, this.pos[0] - this.width/2, this.pos[1] - this.width/2, this.width, this.width);

      // shows hitbox, play with radius of circle

      // ctx.strokeStyle = 'red';
      // ctx.beginPath();
      // ctx.arc(this.pos[0], this.pos[1], this.width * 0.50, 0, 2*Math.PI, false)
      // ctx.stroke();

      // shows center of sheep

      // ctx.fillStyle='red';
      // ctx.beginPath();
      // ctx.arc(this.pos[0], this.pos[1], 5, 0, 2 * Math.PI, false);
      // ctx.fill();

      if(this.growing) {
        this.width += 1.5;
        if(this.width >= 100) {
          this.growing = false;
        }
      } else {
        this.width -= 1.5;
      }
    }
  }
}

module.exports = Sheep;
