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
    this.renderGameOver = this.renderGameOver.bind(this);
    this.renderMissedSheep = this.renderMissedSheep.bind(this);
    this.render = this.render.bind(this);
    this.setupGame = this.setupGame.bind(this);
    this.resetGame = this.resetGame.bind(this);

    this.renderLeaderboards = this.renderLeaderboards.bind(this);
    this.leaderboardClickHandler = this.leaderboardClickHandler.bind(this);

    this.highScoreRefHard = firebase.database().ref(`scores/true`);
    this.highScoreRefEasy = firebase.database().ref(`scores/false`);

    this.writeHighScore = this.writeHighScore.bind(this);
    this.submitHighScore = this.submitHighScore.bind(this);
    this.retrieveLowestHighScore = this.retrieveLowestHighScore.bind(this);

    this.scores = [];
    this.lowestHighScore = {score: 0};
    this.highScoreRefHard.once('value').then(this.retrieveLowestHighScore);
    this.highScoreRefEasy.once('value').then(this.retrieveLowestHighScore);
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

  resetGame(e) {
    if(e.layerX >= 220 && e.layerX <= 420 && e.layerY >= 219 && e.layerY <= 281) {
      this.setup();
    }
  }

  setup() {
    this.canvas.removeEventListener('click', this.resetGame);
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
    this.drawButton(ctx, 510, 30, 100, 40, 5);
    ctx.fillStyle = 'black';
    ctx.fillText('Normal', 161, 350);
    ctx.fillText('Hard', 397, 350);
    ctx.font = '15px arial';
    ctx.fillText('Leaderboard', 518, 55);
    this.canvas.addEventListener('click', this.gameStart);
  }

  gameStart(e) {
    if(e.layerX >= 110 && e.layerX <= 310 && e.layerY >= 300 && e.layerY <= 380) {
      this.setupGame(false);
    } else if (e.layerX >= 330 && e.layerX <= 530 && e.layerY >= 300 && e.layerY <= 380) {
      this.setupGame(true);
    } else if (e.layerX >= 510 && e.layerX <= 611 && e.layerY >= 30 && e.layerY <= 70) {
      this.renderLeaderboards();
    }
  }

  setupGame(moving) {
    $('#canvas').css('cursor', 'crosshair');
    if (moving) {
      this.newHighScoreRef = this.highScoreRefHard.push();
      this.highScoreRefHard.on('value', this.retrieveLowestHighScore)
    } else {
      this.newHighScoreRef = this.highScoreRefEasy.push();
      this.highScoreRefEasy.on('value', this.retrieveLowestHighScore)
    }
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
        this.writeHighScore();
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
    $('#canvas').css('cursor', 'pointer');

    const canvas = this.canvas;
    const ctx = this.ctx;
    canvas.removeEventListener('click', this.game.onClick);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = '30px arial';
    ctx.strokeText('Game Over!', 237, 150);
    ctx.fillText('Game Over!', 237, 150);
    ctx.strokeText(`You herded ${this.game.score} sheep!`, scoreXpos, 200);
    ctx.fillText(`You herded ${this.game.score} sheep!`, scoreXpos, 200);
    this.drawButton(ctx, 220, 220, 200, 60, 5);
    ctx.fillStyle = 'black';
    ctx.fillText('Play again!', 245, 260);
    ctx.fillStyle = 'yellow';
    canvas.addEventListener('click', this.resetGame);
  }

  // HIGH SCORE STUFF

  retrieveLowestHighScore(snapshot) {
    if (snapshot.val()) {
      let scores = Object.keys(snapshot.val()).map(key => snapshot.val()[key])
      scores.sort((score1, score2) => {
        if (score1.score < score2.score) {
          return 1
        } else if (score1.score === score2.score) {
          return 0
        } else {
          return -1
        }
      })
      if (scores.length > 10) {
        scores = scores.slice(0, 10)
      }
      this.scores.push(scores);
    }
  }

  writeHighScore() {
    const ctx = this.ctx;
    if (this.game.moving) {
      this.lowestHighScore = this.scores[0][9];
    } else {
      this.lowestHighScore = this.scores[1][9];
    }
    if (!this.lowestHighScore || this.game.score > this.lowestHighScore.score) {
      ctx.strokeText('New high score! Enter a username!', 84, 335);
      ctx.fillText('New high score! Enter a username!', 84, 335);
      let input = $('#username-input');
      input.css('z-index', '5');
      input.keypress(this.submitHighScore)
    }
  }

  submitHighScore(e) {
    if(e.which === 13) {
      this.newHighScoreRef.set({
        username: `${e.currentTarget.value}`,
        score: this.game.score
      });
      this.scores = [];
      this.highScoreRefHard.once('value').then(this.retrieveLowestHighScore);
      this.highScoreRefEasy.once('value').then(this.retrieveLowestHighScore);
      $('#username-input').css('z-index', '-1');
      this.setup();
    }
  }

  renderLeaderboards() {
    const ctx = this.ctx;

    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'yellow';
    ctx.drawImage(this.background, 0, 0, 815, 480);
    this.drawButton(ctx, 510, 30, 100, 40, 5);
    ctx.fillStyle = 'black';
    ctx.font = '20px arial';
    ctx.fillText('Back', 538, 58);
    ctx.fillStyle = 'yellow';
    ctx.strokeText('Leaderboards - Normal', 60, 100);
    ctx.fillText('Leaderboards - Normal', 60, 100);
    this.scores[1].forEach((score, index) => {
      let username = score.username;
      if (username.length > 15) {
        username = username.slice(0, 15) + '...'
      }
      ctx.strokeText(`${index + 1}. ${username} - ${score.score}`, 60, 130 + 30 * index);
      ctx.fillText(`${index + 1}. ${username} - ${score.score}`, 60, 130 + 30 * index);
    })
    ctx.strokeText('Leaderboards - Hard', 310, 100);
    ctx.fillText('Leaderboards - Hard', 310, 100);
    this.scores[0].forEach((score, index) => {
      let username = score.username;
      if (username.length > 15) {
        username = username.slice(0, 15) + '...'
      }
      ctx.strokeText(`${index + 1}. ${username} - ${score.score}`, 310, 130 + 30 * index);
      ctx.fillText(`${index + 1}. ${username} - ${score.score}`, 310, 130 + 30 * index);
    })
    this.canvas.addEventListener('click', this.leaderboardClickHandler);
  }

  leaderboardClickHandler(e) {
    if (e.layerX >= 510 && e.layerX <= 611 && e.layerY >= 30 && e.layerY <= 70) {
      this.canvas.removeEventListener('click', this.leaderboardClickHandler);
      this.setup();
    }
  }
}

module.exports = GameView;
