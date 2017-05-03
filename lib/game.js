const Sheep = require('./sheep');

class Game {
  constructor(){
    // this.time = 0;
    // this.score = 0;
    // this.accuracy = 0;

    this.sheep = [];
  }

  add(sheep) {
    this.sheep.push(sheep);
  }


}

Game.DIM_X = 640;
Game.DIM_Y = 480;
Game.BG_COLOR = '#2f66bf';

module.exports = Game;
