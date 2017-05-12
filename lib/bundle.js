/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Sheep = __webpack_require__(0);

class Game {
  constructor(options = {}) {

    this.accuracy = 0;
    this.totalClicks = 0;

    this.time = 0;
    this.score = 0;
    this.lives = options.lives || 3;
    this.interval = options.interval || 600;

    this.moving = options.moving || false;

    this.escapedSheep = [];
    this.sheep = [];

    this.background = document.getElementById('background');

    this.addSheep = this.addSheep.bind(this);
    this.loseLife = this.loseLife.bind(this);
    this.onClick = this.onClick.bind(this);
    this.sheepAdder = this.sheepAdder.bind(this);
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
    this.incrementTime = this.incrementTime.bind(this);
    this.calculateAccuracy = this.calculateAccuracy.bind(this);
  }

  addSheep(sheep) {
    this.sheep.push(sheep);
  }

  loseLife(sheep) {
    this.lives -= 1;
    this.escapedSheep.push(sheep);
  }

  sheepAdder() {
    this.addSheep(new Sheep({moving: this.moving}));
    if(this.lives > 0) {
      setTimeout(this.sheepAdder, this.interval)
    }
  }

  onClick(e) {
    let hit = false;
    for(let i = 0; i < this.sheep.length; i++) {
      if(this.sheep[i].checkHit(e)) {
        this.score += 1;
        hit = true;
        break;
      }
    }
    if(!hit) {
      // render black circle? noise?
      // Add to miss array that will render for x frames before disappearing?
    }
    this.totalClicks += 1;
    this.calculateAccuracy();
  }

  incrementDifficulty() {
    if(this.interval === 200) {
      return null;
    } else {
      this.interval -= 100;
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

  calculateAccuracy() {
    this.accuracy = Math.floor((this.score / this.totalClicks) * 100);
  }

}

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Sheep = __webpack_require__(0);
const Game = __webpack_require__(1);

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
      if (!this.lowestHighScore || this.game.score > this.lowestHighScore.score) {
        this.newHighScoreRef.set({
          username: 'anonymous',
          score: this.game.score
        });
        this.scores = [];
        this.highScoreRefHard.once('value').then(this.retrieveLowestHighScore);
        this.highScoreRefEasy.once('value').then(this.retrieveLowestHighScore);
        $('#username-input').css('z-index', '-1');
      }
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Sheep = __webpack_require__(0);
const Game = __webpack_require__(1);
const GameView = __webpack_require__(2);

function waitForElement(id, callback){
    var x = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(x);
            callback();
        }
    }, 30);
}

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = '640';
  canvasEl.height = '480';
  $('#canvas').css('cursor', 'pointer');
  const f = new GameView(canvasEl, ctx);

  waitForElement('background', () => {
    f.setup();
  })

  // const background = document.getElementById('background');
  // background.addEventListener('load', () => { //breaks half the time
  //   f.setup();
  // })
  // f.setup(); //breaks the other half of the time
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map