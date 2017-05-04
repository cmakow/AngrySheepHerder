const Sheep = require('./sheep');

class Game {
  constructor(){
    // this.time = 0;
    // this.accuracy = 0;
    this.score = 0;
    this.lives = 3;
    this.interval = 800;

    this.escapedSheep = [];
    this.sheep = [];

    this.background = document.getElementById('background')

    this.add = this.add.bind(this);
    this.renderSheep = this.renderSheep.bind(this);
    this.onClick = this.onClick.bind(this);
    this.sheepAdder = this.sheepAdder.bind(this);
    //
    // let difficultyIncreaser = setInterval(() => {
    //   this.incrementDifficulty();
    // }, 10000)
    setTimeout(this.incrementDifficulty, 5000)

    setTimeout(this.sheepAdder, this.interval)
  }

  add(sheep) {
    this.sheep.unshift(sheep);
  }

  sheepAdder() {
    this.add(new Sheep());
    if(this.lives > 0) {
      setTimeout(this.sheepAdder, this.interval)
    }
  }

  onClick(e) {
    for(let i = 0; i < this.sheep.length; i++) {
      if(this.sheep[i].checkCollision(e)) {
        this.score += 1;
        break;
      }
    }
  }

  incrementDifficulty() {
    if(this.interval === 200) {
      return null;
    } else {
      this.interval -= 100;
      setTimeout(this.incrementDifficulty, 5000)
    }
  }

  renderSheep(ctx) {

    // ctx.fillStyle = '#2f66bf';
    // ctx.fillRect(0, 0, 640, 480); // clear entire canvas
    ctx.drawImage(this.background, 0, 0, 640, 480);

    for(let i = 0; i < this.sheep.length; i++) {
      if(this.sheep[i].width <= 0) {
        if(this.sheep[i].clicked) {
          // this.score += 1;
        } else {
          this.lives -= 1;
          this.escapedSheep.push(this.sheep[i]);
        }
        this.sheep.splice(i, 1);
        i -= 1;
      } else {
        this.sheep[i].draw(ctx);
      }
    }

    this.escapedSheep.forEach((sheep) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(sheep.pos[0], sheep.pos[1], 5, 0, 2*Math.PI, false);
      ctx.fill();
    })
  }

  renderGameOver(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Game Over!', 237, 200);
    ctx.fillText('Game Over!', 237, 200);
    ctx.strokeText(`Score: ${this.score}`, 250, 250);
    ctx.fillText(`Score: ${this.score}`, 250, 250);
  }

}

Game.DIM_X = 640;
Game.DIM_Y = 480;
Game.BG_COLOR = '#2f66bf';

module.exports = Game;
