const Sheep = require('./sheep');

class Game {
  constructor(){
    // this.time = 0;
    // this.accuracy = 0;
    this.score = 0;
    this.lives = 3;
    this.interval = 600;

    this.escapedSheep = [];
    this.sheep = [];

    this.background = document.getElementById('background');

    this.add = this.add.bind(this);
    this.renderSheep = this.renderSheep.bind(this);
    this.onClick = this.onClick.bind(this);
    this.sheepAdder = this.sheepAdder.bind(this);
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
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
      setTimeout(this.incrementDifficulty, 10000)
    }
  }

  setup(canvas, ctx) {
    let gameStart = () => {
      canvas.removeEventListener('click', gameStart);
      this.start(canvas, ctx);
    }
    gameStart = gameStart.bind(this);

    ctx.drawImage(this.background, 0, 0, 815, 480);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Angry Sheep Herder', 200, 200);
    ctx.fillText('Angry Sheep Herder', 200, 200);
    ctx.strokeText('Click on the screen to play!', 155, 250);
    ctx.fillText('Click on the screen to play!', 155, 250);
    canvas.addEventListener('click', gameStart);
  }

  start(canvas, ctx) {
    canvas.addEventListener('click', this.onClick);
    let play = setInterval(() => {
      this.renderSheep(ctx); // render array of sheep to canvas
      if (this.lives === 0) { // will eventually be changed to loss condition (lives === 0)
        clearInterval(play);
        this.renderGameOver(ctx);
      }
    }, 30)
    setTimeout(this.incrementDifficulty, 5000)

    setTimeout(this.sheepAdder, this.interval)
  }

  renderSheep(ctx) {

    // ctx.fillStyle = '#2f66bf';
    // ctx.fillRect(0, 0, 640, 480); // clear entire canvas with blue background
    ctx.drawImage(this.background, 0, 0, 815, 480); // clear canvas with background img
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
