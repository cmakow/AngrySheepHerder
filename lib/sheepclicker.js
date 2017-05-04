const Sheep = require('./sheep');
const Game = require('./game');

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  let f  = new Game();
  canvasEl.width = '640';
  canvasEl.height = '480';

  const ctx = canvasEl.getContext('2d');

  ctx.fillStyle = '#2f66bf';
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  canvas.addEventListener('click', f.onClick)
  let g = setInterval(() => {
    f.renderSheep(ctx); // render array of sheep to canvas
    if (f.lives === 0) { // will eventually be changed to loss condition (lives === 0)
      clearInterval(g);
      f.renderGameOver(ctx);
    }
  }, 30)

});
