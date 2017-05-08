const Sheep = require('./sheep');
const Game = require('./game');

class GameView {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.background = document.getElementById('background');

    this.setup = this.setup.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.renderSheep = this.renderSheep.bind(this);
    this.renderScore = this.renderScore.bind(this);
    this.renderMissedSheep = this.renderMissedSheep.bind(this);
    this.render = this.render.bind(this);
    this.setupGame = this.setupGame.bind(this);
  }

  drawButton(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  setup() {
    this.canvas.removeEventListener('click', this.setup);
    const ctx = this.ctx;

    ctx.drawImage(this.background, 0, 0, 815, 480);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Angry Sheep Herder', 183, 200);
    ctx.fillText('Angry Sheep Herder', 183, 200);
    ctx.strokeText('Click a button to play!', 175, 250);
    ctx.fillText('Click a button to play!', 175, 250);
    this.drawButton(ctx, 110, 300, 200, 80, 5);
    this.drawButton(ctx, 330, 300, 200, 80, 5);
    ctx.fillStyle = 'black';
    ctx.fillText('Normal', 161, 350);
    ctx.fillText('Hard', 397, 350);
    this.canvas.addEventListener('click', this.gameStart);
  }

  gameStart(e) {
    if(e.layerX >= 110 && e.layerX <= 310 && e.layerY >= 300 && e.layerY <= 380) {
      this.setupGame(false);
    } else if (e.layerX >= 330 && e.layerX <= 530 && e.layerY >= 300 && e.layerY <= 380) {
      this.setupGame(true);
    }
  }

  setupGame(moving) {
    this.canvas.removeEventListener('click', this.gameStart);
    this.game = new Game({moving: moving});
    this.canvas.addEventListener('click', this.game.onClick);
    let play = setInterval(() => {
      this.render(); // render array of sheep to canvas
      if (this.game.interval === 200) {
        clearInterval(this.diffInterval);
      }
      if (this.game.lives === 0) {
        clearInterval(play);
        clearInterval(this.timeInterval);
        clearInterval(this.diffInterval);
        this.renderGameOver();
      }
    }, 30);

    // time incrementer
    this.timeInterval = setInterval(this.game.incrementTime, 1000);

    // decrease interval between sheep spawning every 10 seconds
    this.diffInterval = setInterval(this.game.incrementDifficulty, 10000);
    setTimeout(this.game.sheepAdder, this.game.interval);
  }

  parseTime(time) {
    if(time < 10) {
      return `0:0${time}`;
    } else if (time < 60) {
      return `0:${time}`;
    } else {
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      if(secs < 10) {
        return `${mins}:0${secs}`;
      } else {
        return `${mins}:${secs}`;
      }
    }
  }

  parseLives(lives) {
    let livesString = "";
    for(let i = 0; i < lives; i++) {
      livesString += '♥'
    }
    return livesString;
  }

  renderScore() {
    const ctx = this.ctx;

    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '22px arial';
    ctx.strokeText(`Score: ${this.game.score}`, 10, 25);
    ctx.fillText(`Score: ${this.game.score}`, 10, 25);
    ctx.strokeText(`Accuracy: ${this.game.accuracy}%`, 10, 50);
    ctx.fillText(`Accuracy: ${this.game.accuracy}%`, 10, 50);
    ctx.strokeText(`Time: ${this.parseTime(this.game.time)}`, 520, 25);
    ctx.fillText(`Time: ${this.parseTime(this.game.time)}`, 520, 25);
    ctx.strokeText(`Lives:`, 520, 50);
    ctx.fillText(`Lives: ${this.parseLives(this.game.lives)}`, 520, 50);
  }

  renderMissedSheep() {
    const ctx = this.ctx;

    this.game.escapedSheep.forEach((sheep) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(sheep.pos[0], sheep.pos[1], 5, 0, 2*Math.PI, false);
      ctx.fill();
    })
  }

  renderSheep() {
    const ctx = this.ctx;

    for(let i = 0; i < this.game.sheep.length; i++) {
      if(this.game.sheep[i].width <= 0) {
        if(this.game.sheep[i].clicked) {
          // this.score += 1;
        } else {
          this.game.loseLife(this.game.sheep[i]);
        }
        this.game.sheep.splice(i, 1);
        i -= 1;
      } else {
        this.game.sheep[i].draw(ctx);
      }
    }
  }

  render() {
    const ctx = this.ctx;

    // clear canvas with background img
    ctx.drawImage(this.background, 0, 0, 815, 480);

    this.renderScore();

    this.renderSheep();

    this.renderMissedSheep();
  }


  renderGameOver() {
    let scoreXpos;
    if(this.game.score > 99) {
      scoreXpos = 166;
    } else if (this.game.score > 9) {
      scoreXpos = 173;
    } else {
      scoreXpos = 182;
    }

    const canvas = this.canvas;
    const ctx = this.ctx;
    canvas.removeEventListener('click', this.game.onClick);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Game Over!', 237, 200);
    ctx.fillText('Game Over!', 237, 200);
    ctx.strokeText(`You herded ${this.game.score} sheep!`, scoreXpos, 250);
    ctx.fillText(`You herded ${this.game.score} sheep!`, scoreXpos, 250);
    ctx.strokeText('Click anywhere to play again', 130, 300);
    ctx.fillText('Click anywhere to play again', 130, 300);
    canvas.addEventListener('click', this.setup);
  }
}

module.exports = GameView;
