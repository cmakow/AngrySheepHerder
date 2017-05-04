const Sheep = require('./sheep');
const Game = require('./game');

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  canvasEl.width = '640';
  canvasEl.height = '480';

  const ctx = canvasEl.getContext('2d');
  const background = document.getElementById('background');

  const f = new Game(canvasEl, ctx);
  background.addEventListener('load', () => {
    f.setup();
  })
});
