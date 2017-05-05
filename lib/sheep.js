class Sheep {
  constructor(options = {}) {
    this.pos = options.pos || this.generateRandomPosition();
    this.width = options.width || 1;
    this.img = document.getElementById('sheep');
    this.growing = true;
    this.clicked = false;

    this.draw = this.draw.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
  }

  generateRandomPosition() {
    // multiplying by 540 to get a number between 1 and 540, add 50 so that it never goes off screen
    // max width is 100 px so 50 px radius --> won't hit edge
    let x = Math.floor((Math.random() * 540)) + 50;
    let y = Math.floor((Math.random() * 380)) + 50;
    return [x, y];
  }

  checkCollision(e) {
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
