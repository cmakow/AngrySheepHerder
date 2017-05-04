const Sheep = require('./sheep');

class Game {
  constructor(canvas, ctx){
    this.time = 0;
    // this.accuracy = 0;
    this.canvas = canvas;
    this.ctx = ctx;

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
    this.incrementTime = this.incrementTime.bind(this);
    this.gameStart = this.gameStart.bind(this);
  }

  add(sheep) {
    this.sheep.push(sheep);
  }

  sheepAdder() {
    this.add(new Sheep());
    if(this.lives > 0) {
      setTimeout(this.sheepAdder, this.interval)
    }
    console.log(this.interval);
  }

  onClick(e) {
    let hit = false;
    for(let i = 0; i < this.sheep.length; i++) {
      if(this.sheep[i].checkCollision(e)) {
        this.score += 1;
        hit = true;
        break;
      }
    }
    if(!hit) {
      // render black circle? noise?
      // Add to miss array that will render for x frames before disappearing?
    }
  }

  incrementDifficulty() {
    if(this.interval === 200) {
      return null;
    } else {
      this.interval -= 100;
      setTimeout(this.incrementDifficulty, 10000);
    }
  }

  incrementTime() {
    this.time += 1;
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

  gameStart() {
    this.canvas.removeEventListener('click', this.gameStart);
    this.start();
  }

  setup() {
    const ctx = this.ctx;

    ctx.drawImage(this.background, 0, 0, 815, 480);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Angry Sheep Herder', 183, 200);
    ctx.fillText('Angry Sheep Herder', 183, 200);
    ctx.strokeText('Click on the screen to play!', 140, 250);
    ctx.fillText('Click on the screen to play!', 140, 250);
    this.canvas.addEventListener('click', this.gameStart);
  }

  start() {
    // ivar reset
    this.sheep = [];
    this.lives = 3;
    this.interval = 600;
    this.escapedSheep = [];
    this.score = 20;
    this.time = 0;

    this.canvas.addEventListener('click', this.onClick);
    let play = setInterval(() => {
      this.renderSheep(); // render array of sheep to canvas
      if (this.lives === 0) { // will eventually be changed to loss condition (lives === 0)
        clearInterval(play);
        this.renderGameOver();
      }
    }, 30);

    // time incrementer
    setInterval(this.incrementTime, 1000);

    // decrease interval between sheep spawning every 10 seconds
    setTimeout(this.incrementDifficulty, 10000);
    setTimeout(this.sheepAdder, this.interval);
  }

  renderSheep() {
    const ctx = this.ctx;

    // clear canvas with background img
    ctx.drawImage(this.background, 0, 0, 815, 480);

    // render score
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '22px arial';
    ctx.strokeText(`Score: ${this.score}`, 10, 25);
    ctx.fillText(`Score: ${this.score}`, 10, 25);
    ctx.strokeText(`Time: ${this.parseTime(this.time)}`, 520, 25);
    ctx.fillText(`Time: ${this.parseTime(this.time)}`, 520, 25);

    // render each sheep
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

    // render misses as red dots
    this.escapedSheep.forEach((sheep) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(sheep.pos[0], sheep.pos[1], 5, 0, 2*Math.PI, false);
      ctx.fill();
    })
  }


  renderGameOver() {
    let scoreXpos;
    if(this.score > 99) {
      scoreXpos = 166;
    } else if (this.score > 9) {
      scoreXpos = 173;
    } else {
      scoreXpos = 182;
    }
    
    const canvas = this.canvas;
    const ctx = this.ctx;
    canvas.removeEventListener('click', this.onClick);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Game Over!', 237, 200);
    ctx.fillText('Game Over!', 237, 200);
    ctx.strokeText(`You herded ${this.score} sheep!`, scoreXpos, 250);
    ctx.fillText(`You herded ${this.score} sheep!`, scoreXpos, 250);
    ctx.strokeText('Click anywhere to play again', 130, 300);
    ctx.fillText('Click anywhere to play again', 130, 300);
    canvas.addEventListener('click', this.gameStart);
  }

}

Game.DIM_X = 640;
Game.DIM_Y = 480;
Game.BG_COLOR = '#2f66bf';

module.exports = Game;
