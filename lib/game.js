const Sheep = require('./sheep');

class Game {
  constructor(options = {}) {
    this.highScoreRef = firebase.database().ref('scores');
    this.newHighScoreRef = this.highScoreRef.push();
    this.lowestHighScore = 0;
    this.highScoreRef.on('value', function(snapshot) {
      let scores = Object.keys(snapshot.val()).map(key => snapshot.val()[key])
      scores.sort((score1, score2) => {
        if (score1.score > score2.score) {
          return 1
        } else if (score1.score === score2.score) {
          return 0
        } else {
          return -1
        }
      })
      if (scores.length > 10) {
        scores = scores.slice(scores.length - 10)
      }
      debugger
    })

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
    this.writeHighScore = this.writeHighScore.bind(this);
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

  writeHighScore() {
    this.newHighScoreRef.set({
      username: 'test',
      hard: this.moving,
      score: this.score
    });
  }
}

module.exports = Game;
