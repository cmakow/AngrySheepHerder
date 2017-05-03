class Sheep {
  constructor(options = {}) {
    this.pos = options.pos || this.generateRandomPosition();
    this.width = options.width || 1;
    this.img = document.getElementById('sheepSvg');
    this.growing = true;
  }

  generateRandomPosition() {
    // multiplying by 540 to get a number between 1 and 540, add 50 so that it never goes off screen
    // max width is 100 px so 50 px radius --> won't hit edge
    let x = Math.floor((Math.random() * 540)) + 50;
    let y = Math.floor((Math.random() * 380)) + 50;
    console.log(x, y);
    return [x, y];
  }

  clickHandler(e) {
    e.preventDefault();
    // remove from sheep array in game? --> stop rendering it
  }

  draw(ctx) {
    ctx.drawImage(f.img, f.pos[0] - f.width/2, f.pos[1] - f.width/2, f.width, f.width);
    if(this.growing) {
      f.width += 1;
      if(f.width === 100) {
        this.growing = false;
      }
    } else {
      f.width -= 1;
    }
  }
}

module.exports = Sheep;
